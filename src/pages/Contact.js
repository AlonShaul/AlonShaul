import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicSquares from '../components/DynamicSquares';
import Seo from '../components/Seo';
import { FaUser, FaEnvelope, FaCommentAlt } from 'react-icons/fa';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [responseMsg, setResponseMsg] = useState('');
  const [responseStatus, setResponseStatus] = useState(null); // 'success' | 'error' | null
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // validateName uses Unicode letter matching so legitimate names in any script
  // (Hebrew, Latin, Cyrillic, etc.) pass, without hand-maintaining per-alphabet ranges.
  const validateName = (value) => {
    const regex = /^[\p{L}\s]+$/u;
    return regex.test(value);
  };

  // Lightweight client-side email check (not a full RFC validator - the server's
  // validator.isEmail() remains authoritative). Catches obviously invalid addresses
  // (missing "@", missing domain/TLD, stray whitespace) before a network round-trip.
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Maps server-returned error codes to translated i18n keys. An unrecognized/missing
  // code falls back to the existing behavior (raw error text from the server).
  const SERVER_ERROR_KEYS = {
    INVALID_INPUT: 'contact_error_invalidInput',
    INVALID_NAME: 'contact_error_name',
    EMAIL_TOO_LONG: 'contact_error_emailTooLong',
    MESSAGE_TOO_LONG: 'contact_error_messageTooLong',
    INVALID_EMAIL: 'contact_error_email',
    MESSAGE_REQUIRED: 'contact_error_messageRequired',
    SEND_FAILED: 'contact_error_tryLater'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'name') {
      if (!validateName(value)) {
        setErrors((prev) => ({ ...prev, name: t('contact_error_name') }));
      } else {
        setErrors((prev) => ({ ...prev, name: '' }));
      }
    }
    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: t('contact_error_email') }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // מונע שליחה כפולה - הן מלחיצה חוזרת בזמן שבקשה כבר רצה, והן כפתור מושבת ויזואלית
    if (isSubmitting) return;
    if (errors.name || errors.email) {
      setResponseStatus('error');
      setResponseMsg(t('contact_error_fixFields'));
      return;
    }
    setIsSubmitting(true);
    // הפנייה ישירות לפונקציה דרך הנתיב המיוחד של Netlify
    fetch(`/.netlify/functions/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // אם השרת החזיר errorCode מוכר - מציגים הודעה מתורגמת; אחרת נופלים חזרה לטקסט הגולמי מהשרת
          const translatedKey = SERVER_ERROR_KEYS[data.errorCode];
          setResponseStatus('error');
          setResponseMsg(translatedKey ? t(translatedKey) : t('contact_error_generic') + data.error);
        } else {
          setResponseStatus('success');
          setResponseMsg(t('contact_success'));
          setFormData({ name: '', email: '', message: '', website: '' });
        }
      })
      .catch((err) => {
        console.error(err);
        setResponseStatus('error');
        setResponseMsg(t('contact_error_tryLater'));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const paddingClass = isRTL ? 'pr-12' : 'pl-12';
  const iconPosition = isRTL ? 'right-3' : 'left-3';

  return (
    <>
      <Seo page="contact" path="/contact" />
      {/* רקע דינמי עם ריבועים – מוצג תמיד מאחורי התוכן */}
      <DynamicSquares />
      <motion.div
        className="pt-24"  // רווח עליון כמו בשאר הדפים
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* הוסר bg-white/dark:bg-gray-900 שכיסה את הרקע המונפש (DynamicSquares,
            שממוקם ב-z-10 שלילי) - טופס יצירת הקשר עצמו (bg-gray-100/dark:bg-gray-800) כבר אטום */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-white mb-4">
              {t('contact_title')}
            </h1>
            {/* קו תחתון אנימטיבי מתחת לכותרת בלבד */}
            <motion.div
              className="mt-2 w-24 h-1 bg-blue-700 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: '6rem' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            {/* טופס יצירת קשר */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg mt-8"
            >
              {/* שדה honeypot - מוסתר מעין אנושית, נועד ללכוד בוטים שממלאים את כל שדות הטופס.
                  sr-only (ולא position:absolute; left:-9999px) - הגרסה הקודמת דחפה את האלמנט
                  אלפי פיקסלים מחוץ לדף בלי שום אב-מכיל עם overflow:hidden שיבלום אותו, מה שהרחיב
                  את document.documentElement.scrollWidth והפך את כל העמוד לגלילה אופקית. sr-only
                  משתמש ב-clip+margin:-1px (התבנית הסטנדרטית לתוכן מוסתר-ויזואלית) ונשאר בתוך
                  זרימת הפריסה הרגילה - אותה תוצאה (בלתי-נראה, לא נגיש לקוראי מסך הודות ל-
                  aria-hidden) בלי להרחיב את רוחב המסמך. */}
              <div aria-hidden="true" className="sr-only">
                <label htmlFor="website">Leave this field blank</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* שדה שם מלא */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                >
                  {t('contact_label_name')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact_placeholder_name')}
                    className={`w-full ${paddingClass} h-12 leading-tight border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  <FaUser
                    className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400 text-lg`}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" role="alert" className="text-red-500 mt-1 text-sm">{errors.name}</p>
                )}
              </div>

              {/* שדה אימייל */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                >
                  {t('contact_label_email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact_placeholder_email')}
                    className={`w-full ${paddingClass} h-12 leading-tight border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  <FaEnvelope
                    className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400 text-lg`}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-red-500 mt-1 text-sm">{errors.email}</p>
                )}
              </div>

              {/* שדה הודעה */}
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                >
                  {t('contact_label_message')}
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact_placeholder_message')}
                    className={`w-full ${paddingClass} p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white leading-tight`}
                    rows={4}
                    required
                  ></textarea>
                  <FaCommentAlt
                    className={`absolute ${iconPosition} top-3 text-gray-400 text-lg`}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                whileHover={isSubmitting ? undefined : { scale: 1.05 }}
                className="w-full h-12 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-500 dark:disabled:hover:bg-blue-600"
              >
                {isSubmitting ? t('contact_submit_sending') : t('contact_submit')}
              </motion.button>

              {responseMsg && (
                responseStatus === 'error' ? (
                  <p role="alert" className="text-center mt-4 text-red-600 dark:text-red-400 font-semibold">
                    {responseMsg}
                  </p>
                ) : (
                  <p role="status" aria-live="polite" className="text-center mt-4 text-green-600 dark:text-green-400 font-semibold">
                    {responseMsg}
                  </p>
                )
              )}
            </motion.form>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Contact;
