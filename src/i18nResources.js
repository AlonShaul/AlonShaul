// frontend/src/i18nResources.js
//
// מקור האמת היחיד לכל תוכן התרגום (he/en/ru). קובץ טהור לגמרי - בלי React,
// בלי window/document, בלי אתחול i18next - כדי שניתן יהיה לייבא אותו גם
// מ-i18n.js (לדפדפן) וגם מ-scripts/generate-static-seo.mjs (מ-Node, בזמן build).
// אין לשנות כאן תרגומים בלי סיבה - זהו העתק 1:1 ממה שהיה קודם בתוך i18n.js.
export const resources = {
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
      home_header_subtitle: "מפתח Full-Stack",
      home_header_quote: "\"אני משלב גישה חדשנית עם התמחות טכנולוגית מתקדמת, ומקפיד על כל פרט מתוך מחויבות לעיצוב חוויית משתמש מעצימה.\nבכל פרויקט שאני מוביל, אני מתכנן פתרונות יעילים ואסתטיים שמעניקים ערך אמיתי ומדגישים את כישוריי כמפתח מקצועי\".",

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
      profile_text: "שמי אלון שאול, בוגר תואר במדעי המחשב עם הכשרה מקצועית בפיתוח אתרים, ומפתח Full-Stack המתמחה ביצירת ממשקים דינאמיים ומודרניים. במהלך לימודיי והניסיון שצברתי, פיתחתי יכולת לשלב ידע תיאורטי עמוק עם יישום מעשי של טכנולוגיות עדכניות, תוך הקפדה על סטנדרטים גבוהים ליצירת חוויות משתמש חלקות ואינטואיטיביות. אני מחויב להביא את הידע והניסיון שצברתי לכל פרויקט, תוך יצירת פתרונות דיגיטליים חדשניים המשלבים מקצוענות, איכות ומצוינות.",
      
      // Projects.js
      projects_title: "הפרויקטים שלי",
      // מפתחות תרגום לפרויקט MoveMentor:
      project_title_moveMentor: "MoveMentor: מערכת שיקום מותאמת אישית",
      project_description_moveMentor: "מערכת שיקום פיזי מותאמת אישית, עם תוכניות אימון אישיות, צ'אטבוט אינטואיטיבי, מערכת אימייל מתקדמת ומעקב סטטיסטי.",
      // מפתחות תרגום לפרויקט To Do List:
      project_title_toDoList: "To Do List: אפליקציה לניהול משימות",
      project_description_toDoList: "אפליקציה לניהול משימות יומיות: הוספה ומחיקה של משימות, עם שמירת הנתונים ב-MongoDB כך שהמשימות נשארות זמינות גם לאחר סגירת האפליקציה.",

      // ProjectShowcase.js – טקסטים של תצוגת הפרויקטים
      projects_carousel_label: "תצוגת פרויקטים",
      projects_prev: "הפרויקט הקודם",
      projects_next: "הפרויקט הבא",
      projects_status: "פרויקט {{current}} מתוך {{total}}",
      projects_go_to: "מעבר לפרויקט {{current}}",
      projects_view_github: "צפייה ב-GitHub",
      projects_new_tab: "נפתח בלשונית חדשה",
      projects_tech_label: "טכנולוגיות",
      projects_show_all_tech: "הצגת כל הטכנולוגיות",
      projects_image_alt: "תמונת הפרויקט {{title}}",

      // Seo.js – כותרת ותיאור לכל עמוד (מטא-דאטה למנועי חיפוש)
      seo_home_title: "Alon Shaul | Full-Stack Developer",
      seo_home_description: "תיק העבודות של אלון שאול, מפתח Full-Stack הבונה אפליקציות ווב מודרניות ב-React וב-Node.js. פרויקטים נבחרים, כישורים וטופס ליצירת קשר.",
      seo_profile_title: "אודות | Alon Shaul – מפתח Full-Stack",
      seo_profile_description: "אלון שאול, מפתח Full-Stack ובוגר תואר במדעי המחשב עם הכשרה מקצועית בפיתוח אתרים. רקע מקצועי וקישורים ל-GitHub ול-LinkedIn.",
      seo_projects_title: "פרויקטים | Alon Shaul – מפתח Full-Stack",
      seo_projects_description: "הפרויקטים של אלון שאול: MoveMentor, מערכת שיקום מותאמת אישית, ו-To Do List, אפליקציה לניהול משימות. כולל הטכנולוגיות וקישורים לקוד ב-GitHub.",
      seo_contact_title: "צור קשר | Alon Shaul – מפתח Full-Stack",
      seo_contact_description: "יצירת קשר עם אלון שאול, מפתח Full-Stack, באמצעות שליחת הודעה בטופס יצירת הקשר שבאתר.",

      // NotFound.js – עמוד "לא נמצא"
      notFound_title: "הדף לא נמצא",
      notFound_text: "הדף שחיפשת אינו קיים, או שהכתובת שלו השתנתה.",
      notFound_home: "חזרה לדף הבית",
      seo_notFound_title: "הדף לא נמצא | Alon Shaul",
      seo_notFound_description: "הדף שחיפשת אינו קיים, או שהכתובת שלו השתנתה.",

      // טקסטים כלליים של הממשק: בורר שפה, מצב תצוגה, תפריט נגישות והבוט
      language_select_label: "בחירת שפה",
      theme_dark_alt: "מצב חושך",
      theme_light_alt: "מצב אור",
      a11y_open: "אפשרויות נגישות",
      a11y_title: "תפריט נגישות",
      a11y_contrast_heading: "התאמת ניגודיות:",
      a11y_invert: "ניגודיות הפוכה",
      a11y_grayscale: "גווני אפור",
      a11y_content_heading: "התאמת תוכן:",
      a11y_text_increase: "הגדלת טקסט",
      a11y_text_decrease: "הקטנת טקסט",
      a11y_highlight_links: "הדגשת קישורים",
      a11y_highlight_headings: "הדגשת כותרות",
      a11y_stop_animations: "עצירת אנימציות",
      a11y_reset: "איפוס",
      bot_q_intro: "שלום, אני הבוט של האתר. האם תרצה ליצור קשר עם אלון שאול?",
      bot_q_name: "איך קוראים לך?",
      bot_q_email: "מה כתובת המייל שלך?",
      bot_q_message: "מה ההודעה שברצונך לשלוח?",
      bot_bye: "תודה, שיהיה לך יום טוב!",
      bot_yes_no: "סליחה, אנא השב ב\"כן\" או \"לא\".",
      bot_invalid_name: "שם לא תקין, אנא הזן שם המכיל אותיות בלבד.",
      bot_invalid_email: "כתובת מייל לא תקינה, אנא נסה שוב.",
      bot_empty_message: "נא להזין הודעה.",
      bot_email_too_long: "כתובת המייל ארוכה מדי, נסה כתובת קצרה יותר.",
      bot_message_too_long: "ההודעה ארוכה מדי, נסה לקצר אותה.",
      bot_send_error_prefix: "תקלה בשליחת ההודעה: ",
      bot_send_error_later: "תקלה בשליחת ההודעה, נסה שוב מאוחר יותר.",
      bot_sent: "ההודעה התקבלה והמייל נשלח!",
      bot_placeholder: "רשום את תשובתך...",
      bot_send: "שלח",
      bot_close: "סגור",

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

      contact_error_name: "יש להזין שם מלא המכיל אותיות ורווחים בלבד",
      contact_error_email: "אימייל שגוי",
      contact_error_fixFields: "תקלה: אנא תקן את השדות עם השגיאה",
      contact_error_generic: "שגיאה: ",
      contact_error_tryLater: "תקלה בשליחת ההודעה, נסה שוב מאוחר יותר.",
      contact_error_invalidInput: "קלט לא תקין",
      contact_error_emailTooLong: "כתובת האימייל ארוכה מדי",
      contact_error_messageTooLong: "ההודעה ארוכה מדי",
      contact_error_messageRequired: "יש לספק הודעה",

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
      home_header_subtitle: "Full-Stack Developer",
      home_header_quote: "\"I combine an innovative approach with advanced technological expertise, and I pay attention to every detail with a commitment to designing an empowering user experience.\nIn every project I lead, I plan efficient and aesthetic solutions that deliver true value and highlight my skills as a professional developer\"",

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
      profile_text: "I am Alon Shaul, a Full-Stack Developer with a degree in Computer Science and professional training in web development, specializing in creating dynamic and modern interfaces. Throughout my studies and professional experience, I have honed my ability to blend deep theoretical knowledge with the practical application of cutting-edge technologies, all while upholding high standards to craft seamless and intuitive user experiences. I am committed to bringing my expertise to every project by developing innovative digital solutions that embody professionalism, quality, and excellence.",
      
      // Projects.js
      projects_title: "My Projects",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "MoveMentor: Personalized Rehabilitation System",
      project_description_moveMentor: "A personalized physical rehabilitation system with custom workout plans, an intuitive chatbot, an advanced email system and statistical tracking.",
      // Translation keys for project To Do List:
      project_title_toDoList: "To Do List Project",
      project_description_toDoList: "A daily task manager for adding and deleting tasks, with data stored in MongoDB so tasks remain available after the app is closed.",

      // ProjectShowcase.js – project showcase UI strings
      projects_carousel_label: "Project showcase",
      projects_prev: "Previous project",
      projects_next: "Next project",
      projects_status: "Project {{current}} of {{total}}",
      projects_go_to: "Go to project {{current}}",
      projects_view_github: "View on GitHub",
      projects_new_tab: "opens in a new tab",
      projects_tech_label: "Technologies",
      projects_show_all_tech: "Show all technologies",
      projects_image_alt: "Preview image of {{title}}",

      // Seo.js – per-page title and description (search engine metadata)
      seo_home_title: "Alon Shaul | Full-Stack Developer",
      seo_home_description: "Portfolio of Alon Shaul, a Full-Stack Developer building modern web applications with React and Node.js. Selected projects, skills and a contact form.",
      seo_profile_title: "About | Alon Shaul – Full-Stack Developer",
      seo_profile_description: "Alon Shaul is a Full-Stack Developer with a degree in Computer Science and professional training in web development. Background and links to GitHub and LinkedIn.",
      seo_projects_title: "Projects | Alon Shaul – Full-Stack Developer",
      seo_projects_description: "Projects by Alon Shaul: MoveMentor, a personalized rehabilitation system, and To Do List, a task management app, with links to the code on GitHub.",
      seo_contact_title: "Contact | Alon Shaul – Full-Stack Developer",
      seo_contact_description: "Get in touch with Alon Shaul, Full-Stack Developer, by sending a message through the contact form on the site.",

      // NotFound.js – "not found" page
      notFound_title: "Page not found",
      notFound_text: "The page you are looking for does not exist, or its address has changed.",
      notFound_home: "Back to home",
      seo_notFound_title: "Page not found | Alon Shaul",
      seo_notFound_description: "The page you are looking for does not exist, or its address has changed.",

      // General UI strings: language selector, theme toggle, accessibility menu and chat bot
      language_select_label: "Select language",
      theme_dark_alt: "Dark mode",
      theme_light_alt: "Light mode",
      a11y_open: "Accessibility options",
      a11y_title: "Accessibility menu",
      a11y_contrast_heading: "Contrast adjustment:",
      a11y_invert: "Inverted contrast",
      a11y_grayscale: "Grayscale",
      a11y_content_heading: "Content adjustment:",
      a11y_text_increase: "Increase text",
      a11y_text_decrease: "Decrease text",
      a11y_highlight_links: "Highlight links",
      a11y_highlight_headings: "Highlight headings",
      a11y_stop_animations: "Stop animations",
      a11y_reset: "Reset",
      bot_q_intro: "Hi, I'm the site's bot. Would you like to contact Alon Shaul?",
      bot_q_name: "What is your name?",
      bot_q_email: "What is your email address?",
      bot_q_message: "What message would you like to send?",
      bot_bye: "Thank you, have a nice day!",
      bot_yes_no: "Sorry, please answer \"yes\" or \"no\".",
      bot_invalid_name: "Invalid name, please use letters only.",
      bot_invalid_email: "Invalid email address, please try again.",
      bot_empty_message: "Please enter a message.",
      bot_email_too_long: "That email address is too long, please try a shorter one.",
      bot_message_too_long: "That message is too long, please shorten it.",
      bot_send_error_prefix: "There was a problem sending the message: ",
      bot_send_error_later: "There was a problem sending the message, please try again later.",
      bot_sent: "Your message was received and the email was sent!",
      bot_placeholder: "Type your answer...",
      bot_send: "Send",
      bot_close: "Close",

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
      contact_error_invalidInput: "Invalid input",
      contact_error_emailTooLong: "Email address is too long",
      contact_error_messageTooLong: "Message is too long",
      contact_error_messageRequired: "Please provide a message",

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
      home_header_subtitle: "Фулстек-разработчик",
      home_header_quote: "\"Я сочетаю инновационный подход с передовыми технологическими знаниями и уделяю внимание каждой детали, исходя из стремления создавать вдохновляющий пользовательский опыт.\nВ каждом проекте, которым я руководствуюсь, я разрабатываю эффективные и эстетичные решения, приносящие реальную ценность и подчеркивающие мои навыки как профессионального разработчика\"",

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
      profile_text: "Я Алон Шауль, Фулстек-разработчик с дипломом по информатике и профессиональной подготовкой в веб-разработке, специализирующийся на создании динамичных и современных интерфейсов. В процессе обучения и профессиональной деятельности я развил способность сочетать глубокие теоретические знания с практическим применением передовых технологий, соблюдая высокие стандарты для создания безупречного и интуитивного пользовательского опыта. Я стремлюсь применять свой опыт и знания в каждом проекте, разрабатывая инновационные цифровые решения, воплощающие профессионализм, качество и совершенство.",
      
      // Projects.js
      projects_title: "Мои проекты",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "Ментор Движения: Персонализированная система реабилитации",
      project_description_moveMentor: "Персонализированная система физической реабилитации с индивидуальными планами тренировок, интуитивным чат-ботом, продвинутой системой электронной почты и статистическим трекингом.",
      // Translation keys for project To Do List:
      project_title_toDoList: "Проект To Do List",
      project_description_toDoList: "Приложение для управления ежедневными задачами: добавление и удаление задач с хранением данных в MongoDB, чтобы задачи сохранялись и после закрытия приложения.",

      // ProjectShowcase.js – project showcase UI strings
      projects_carousel_label: "Витрина проектов",
      projects_prev: "Предыдущий проект",
      projects_next: "Следующий проект",
      projects_status: "Проект {{current}} из {{total}}",
      projects_go_to: "Перейти к проекту {{current}}",
      projects_view_github: "Смотреть на GitHub",
      projects_new_tab: "откроется в новой вкладке",
      projects_tech_label: "Технологии",
      projects_show_all_tech: "Показать все технологии",
      projects_image_alt: "Изображение проекта {{title}}",

      // Seo.js – per-page title and description (search engine metadata)
      seo_home_title: "Alon Shaul | Full-Stack Developer",
      seo_home_description: "Портфолио Алона Шауля, Фулстек-разработчика, создающего современные веб-приложения на React и Node.js. Избранные проекты, навыки и форма для связи.",
      seo_profile_title: "Обо мне | Alon Shaul – Фулстек-разработчик",
      seo_profile_description: "Алон Шауль — Фулстек-разработчик с дипломом по информатике и профессиональной подготовкой в веб-разработке. Опыт и ссылки на GitHub и LinkedIn.",
      seo_projects_title: "Проекты | Alon Shaul – Фулстек-разработчик",
      seo_projects_description: "Проекты Алона Шауля: MoveMentor — персонализированная система реабилитации и To Do List — приложение для управления задачами. Ссылки на код на GitHub.",
      seo_contact_title: "Контакты | Alon Shaul – Фулстек-разработчик",
      seo_contact_description: "Свяжитесь с Алоном Шаулем, Фулстек-разработчиком, отправив сообщение через форму обратной связи на сайте.",

      // NotFound.js – "not found" page
      notFound_title: "Страница не найдена",
      notFound_text: "Страница, которую вы ищете, не существует, или её адрес изменился.",
      notFound_home: "Вернуться на главную",
      seo_notFound_title: "Страница не найдена | Alon Shaul",
      seo_notFound_description: "Страница, которую вы ищете, не существует, или её адрес изменился.",

      // General UI strings: language selector, theme toggle, accessibility menu and chat bot
      language_select_label: "Выбор языка",
      theme_dark_alt: "Тёмный режим",
      theme_light_alt: "Светлый режим",
      a11y_open: "Параметры доступности",
      a11y_title: "Меню доступности",
      a11y_contrast_heading: "Настройка контраста:",
      a11y_invert: "Инверсия контраста",
      a11y_grayscale: "Оттенки серого",
      a11y_content_heading: "Настройка контента:",
      a11y_text_increase: "Увеличить текст",
      a11y_text_decrease: "Уменьшить текст",
      a11y_highlight_links: "Выделить ссылки",
      a11y_highlight_headings: "Выделить заголовки",
      a11y_stop_animations: "Остановить анимацию",
      a11y_reset: "Сброс",
      bot_q_intro: "Здравствуйте, я бот сайта. Хотите связаться с Алоном Шаулем?",
      bot_q_name: "Как вас зовут?",
      bot_q_email: "Какой у вас адрес электронной почты?",
      bot_q_message: "Какое сообщение вы хотите отправить?",
      bot_bye: "Спасибо, хорошего дня!",
      bot_yes_no: "Извините, ответьте «да» или «нет».",
      bot_invalid_name: "Некорректное имя, используйте только буквы.",
      bot_invalid_email: "Некорректный адрес электронной почты, попробуйте ещё раз.",
      bot_empty_message: "Пожалуйста, введите сообщение.",
      bot_email_too_long: "Этот адрес электронной почты слишком длинный, попробуйте короче.",
      bot_message_too_long: "Это сообщение слишком длинное, попробуйте сократить его.",
      bot_send_error_prefix: "Не удалось отправить сообщение: ",
      bot_send_error_later: "Не удалось отправить сообщение, попробуйте позже.",
      bot_sent: "Сообщение получено, письмо отправлено!",
      bot_placeholder: "Введите ваш ответ...",
      bot_send: "Отправить",
      bot_close: "Скрыть",

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
      contact_error_invalidInput: "Некорректные данные",
      contact_error_emailTooLong: "Адрес электронной почты слишком длинный",
      contact_error_messageTooLong: "Сообщение слишком длинное",
      contact_error_messageRequired: "Пожалуйста, введите сообщение",

      // הודעת הצלחה на русском:
      contact_success: "Ваше сообщение успешно отправлено!"
    }
  }
};
