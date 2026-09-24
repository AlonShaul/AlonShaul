// netlify/functions/contact.mjs

import 'dotenv/config'; // טעינת משתני סביבה מהקובץ .env

import nodemailer from 'nodemailer';
import validator from 'validator';
import crypto from 'crypto';

// escaping בסיסי למניעת הזרקת HTML כאשר מכניסים קלט משתמש לתוך תוכן ה-HTML של המייל
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// רשימת הדומיינים המורשים לקרוא לפונקציה הזו
const ALLOWED_ORIGINS = [
  'https://alon-shaul-dev.com',
  'https://www.alon-shaul-dev.com',
  'https://alon-shaul-dev.netlify.app'
];

// משתנים לשמירת נתוני הבקשה האחרונה (איידמפוטנסי)
// זכרו: בתהליכי Lambda יתכן והקונטיינר ייאתחל, אבל לרוב הם משתמשים באותה מופע במשך מספר קריאות עוקבות
let lastRequestHash = null;
let lastRequestTime = 0;

// הגדרת transporter עבור Mailjet SMTP עם TLS
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY
  }
});

export default async (request, context) => {
  // בדיקת הדומיין שממנו הגיעה הבקשה – מותר רק לדומיינים של האתר שלנו
  const origin = request.headers.get('origin');
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // כותרות CORS – מאפשרות גישה רק מהדומיינים המורשים, ומגדירות את השיטות המותרות
  const headers = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // טיפול בבקשות OPTIONS לצורך CORS – במידה וקורה זאת, מחזירים תשובה ללא עיבוד
  if (request.method === 'OPTIONS') {
    return new Response(JSON.stringify({ message: 'CORS preflight ok' }), { status: 200, headers });
  }

  // ודא שמדובר בבקשת POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  // חסימת בקשות שמגיעות מדומיין שאינו מורשה (לא רק דפדפן - גם קריאות ישירות עם כותרת Origin מזויפת)
  if (!isAllowedOrigin) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers });
  }

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
  }

  const { name, email, message, website } = data;

  // בדיקת honeypot: שדה שאמור להישאר ריק תמיד עבור משתמשים אנושיים.
  // אם הוא מלא - כנראה בוט - מחזירים "הצלחה" מזויפת בלי לשלוח מייל, כדי לא לחשוף לבוט שהוא נתפס.
  if (website) {
    console.log('Honeypot field filled - treating as bot submission, skipping email send.');
    return new Response(JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!' }), { status: 200, headers });
  }

  // בדיקה בסיסית: אימייל חייב להיות תקין והודעה לא ריקה
  if (!email || !validator.isEmail(email)) {
    return new Response(JSON.stringify({ error: 'כתובת אימייל לא תקינה' }), { status: 400, headers });
  }
  if (!message) {
    return new Response(JSON.stringify({ error: 'יש לספק הודעה' }), { status: 400, headers });
  }

  // מנגנון איידמפוטנסי: חשב hash של תוכן הבקשה ובדוק אם זו בקשה כפולה בתוך חלון זמן קצר (5 שניות)
  const currentHash = crypto.createHash('md5').update(`${name}-${email}-${message}`).digest('hex');
  const now = Date.now();
  if (lastRequestHash === currentHash && (now - lastRequestTime) < 5000) {
    console.log('Duplicate request detected. Ignoring duplicate email sending.');
    return new Response(JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!' }), { status: 200, headers });
  }
  lastRequestHash = currentHash;
  lastRequestTime = now;

  try {
    // יצירת תוכן HTML להודעת המייל
    const hebrewRangeRegex = new RegExp('[' + String.fromCharCode(0x0590) + '-' + String.fromCharCode(0x05ff) + ']');
    const isHebrew = hebrewRangeRegex.test(message);
    const direction = isHebrew ? 'rtl' : 'ltr';
    const textAlign = isHebrew ? 'right' : 'left';
    const htmlContent = `
      <div style="direction: ${direction}; text-align: ${textAlign};">
        <p><strong>שם:</strong> ${escapeHtml(name)}</p>
        <p><strong>אימייל:</strong> ${escapeHtml(email)}</p>
        <p><strong>הודעה:</strong> ${escapeHtml(message)}</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,  // כתובת שולח מאושרת
      to: process.env.EMAIL_TO,      // כתובת יעד (המייל שלך)
      subject: 'הודעת צור קשר חדשה',
      html: htmlContent
    };

    console.log('Attempting to send contact email');
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');

    return new Response(JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!' }), { status: 200, headers });
  } catch (error) {
    console.error('Error in contact function:', error);
    return new Response(JSON.stringify({ error: 'תקלה בעת שליחת ההודעה' }), { status: 500, headers });
  }
};

// Rate Limiting מובנה של Netlify - נאכף ברמת הפלטפורמה, לפני שהקוד שלנו בכלל רץ
export const config = {
  path: '/.netlify/functions/contact',
  rateLimit: {
    windowLimit: 5,
    windowSize: 180, // 3 דקות - המקסימום המותר על ידי Netlify (windowSize <= 180)
    aggregateBy: ['ip']
  }
};
