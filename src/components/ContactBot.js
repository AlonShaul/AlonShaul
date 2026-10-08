import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import botImage from '../bot.jpg'; // עדכן את הנתיב לתמונה הנכונה

// מערך "questions" מועבר מחוץ לרכיב – הוא קבוע ולא משתנה.
// הודעות הבוט נשמרות כמפתחות תרגום, כך שהשיחה מוצגת בשפה הנוכחית גם לאחר החלפת שפה.
const questions = ['bot_q_intro', 'bot_q_name', 'bot_q_email', 'bot_q_message'];

// זיהוי תשובת "כן" / "לא" לשאלת הפתיחה, לפי שפת האתר
const answerPatterns = {
  he: { yes: /כן|בטח|אשמח/, no: /לא|לא רוצה|תודה/ },
  en: { yes: /\b(yes|yeah|yep|sure|ok|okay)\b/, no: /\b(no|nope)\b|thanks/ },
  ru: { yes: /да|конечно|хочу|ок/, no: /нет|не хочу|спасибо/ }
};

// מיפוי קודי שגיאה שהשרת מחזיר להודעות מתורגמות; קוד לא מוכר נופל חזרה להתנהגות הקיימת (טקסט גולמי מהשרת)
const BOT_ERROR_KEYS = {
  INVALID_NAME: 'bot_invalid_name',
  INVALID_EMAIL: 'bot_invalid_email',
  EMAIL_TOO_LONG: 'bot_email_too_long',
  MESSAGE_TOO_LONG: 'bot_message_too_long',
  SEND_FAILED: 'bot_send_error_later'
};

