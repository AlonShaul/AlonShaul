import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DynamicSquares from '../components/DynamicSquares';
import { FaUser, FaEnvelope, FaCommentAlt } from 'react-icons/fa';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [responseMsg, setResponseMsg] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });

  // בדיקת שם מלא – מאפשר רק אותיות בעברית או באנגלית ורווחים
  const validateName = (value) => {
    const regex = /^[A-Za-z\u0590-\u05FF\s]+$/;
    return regex.test(value);
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
      if (!value.includes('@')) {
        setErrors((prev) => ({ ...prev, email: t('contact_error_email') }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.name || errors.email) {
      setResponseMsg(t('contact_error_fixFields'));
      return;
    }
    fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setResponseMsg(t('contact_error_generic') + data.error);
        } else {
          setResponseMsg(t('contact_success'));
          setFormData({ name: '', email: '', message: '' });
        }
      })
      .catch((err) => {
        console.error(err);
        setResponseMsg(t('contact_error_tryLater'));
      });
  };

  const paddingClass = isRTL ? 'pr-12' : 'pl-12';
  const iconPosition = isRTL ? 'right-3' : 'left-3';

  return (
    <>
      {/* רקע דינמי עם ריבועים – מוצג תמיד מאחורי התוכן */}
      <DynamicSquares />
      <motion.div
        className="pt-24"  // רווח עליון כמו בשאר הדפים
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <section className="py-16 bg-white dark:bg-gray-900 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-blue-700 dark:text-white mb-4">
              {t('contact_title')}
            </h2>
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
              className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 mt-8"
            >
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
                  />
                  <FaUser
                    className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400 text-lg`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 mt-1 text-sm">{errors.name}</p>
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
                  />
                  <FaEnvelope
                    className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-400 text-lg`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
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
                whileHover={{ scale: 1.05 }}
                className="w-full h-12 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded transition duration-300"
              >
                {t('contact_submit')}
              </motion.button>

              {responseMsg && (
                <p className="text-center mt-4 text-green-600 dark:text-green-400 font-semibold">
                  {responseMsg}
                </p>
              )}
            </motion.form>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Contact;
