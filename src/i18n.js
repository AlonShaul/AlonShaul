// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  he: {
    translation: {
      // ==============
      // מפתחות קיימים
      // ==============
      home: "דף הבית",
      profile: "פרופיל",
      projects: "פרויקטים",
      contact: "צור קשר",
      welcome: "ברוכים הבאים לאתר שלי",

      // Home.js
      home_header_titleName: "Alon Shaul",
      home_header_subtitle: "מפתח Frontend",
      home_header_quote: "\"אני משלב גישה חדשנית עם התמחות טכנולוגית מתקדמת, ומקפיד על כל פרט מתוך מחויבות לעיצוב חוויית משתמש מעצימה. בכל פרויקט שאני מוביל, אני מתכנן פתרונות יעילים ואסתטיים שמעניקים ערך אמיתי ומדגישים את כישוריי כמפתח מקצועי\".",

      home_skills_title: "המיומנויות שלי",
      home_skills_subtext: "כל כישור מתואר בקצרה, עם דגש על היכולות וההתמחות שלי.",

      home_skills_react_title: "React",
      home_skills_react_text: "בניית ממשקים דינמיים ומתקדמים.",
      home_skills_node_title: "Node.js",
      home_skills_node_text: "יצירת API מהירים ואמינים.",
      home_skills_tailwind_title: "Tailwind CSS",
      home_skills_tailwind_text: "עיצוב מודרני, רספונסיבי וקל לתפעול.",
      home_skills_htmlcssjs_title: "HTML5 | CSS | JS",
      home_skills_htmlcssjs_text: "בניית אתרים עם HTML5, CSS3 ו-JavaScript.",
      home_skills_mongo_title: "MongoDB",
      home_skills_mongo_text: "ניהול מסדי נתונים NoSQL.",
      home_skills_python_title: "Python",
      home_skills_python_text: "פיתוח backend, סקריפטים ואוטומציה.",

      home_articles_title: "כתבות ומאמרים",

      home_article1_title: "פיתוח אתרים מודרני",
      home_article1_text: "כתבה על שימוש בטכנולוגיות מתקדמות ליצירת אתרים איכותיים.",
      home_article1_link: "קראו עוד",

      home_article2_title: "עולם ה-JavaScript",
      home_article2_text: "מגמות ופיתוחים עכשוויים בתחום JavaScript.",
      home_article2_link: "קראו עוד",

      home_article3_title: "עיצוב חוויית משתמש",
      home_article3_text: "מאמר על חדשנות ויצירתיות בעיצוב חוויית המשתמש.",
      home_article3_link: "קראו עוד",

      // Profile.js
      profile_title: "אודותי",
      profile_text: "אני משלב גישה חדשנית עם התמחות טכנולוגית מתקדמת, ומקפיד על כל פרט מתוך מחויבות לעיצוב חוויית משתמש מעצימה. בכל פרויקט שאני מוביל, אני מתכנן פתרונות יעילים ואסתטיים שמעניקים ערך אמיתי ומדגישים את כישוריי כמפתח מקצועי.",

      // Projects.js
      projects_title: "הפרויקטים שלי",
      // מפתחות תרגום לפרויקט MoveMentor:
      project_title_moveMentor: "מנטור תנועה: מערכת שיקום מותאמת אישית",
      project_description_moveMentor: "מערכת שיקום מותאמת אישית לשיקום פיזי, הכוללת תוכניות אימון אישיות, צ'אטבוט אינטואיטיבי, מערכת אימייל מתקדמת ומעקב סטטיסטי. הפרויקט בנוי בטכנולוגיות React, Node.js, MongoDB, TailwindCSS, HTML, CSS, JavaScript, Chart.js, SendGrid ו-Render.",
      // מפתחות תרגום לפרויקט To Do List:
      project_title_toDoList: "To Do List: אפליקציה לניהול משימות",
      project_description_toDoList: "אפליקציה שנוצרה על מנת לעזור בניהול המשימות היומיות, הכוללת אפשרות להוספת משימה ומחיקת משימה. האפליקציה עובדת בשיתוף עם MongoDB לאחסון נתונים, כך שניתן להמשיך לבצע פעולות גם לאחר סגירת האפליקציה.",

      // MagicGame.js – מפתחות למסך הפתיחה של המשחק
      magicGame_startPrompt_title: "האם אתה מוכן לגלות קסם?",
      magicGame_startPrompt_text: "לחץ על \"התחל\" ותצטרף למסע מרהיב בחלל...",
      magicGame_startPrompt_button: "התחל",

      // Contact.js
      contact_title: "צור קשר",
      contact_label_name: "שם מלא",
      contact_placeholder_name: "הכנס את שמך המלא",
      contact_label_email: "אימייל",
      contact_placeholder_email: "example@mail.com",
      contact_label_message: "הודעה",
      contact_placeholder_message: "כתוב את הודעתך כאן...",
      contact_submit: "שלח",

      contact_error_name: "יש להזין שם מלא המכיל רק אותיות בעברית או באנגלית ורווחים",
      contact_error_email: "אימייל שגוי",
      contact_error_fixFields: "תקלה: אנא תקן את השדות עם השגיאה",
      contact_error_generic: "שגיאה: ",
      contact_error_tryLater: "תקלה בשליחת ההודעה, נסה שוב מאוחר יותר.",

      // הודעת הצלחה בעברית:
      contact_success: "ההודעה התקבלה והמייל נשלח בהצלחה!"
    }
  },
  en: {
    translation: {
      // קיים
      home: "Home",
      profile: "Profile",
      projects: "Projects",
      contact: "Contact",
      welcome: "Welcome to my website",

      // Home.js
      home_header_titleName: "Alon Shaul",
      home_header_subtitle: "Frontend Developer",
      home_header_quote: "\"I bring creativity, innovation, and professionalism to every project, focusing on an advanced user experience\"",

      home_skills_title: "My Skills",
      home_skills_subtext: "Each skill is briefly described, highlighting my strengths and specialties.",

      home_skills_react_title: "React",
      home_skills_react_text: "Building dynamic and advanced interfaces.",
      home_skills_node_title: "Node.js",
      home_skills_node_text: "Creating fast and reliable APIs.",
      home_skills_tailwind_title: "Tailwind CSS",
      home_skills_tailwind_text: "Modern, responsive, and easy to maintain design.",
      home_skills_htmlcssjs_title: "HTML5 | CSS | JS",
      home_skills_htmlcssjs_text: "Building websites with HTML5, CSS3, and JavaScript.",
      home_skills_mongo_title: "MongoDB",
      home_skills_mongo_text: "Managing NoSQL databases.",
      home_skills_python_title: "Python",
      home_skills_python_text: "Backend development, scripting, and automation.",

      home_articles_title: "Articles and Posts",

      home_article1_title: "Modern Web Development",
      home_article1_text: "An article about using cutting-edge technologies to build high-quality websites.",
      home_article1_link: "Read More",

      home_article2_title: "The JavaScript World",
      home_article2_text: "Trends and current developments in the JavaScript ecosystem.",
      home_article2_link: "Read More",

      home_article3_title: "User Experience Design",
      home_article3_text: "An article about innovation and creativity in user experience design.",
      home_article3_link: "Read More",

      // Profile.js
      profile_title: "About Me",
      profile_text: "I am Alon Shaul, a Frontend Developer specializing in creating modern websites, advanced user experiences, and clean design. I believe in combining innovation and technology, bringing creativity to every project.",

      // Projects.js
      projects_title: "My Projects",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "MoveMentor: Personalized Rehabilitation System",
      project_description_moveMentor: "A personalized rehabilitation system for physical recovery, featuring custom workout plans, an intuitive chatbot, advanced email system, and statistical tracking. Built with React, Node.js, MongoDB, TailwindCSS, HTML, CSS, JavaScript, Chart.js, SendGrid, and Render.",
      // Translation keys for project To Do List:
      project_title_toDoList: "To Do List Project",
      project_description_toDoList: "We created an app called 'To Do List Project'. Its purpose is to help manage our daily tasks. The application allows you to add and delete tasks, and it works with MongoDB to store data so that tasks remain available even after exiting the app.",

      // MagicGame.js – Translation keys for the game start prompt
      magicGame_startPrompt_title: "Are you ready to discover magic?",
      magicGame_startPrompt_text: "Click 'Start' and join an amazing journey through space...",
      magicGame_startPrompt_button: "Start",

      // Contact.js
      contact_title: "Contact Me",
      contact_label_name: "Full Name",
      contact_placeholder_name: "Enter your full name",
      contact_label_email: "Email",
      contact_placeholder_email: "example@mail.com",
      contact_label_message: "Message",
      contact_placeholder_message: "Write your message here...",
      contact_submit: "Send",

      contact_error_name: "Please enter a valid name (letters and spaces only)",
      contact_error_email: "Invalid email address",
      contact_error_fixFields: "Error: Please fix the highlighted fields",
      contact_error_generic: "Error: ",
      contact_error_tryLater: "There was a problem sending your message, please try again later.",

      // הודעת הצלחה באנגלית:
      contact_success: "Your message has been sent successfully!"
    }
  },
  ru: {
    translation: {
      // קיים
      home: "Главная",
      profile: "Профиль",
      projects: "Проекты",
      contact: "Контакт",
      welcome: "Добро пожаловать на мой сайт",

      // Home.js
      home_header_titleName: "Алон Шауль",
      home_header_subtitle: "Frontend Разработчик",
      home_header_quote: "\"Я привношу креативность, инновации и профессионализм в каждый проект, уделяя особое внимание продвинутому пользовательскому опыту\"",

      home_skills_title: "Мои навыки",
      home_skills_subtext: "Каждый навык описан кратко, с акцентом на мои сильные стороны и специализации.",

      home_skills_react_title: "React",
      home_skills_react_text: "Creating dynamic and modern interfaces.",
      home_skills_node_title: "Node.js",
      home_skills_node_text: "Creating fast and reliable APIs.",
      home_skills_tailwind_title: "Tailwind CSS",
      home_skills_tailwind_text: "Modern, adaptive, and easy-to-maintain design.",
      home_skills_htmlcssjs_title: "HTML5 | CSS | JS",
      home_skills_htmlcssjs_text: "Building websites using HTML5, CSS3, and JavaScript.",
      home_skills_mongo_title: "MongoDB",
      home_skills_mongo_text: "Managing NoSQL databases.",
      home_skills_python_title: "Python",
      home_skills_python_text: "Backend development, scripting, and automation.",

      home_articles_title: "Статьи и публикации",

      home_article1_title: "Modern Web Development",
      home_article1_text: "An article about using advanced technologies to create high-quality websites.",
      home_article1_link: "Read More",

      home_article2_title: "The JavaScript World",
      home_article2_text: "Trends and current developments in the JavaScript ecosystem.",
      home_article2_link: "Read More",

      home_article3_title: "User Experience Design",
      home_article3_text: "An article about innovation and creativity in user experience design.",
      home_article3_link: "Read More",

      // Profile.js
      profile_title: "Обо мне",
      profile_text: "Я Алон Шауль, Frontend-разработчик, специализирующийся на создании современных сайтов, продвинутом пользовательском опыте и чистом дизайне. Я верю в сочетание инноваций и технологий, внося творческий подход в каждый проект.",

      // Projects.js
      projects_title: "Мои проекты",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "Ментор Движения: Персонализированная система реабилитации",
      project_description_moveMentor: "Персонализированная система реабилитации для физического восстановления, включающая индивидуальные планы тренировок, интуитивно понятного чат-бота, продвинутую систему электронной почты и статистический трекинг. Проект построен с использованием React, Node.js, MongoDB, TailwindCSS, HTML, CSS, JavaScript, Chart.js, SendGrid и Render.",
      // Translation keys for project To Do List:
      project_title_toDoList: "Проект To Do List",
      project_description_toDoList: "Мы создали приложение 'To Do List Project'. Его цель – помочь в управлении ежедневными задачами. Приложение позволяет добавлять и удалять задачи, и оно работает совместно с MongoDB для хранения данных, чтобы задачи сохранялись даже после выхода из приложения.",

      // MagicGame.js – Translation keys for the game start prompt
      magicGame_startPrompt_title: "Вы готовы открыть магию?",
      magicGame_startPrompt_text: "Нажмите 'Начать' и присоединитесь к удивительному путешествию по космосу...",
      magicGame_startPrompt_button: "Начать",

      // Contact.js
      contact_title: "Свяжитесь со мной",
      contact_label_name: "Полное имя",
      contact_placeholder_name: "Введите ваше полное имя",
      contact_label_email: "Электронная почта",
      contact_placeholder_email: "example@mail.com",
      contact_label_message: "Сообщение",
      contact_placeholder_message: "Напишите ваше сообщение здесь...",
      contact_submit: "Отправить",

      contact_error_name: "Введите корректное имя (только буквы и пробелы)",
      contact_error_email: "Неверный адрес электронной почты",
      contact_error_fixFields: "Ошибка: Пожалуйста, исправьте выделенные поля",
      contact_error_generic: "Ошибка: ",
      contact_error_tryLater: "Произошла ошибка при отправке сообщения, попробуйте позже.",

      // הודעת הצלחה на русском:
      contact_success: "Ваше сообщение успешно отправлено!"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'he',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
