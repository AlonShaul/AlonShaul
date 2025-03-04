// netlify/functions/contact.js

require('dotenv').config(); // טעינת משתני סביבה מהקובץ .env

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nodemailer = require('nodemailer');
const validator = require('validator');

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

// פונקציה אסינכרונית שמטפלת בבקשת POST ליצירת קשר
exports.handler = async (event, context) => {
  // ודא שמדובר בבקשת POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { name, email, message } = data;

  // בדיקה בסיסית: אימייל חייב להיות תקין והודעה לא ריקה
  if (!email || !validator.isEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'כתובת אימייל לא תקינה' })
    };
  }
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'יש לספק הודעה' })
    };
  }

  try {
    // שמירת ההודעה במסד הנתונים באמצעות Prisma
    const newContact = await prisma.contact.create({
      data: { name, email, message }
    });

    // בדיקה אם ההודעה מכילה תווים עבריים
    const isHebrew = /[\u0590-\u05FF]/.test(message);
    const direction = isHebrew ? 'rtl' : 'ltr';
    const textAlign = isHebrew ? 'right' : 'left';

    // יצירת תוכן HTML עם הגדרת כיוון ויישור בהתאם
    const htmlContent = `
      <div style="direction: ${direction}; text-align: ${textAlign};">
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>הודעה:</strong> ${message}</p>
      </div>
    `;

    // הגדרת הודעת המייל לשליחה
    const mailOptions = {
      from: process.env.EMAIL_FROM,   // כתובת שולח מאושרת
      to: process.env.EMAIL_TO,         // כתובת יעד
      subject: 'הודעת צור קשר חדשה',
      html: htmlContent
    };

    // לוגים לצורך בדיקה (ניתן להשאיר אותם, הם בתוך הפונקציה האסינכרונית)
    console.log('Attempting to send mail with options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'ההודעה התקבלה והמייל נשלח!', data: newContact })
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'תקלה בעת שמירת ההודעה' })
    };
  }
};