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

      // Home.js
      home_header_titleName: "Alon Shaul",
      home_header_subtitle: "מפתח Full-Stack",
      home_header_quote: "\"אני משלב גישה חדשנית עם התמחות טכנולוגית מתקדמת, ומקפיד על כל פרט מתוך מחויבות לעיצוב חוויית משתמש מעצימה.\nבכל פרויקט שאני מוביל, אני מתכנן פתרונות יעילים ואסתטיים שמעניקים ערך אמיתי ומדגישים את כישוריי כמפתח מקצועי\".",

      home_skills_title: "המיומנויות שלי",

      home_skills_react_text: "בניית ממשקים דינמיים ומתקדמים.",
      home_skills_node_text: "יצירת API מהירים ואמינים.",
      home_skills_tailwind_text: "עיצוב מודרני, רספונסיבי וקל לתפעול.",
      home_skills_htmlcssjs_text: "בניית אתרים עם HTML5, CSS3 ו-JavaScript.",
      home_skills_mongo_text: "ניהול מסדי נתונים NoSQL.",
      home_skills_python_text: "פיתוח backend, סקריפטים ואוטומציה.",

      // Profile.js
      profile_title: "אודותי",
      profile_text: "אני אלון שאול, מפתח Full-Stack עם תואר B.Sc. במדעי המחשב. אני אוהב לקחת רעיון ולהפוך אותו למוצר שלם ועובד - מהממשק ועד לשרת ולמסד הנתונים שמאחוריו, תוך בחירת הטכנולוגיות המתאימות לצרכים של כל פרויקט. אני ממשיך ללמוד ולהתפתח, ומשלב כלי AI בתהליך העבודה שלי לניתוח קוד, פתרון בעיות וייעול תהליך הפיתוח.",
      profile_education_title: "השכלה",
      profile_education_degree: "תואר ראשון (B.Sc.) במדעי המחשב",

      // BuildAlon.js – חתימת מפתח ויזואלית-אישית בעמוד Profile
      build_alon_hint: "לחצו לגלות",
      build_alon_cta_label: "הפעלת אנימציית הזהות המקצועית שלי",
      
      // Projects.js
      projects_title: "הפרויקטים שלי",
      // מפתחות תרגום לפרויקט MoveMentor:
      project_title_moveMentor: "MoveMentor: מערכת שיקום מותאמת אישית",
      project_description_moveMentor: "מערכת שיקום פיזי מותאמת אישית, עם ממשק React, שרת Node.js, ומסד נתונים MongoDB. המטופלים מקבלים תוכניות אימון אישיות, צ'אטבוט אינטואיטיבי, התראות אימייל אוטומטיות, ומעקב חזותי אחר ההתקדמות - בנייה מלאה של Full-Stack, ממסד הנתונים ועד לפריסה.",
      project_contribution_moveMentor: "תוכננה ונבנתה באופן עצמאי - משכבת מסד הנתונים וה-API בשרת ועד לממשק ה-React והפריסה בפרודקשן.",
      // מפתחות תרגום לפרויקט To Do List:
      project_title_toDoList: "To Do List: אפליקציה לניהול משימות",
      project_description_toDoList: "אפליקציה לניהול משימות מבוססת-שרת (server-rendered), שנבנתה עם Node.js ו-Express, תבניות EJS לתצוגה, ו-MongoDB (דרך Mongoose) לשמירת המשימות בין הפעלות.",
      project_contribution_toDoList: "פותחה באופן עצמאי, כולל נתיבי ה-Express, סכמת ה-MongoDB, ותצוגות השרת.",

      // ProjectShowcase.js – טקסטים של תצוגת הפרויקטים
      projects_carousel_label: "תצוגת פרויקטים",
      projects_prev: "הפרויקט הקודם",
      projects_next: "הפרויקט הבא",
      projects_status: "פרויקט {{current}} מתוך {{total}}",
      projects_go_to: "מעבר לפרויקט {{current}}",
      projects_view_github: "צפייה ב-GitHub",
      projects_live_demo: "הדגמה חיה",
      projects_new_tab: "נפתח בלשונית חדשה",
      projects_tech_label: "טכנולוגיות",
      projects_show_all_tech: "הצגת כל הטכנולוגיות",
      projects_role_label: "התפקיד שלי",
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
      skip_to_content: "דלג לתוכן הראשי",
      navbar_menu_open: "פתיחת תפריט ניווט",
      navbar_menu_close: "סגירת תפריט ניווט",
      language_select_label: "בחירת שפה",
      theme_toggle_label: "החלפת מצב תצוגה בהיר/כהה",
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
      contact_submit_sending: "שולח...",

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

      // Home.js
      home_header_titleName: "Alon Shaul",
      home_header_subtitle: "Full-Stack Developer",
      home_header_quote: "\"I combine an innovative approach with advanced technological expertise, and I pay attention to every detail with a commitment to designing an empowering user experience.\nIn every project I lead, I plan efficient and aesthetic solutions that deliver true value and highlight my skills as a professional developer\"",

      home_skills_title: "My Skills",

      home_skills_react_text: "Building dynamic and advanced interfaces.",
      home_skills_node_text: "Creating fast and reliable APIs.",
      home_skills_tailwind_text: "Modern, responsive, and easy to maintain design.",
      home_skills_htmlcssjs_text: "Building websites with HTML5, CSS3, and JavaScript.",
      home_skills_mongo_text: "Managing NoSQL databases.",
      home_skills_python_text: "Backend development, scripting, and automation.",

      // Profile.js
      profile_title: "About Me",
      profile_text: "I'm Alon Shaul, a Full-Stack Developer with a B.Sc. in Computer Science. I like taking an idea and turning it into a complete, working product - from the interface down to the server and the database behind it, choosing the technologies that best fit each project's needs. I keep learning and growing, and I use AI tools as part of my workflow for code analysis, problem-solving, and making development more efficient.",
      profile_education_title: "Education",
      profile_education_degree: "B.Sc. in Computer Science",

      // BuildAlon.js – personal visual developer signature on the Profile page
      build_alon_hint: "Click to reveal",
      build_alon_cta_label: "Play my developer identity animation",
      
      // Projects.js
      projects_title: "My Projects",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "MoveMentor: Personalized Rehabilitation System",
      project_description_moveMentor: "A personalized physical rehabilitation platform with a React front end, a Node.js back end, and a MongoDB database. Patients get custom workout plans, an intuitive chatbot, automated email notifications, and visual progress tracking - a complete full-stack build, from database to deployment.",
      project_contribution_moveMentor: "Designed and built independently, from the database schema and backend API to the React interface and production deployment.",
      // Translation keys for project To Do List:
      project_title_toDoList: "To Do List: Task Management App",
      project_description_toDoList: "A server-rendered task management app built with Node.js and Express, using EJS templates for the views and MongoDB (via Mongoose) to persist tasks between sessions.",
      project_contribution_toDoList: "Developed independently, including the Express routes, MongoDB schema, and server-rendered views.",

      // ProjectShowcase.js – project showcase UI strings
      projects_carousel_label: "Project showcase",
      projects_prev: "Previous project",
      projects_next: "Next project",
      projects_status: "Project {{current}} of {{total}}",
      projects_go_to: "Go to project {{current}}",
      projects_view_github: "View on GitHub",
      projects_live_demo: "Live Demo",
      projects_new_tab: "opens in a new tab",
      projects_tech_label: "Technologies",
      projects_show_all_tech: "Show all technologies",
      projects_role_label: "My Role",
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
      skip_to_content: "Skip to main content",
      navbar_menu_open: "Open navigation menu",
      navbar_menu_close: "Close navigation menu",
      language_select_label: "Select language",
      theme_toggle_label: "Toggle light/dark mode",
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
      contact_submit_sending: "Sending...",

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

      // Home.js
      home_header_titleName: "Алон Шауль",
      home_header_subtitle: "Фулстек-разработчик",
      home_header_quote: "\"Я сочетаю инновационный подход с передовыми технологическими знаниями и уделяю внимание каждой детали, исходя из стремления создавать вдохновляющий пользовательский опыт.\nВ каждом проекте, которым я руководствуюсь, я разрабатываю эффективные и эстетичные решения, приносящие реальную ценность и подчеркивающие мои навыки как профессионального разработчика\"",

      home_skills_title: "Мои навыки",

      home_skills_react_text: "Creating dynamic and modern interfaces.",
      home_skills_node_text: "Creating fast and reliable APIs.",
      home_skills_tailwind_text: "Modern, adaptive, and easy-to-maintain design.",
      home_skills_htmlcssjs_text: "Building websites using HTML5, CSS3, and JavaScript.",
      home_skills_mongo_text: "Managing NoSQL databases.",
      home_skills_python_text: "Backend development, scripting, and automation.",

      // Profile.js
      profile_title: "Обо мне",
      profile_text: "Я Алон Шауль, Фулстек-разработчик со степенью бакалавра (B.Sc.) в информатике. Мне нравится брать идею и превращать её в законченный, работающий продукт - от интерфейса до сервера и базы данных за ним, выбирая технологии, которые лучше всего подходят потребностям каждого проекта. Я продолжаю учиться и расти, и использую инструменты ИИ как часть рабочего процесса - для анализа кода, решения задач и повышения эффективности разработки.",
      profile_education_title: "Образование",
      profile_education_degree: "Степень бакалавра (B.Sc.) в информатике",

      // BuildAlon.js – личная визуальная подпись разработчика на странице Profile
      build_alon_hint: "Нажмите, чтобы узнать больше",
      build_alon_cta_label: "Запустить анимацию моей профессиональной идентичности",
      
      // Projects.js
      projects_title: "Мои проекты",
      // Translation keys for project MoveMentor:
      project_title_moveMentor: "MoveMentor: Персонализированная система реабилитации",
      project_description_moveMentor: "Персонализированная платформа физической реабилитации с интерфейсом на React, серверной частью на Node.js и базой данных MongoDB. Пациенты получают индивидуальные планы тренировок, интуитивный чат-бот, автоматические email-уведомления и наглядное отслеживание прогресса - полноценная full-stack разработка, от базы данных до развёртывания.",
      project_contribution_moveMentor: "Спроектирована и разработана самостоятельно - от схемы базы данных и серверного API до интерфейса на React и развёртывания в продакшене.",
      // Translation keys for project To Do List:
      project_title_toDoList: "To Do List: Приложение для управления задачами",
      project_description_toDoList: "Приложение для управления задачами с серверным рендерингом, построенное на Node.js и Express, с шаблонами EJS для представлений и MongoDB (через Mongoose) для хранения задач между сеансами.",
      project_contribution_toDoList: "Разработано самостоятельно, включая маршруты Express, схему MongoDB и серверные представления.",

      // ProjectShowcase.js – project showcase UI strings
      projects_carousel_label: "Витрина проектов",
      projects_prev: "Предыдущий проект",
      projects_next: "Следующий проект",
      projects_status: "Проект {{current}} из {{total}}",
      projects_go_to: "Перейти к проекту {{current}}",
      projects_view_github: "Смотреть на GitHub",
      projects_live_demo: "Живое демо",
      projects_new_tab: "откроется в новой вкладке",
      projects_tech_label: "Технологии",
      projects_show_all_tech: "Показать все технологии",
      projects_role_label: "Моя роль",
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
      skip_to_content: "Перейти к основному содержимому",
      navbar_menu_open: "Открыть меню навигации",
      navbar_menu_close: "Закрыть меню навигации",
      language_select_label: "Выбор языка",
      theme_toggle_label: "Переключить светлый/тёмный режим",
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
      contact_submit_sending: "Отправка...",

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
