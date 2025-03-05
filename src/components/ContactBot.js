import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import botImage from '../bot.jpg'; // עדכן את הנתיב לתמונה הנכונה

// מערך "questions" מועבר מחוץ לרכיב – הוא קבוע ולא משתנה
const questions = [
  'שלום, אני הבוט של האתר. האם תרצה ליצור קשר עם אלון שאול?',
  'איך קוראים לך?',
  'מה כתובת המייל שלך?',
  'מה ההודעה שברצונך לשלוח?'
];

const ContactBot = () => {
  const location = useLocation();

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
    message: ''
  });
  // האם השיחה הסתיימה
  const [conversationEnded, setConversationEnded] = useState(false);

  const messagesEndRef = useRef(null);

  // אתחול הודעת הפתיחה אם אין הודעות
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ text: questions[0], user: 'bot' }]);
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

  const validateName = (value) => {
    const regex = /^[A-Za-z\u0590-\u05FF\s]+$/;
    return regex.test(value);
  };

  const validateEmail = (value) => value.includes('@');

  const handleSend = async () => {
    if (input.trim() === '' || conversationEnded) return;

    const newMessages = [...messages, { text: input, user: 'me' }];
    let reply = '';
    let updatedData = { ...userData };
    let validResponse = false;

    switch (currentQuestion) {
      case 0:
        if (/כן|בטח|אשמח/.test(input.toLowerCase())) {
          validResponse = true;
          reply = questions[1];
        } else if (/לא|לא רוצה|תודה/.test(input.toLowerCase())) {
          validResponse = true;
          reply = 'תודה, שיהיה לך יום טוב!';
          setConversationEnded(true);
        } else {
          reply = 'סליחה, אנא השב ב"כן" או "לא".';
        }
        break;
      case 1:
        if (validateName(input)) {
          validResponse = true;
          updatedData.name = input;
          reply = questions[2];
        } else {
          reply = 'שם לא תקין, אנא הזן שם בעברית או באנגלית בלבד.';
        }
        break;
      case 2:
        if (validateEmail(input)) {
          validResponse = true;
          updatedData.email = input;
          reply = questions[3];
        } else {
          reply = 'כתובת מייל לא תקינה, אנא נסה שוב.';
        }
        break;
      case 3:
        if (input.trim().length > 0) {
          validResponse = true;
          updatedData.message = input;
          await sendContactMessage(updatedData, newMessages);
          return;
        } else {
          reply = 'נא להזין הודעה.';
        }
        break;
      default:
        break;
    }

    if (!validResponse) {
      setInput('');
      setMessages([...newMessages, { text: reply, user: 'bot' }]);
      return;
    }

    setUserData(updatedData);
    setMessages([...newMessages, { text: reply, user: 'bot' }]);
    setCurrentQuestion(currentQuestion + 1);
    setInput('');
  };

  const sendContactMessage = async (data, currentMessages) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      const botReply = result.error
        ? 'תקלה בשליחת ההודעה: ' + result.error
        : result.message;
      setMessages([...currentMessages, { text: botReply, user: 'bot' }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...currentMessages,
        { text: 'תקלה בשליחת ההודעה, נסה שוב מאוחר יותר.', user: 'bot' }
      ]);
    }
    setConversationEnded(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
            className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center shadow-lg absolute left-0 -top-14"
          >
            סגור
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
            style={{ direction: 'rtl' }}
          >
            {/* אזור ההודעות – קבוע בגובה עם גלילה */}
            {/* כדי שהסרגל יהיה בצד ימין, הקונטיינר החיצוני מוגדר כ־LTR */}
            <div className="flex-1 px-3 pb-3 overflow-y-auto custom-scrollbar" style={{ direction: 'ltr' }}>
              <div style={{ direction: 'rtl' }}>
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
                          {msg.text}
                        </div>
                      </div>
                    );
                  } else {
                    // הודעת המשתמש: מוצגת מימין
                    return (
                      <div key={idx} className="flex justify-end mb-3">
                        <div className="bg-white/20 dark:bg-black/30 p-2 rounded-md">
                          {msg.text}
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
                  placeholder="רשום את תשובתך..."
                  style={{ direction: 'rtl' }}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 dark:bg-blue-600 text-white p-2"
                >
                  שלח
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