const ContactBot = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const patterns = answerPatterns[i18n.language] || answerPatterns.he;

  // מצב פתיחת חלון הצ'אט
  const [isOpen, setIsOpen] = useState(false);
  // מערך הודעות (השיחה)
  const [messages, setMessages] = useState([]);
  // ערך הקלט
  const [input, setInput] = useState('');
  // אינדקס השאלה הנוכחית
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // נתוני המשתמש
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // שדה honeypot - נשאר ריק תמיד בזרימה הלגיטימית של הבוט
  });
  // האם השיחה הסתיימה
  const [conversationEnded, setConversationEnded] = useState(false);

  const messagesEndRef = useRef(null);

  // אתחול הודעת הפתיחה אם אין הודעות
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ key: questions[0], user: 'bot' }]);
    }
    scrollToBottom();
  }, [messages]);

  // סגירת חלון הצ'אט בעת ניווט בין דפי האתר (השיחה נשמרת, אך החלון נסגר)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // validateName uses Unicode letter matching so legitimate names in any script
  // (Hebrew, Latin, Cyrillic, etc.) pass, without hand-maintaining per-alphabet ranges.
  const validateName = (value) => {
    const regex = /^[\p{L}\s]+$/u;
    return regex.test(value);
  };

  const validateEmail = (value) => value.includes('@');

  const handleSend = async () => {
    if (input.trim() === '' || conversationEnded) return;

    const newMessages = [...messages, { text: input, user: 'me' }];
    let reply = ''; // מפתח תרגום של תשובת הבוט
    let updatedData = { ...userData };
    let validResponse = false;

    switch (currentQuestion) {
      case 0:
        if (patterns.yes.test(input.toLowerCase())) {
          validResponse = true;
          reply = questions[1];
        } else if (patterns.no.test(input.toLowerCase())) {
          validResponse = true;
          reply = 'bot_bye';
          setConversationEnded(true);
        } else {
          reply = 'bot_yes_no';
        }
        break;
      case 1:
        if (validateName(input)) {
          validResponse = true;
          updatedData.name = input;
          reply = questions[2];
        } else {
          reply = 'bot_invalid_name';
        }
        break;
      case 2:
        if (validateEmail(input)) {
          validResponse = true;
          updatedData.email = input;
          reply = questions[3];
        } else {
          reply = 'bot_invalid_email';
        }
        break;
      case 3:
        if (input.trim().length > 0) {
          validResponse = true;
          updatedData.message = input;
          await sendContactMessage(updatedData, newMessages);
          return;
        } else {
          reply = 'bot_empty_message';
        }
        break;
      default:
        break;
    }

    if (!validResponse) {
      setInput('');
      setMessages([...newMessages, { key: reply, user: 'bot' }]);
      return;
    }

    setUserData(updatedData);
    setMessages([...newMessages, { key: reply, user: 'bot' }]);
    setCurrentQuestion(currentQuestion + 1);
    setInput('');
  };

  const sendContactMessage = async (data, currentMessages) => {
    try {
      const res = await fetch(`/.netlify/functions/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      // אם השרת החזיר errorCode מוכר - מציגים הודעה מתורגמת; אחרת נופלים חזרה לטקסט הגולמי מהשרת
      const mappedKey = result.error ? BOT_ERROR_KEYS[result.errorCode] : null;
      const botReply = !result.error
        ? { key: 'bot_sent', user: 'bot' }
        : mappedKey
          ? { key: mappedKey, user: 'bot' }
          : { key: 'bot_send_error_prefix', suffix: result.error, user: 'bot' };
      setMessages([...currentMessages, botReply]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...currentMessages,
        { key: 'bot_send_error_later', user: 'bot' }
      ]);
    }
    setConversationEnded(true);
  };

  return (
    // מיקום בצד "start" הלוגי: ב-RTL (עברית) start=ימין - כפי שהיה עד כה ללא שינוי;
    // ב-LTR (אנגלית/רוסית) start=שמאל - מראה של המיקום בעברית.
    <div className="fixed bottom-4 start-4 z-50">
      {/* כפתור עגול "בוט" כאשר החלון סגור */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            Chat
          </motion.button>
        )}
      </AnimatePresence>

      {/* כפתור "סגור" מרחף מעל החלון */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="close-button"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(false)}
            // מיקום בצד "end" הלוגי: ב-RTL (עברית) end=שמאל - כפי שהיה עד כה; ב-LTR end=ימין - מראה
            className={`w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-lg absolute end-0 -top-14 ${direction === 'rtl' ? '' : 'text-xs'}`}
          >
            {t('bot_close')}
          </motion.button>
        )}
      </AnimatePresence>

      {/* חלון הצ'אט – מלבן קבוע עם גבולות וגרדיאנט */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative w-80 h-96 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex flex-col bg-gradient-to-r from-blue-500 to-blue-700 text-white"
            style={{ direction }}
          >
            {/* אזור ההודעות – קבוע בגובה עם גלילה */}
            {/* כדי שהסרגל יהיה בצד ימין, הקונטיינר החיצוני מוגדר כ־LTR */}
            <div className="flex-1 px-3 pb-3 overflow-y-auto custom-scrollbar" style={{ direction: 'ltr' }}>
              <div style={{ direction }}>
                {messages.map((msg, idx) => {
                  if (msg.user === 'bot') {
                    // הודעת בוט: מוצגת משמאל, תמונה מימין לטקסט
                    return (
                      <div key={idx} className="flex justify-start items-center mb-3">
                        <img
                          src={botImage}
                          alt="Bot"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="bg-white/20 dark:bg-black/30 p-2 rounded-md">
                          {msg.key ? `${t(msg.key)}${msg.suffix || ''}` : msg.text}
                        </div>
                      </div>
                    );
                  } else {
                    // הודעת המשתמש: מוצגת מימין
                    return (
                      <div key={idx} className="flex justify-end mb-3">
                        <div className="bg-white/20 dark:bg-black/30 p-2 rounded-md">
                          {msg.key ? `${t(msg.key)}${msg.suffix || ''}` : msg.text}
                        </div>
                      </div>
                    );
                  }
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* אזור הקלט – נשאר לבן/שחור במצב חושך */}
            {!conversationEnded && (
              <div className="flex border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
                  className="w-full p-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                  placeholder={t('bot_placeholder')}
                  style={{ direction }}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 dark:bg-blue-600 text-white p-2"
                >
                  {t('bot_send')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactBot;
