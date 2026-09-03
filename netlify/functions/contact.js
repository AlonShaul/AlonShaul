// netlify/functions/contact.js

require('dotenv').config(); // טעינת משתני סביבה מהקובץ .env

const nodemailer = require('nodemailer');
const validator = require('validator');
const crypto = require('crypto');
const { connectLambda, getStore } = require('@netlify/blobs');

// רשימת הדומיינים המורשים לקרוא לפונקציה הזו
const ALLOWED_ORIGINS = [
  'https://alon-shaul-dev.com',
  'https://www.alon-shaul-dev.com',
  'https://alon-shaul-dev.netlify.app'
];

// הגדרות Rate Limiting: מקסימום בקשות מותרות לכל כתובת IP, בתוך חלון הזמן שהוגדר
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 דקות

// שליפת כתובת ה-IP של השולח מתוך כותרות הבקשה שנטליפיי מוסיפה
function getClientIp(event) {
  const forwardedFor = event.headers['x-forwarded-for'] || '';
  return (
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    forwardedFor.split(',')[0].trim() ||
    'unknown'
  );
}

// בדיקת Rate Limiting מול Netlify Blobs – מחזיר אם הבקשה מותרת, ואם לא, כעבור כמה שניות אפשר לנסות שוב
async function checkRateLimit(ip) {
  const store = getStore('contact-rate-limit');
  const key = `ip:${ip}`;
  const now = Date.now();

  let record = await store.get(key, { type: 'json' });

  if (!record || (now - record.windowStart) >= RATE_LIMIT_WINDOW_MS) {
    // אין רשומה קודמת, או שחלון הזמן הקודם כבר הסתיים – פותחים חלון חדש
    await store.setJSON(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((record.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  await store.setJSON(key, { count: record.count + 1, windowStart: record.windowStart });
  return { allowed: true };
}

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

exports.handler = async (event, context) => {
  // בדיקת הדומיין שממנו הגיעה הבקשה – מותר רק לדומיינים של האתר שלנו
  const origin = event.headers.origin || event.headers.Origin;
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);

  // כותרות CORS – מאפשרות גישה רק מהדומיינים המורשים, ומגדירות את השיטות המותרות
  const headers = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // טיפול בבקשות OPTIONS לצורך CORS – במידה וקורה זאת, מחזירים תשובה ללא עיבוד
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight ok" })
    };
  }

  // ודא שמדובר בבקשת POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // חסימת בקשות שמגיעות מדומיין שאינו מורשה (לא רק דפדפן - גם קריאות ישירות עם כותרת Origin מזויפת)
  if (!isAllowedOrigin) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Origin not allowed' })
    };
  }

  // הגבלת קצב בקשות: מקסימום RATE_LIMIT_MAX_REQUESTS בקשות לכל IP בתוך RATE_LIMIT_WINDOW_MS
  // ברירת מחדל: אם הבדיקה נכשלת מסיבה כלשהי (Blobs לא זמין וכו') - לא לחסום את הבקשה
  let rateLimitResult = { allowed: true };
  try {
    connectLambda(event); // חובה לפני שימוש ב-getStore במצב Lambda compatibility
    const clientIp = getClientIp(event);
    rateLimitResult = await checkRateLimit(clientIp);
  } catch (err) {
    console.error('Rate limit check failed, allowing request through:', err);
  }
  if (!rateLimitResult.allowed) {
    return {
      statusCode: 429,
      headers: { ...headers, 'Retry-After': String(rateLimitResult.retryAfterSeconds) },
      body: JSON.stringify({
        error: `יותר מדי בקשות. נסה שוב בעוד כ-${Math.ceil(rateLimitResult.retryAfterSeconds / 60)} דקות.`
      })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { name, email, message } = data;

  // בדיקה בסיסית: אימייל חייב להיות תקין והודעה לא ריקה
  if (!email || !validator.isEmail(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'כתובת אימייל לא תקינה' })
    };
  }
  if (!message) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'יש לספק הודעה' })
    };
  }

  // מנגנון איידמפוטנסי: חשב hash של תוכן הבקשה ובדוק אם זו בקשה כפולה בתוך חלון זמן קצר (5 שניות)
  const currentHash = crypto.createHash('md5').update(`${name}-${email}-${message}`).digest('hex');
  const now = Date.now();
  if (lastRequestHash === currentHash && (now - lastRequestTime) < 5000) {
    console.log('Duplicate request detected. Ignoring duplicate email sending.');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!' })
    };
  }
  lastRequestHash = currentHash;
  lastRequestTime = now;

  try {
    // יצירת תוכן HTML להודעת המייל
    const isHebrew = /[\u0590-\u05FF]/.test(message);
    const direction = isHebrew ? 'rtl' : 'ltr';
    const textAlign = isHebrew ? 'right' : 'left';
    const htmlContent = `
      <div style="direction: ${direction}; text-align: ${textAlign};">
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>הודעה:</strong> ${message}</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,  // כתובת שולח מאושרת
      to: process.env.EMAIL_TO,      // כתובת יעד (המייל שלך)
      subject: 'הודעת צור קשר חדשה',
      html: htmlContent
    };

    console.log('Attempting to send mail with options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!' })
    };
  } catch (error) {
    console.error('Error in contact function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'תקלה בעת שליחת ההודעה' })
    };
  }
};
