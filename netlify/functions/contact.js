// netlify/functions/contact.js

require('dotenv').config(); // טעינת משתני סביבה מהקובץ .env

const nodemailer = require('nodemailer');
const validator = require('validator');

// כותרות CORS – מאפשרות גישה מכל מקור, ומגדירות את השיטות המותרים
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// הגדרת transporter עבור Mailjet SMTP עם TLS
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY
  },
  tls: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
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
