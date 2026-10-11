import moveMentorImg700 from '../project/movementor-700.webp';
import moveMentorImg1400 from '../project/movementor-1400.webp';
import toDoListImg583 from '../project/todo-list-583.png';
import toDoListImg from '../project/Project 2 - To Do List.png';

// רשימת הפרויקטים המוצגים ב-ProjectShowcase. להוספת פרויקט – מוסיפים אובייקט נוסף למערך.
// titleKey / descriptionKey / contributionKey הם מפתחות תרגום ב-i18nResources.js.
// imagePosition (אופציונלי) קובע איזה חלק מהתמונה נשאר גלוי כשהמסגרת חותכת אותה (object-position).
// demoUrl (אופציונלי) - כשהפרויקט מקבל דיפלוי חי, מוסיפים כאן את הכתובת וכפתור "הדגמה חיה"
// יופיע אוטומטית ב-ProjectShowcase; כל עוד השדה לא קיים, שום כפתור לא מוצג.
const projects = [
  {
    id: 'moveMentor',
    titleKey: 'project_title_moveMentor',
    descriptionKey: 'project_description_moveMentor',
    contributionKey: 'project_contribution_moveMentor',
    link: 'https://github.com/AlonShaul/MoveMentor.git',
    image: moveMentorImg1400,
    imageSrcSet: `${moveMentorImg700} 700w, ${moveMentorImg1400} 1400w`,
    imagePosition: '55% 10%',
    tech: ['React', 'Node.js', 'MongoDB', 'TailwindCSS', 'HTML', 'CSS', 'JavaScript', 'Chart.js', 'SendGrid', 'Render'],
  },
  {
    id: 'toDoList',
    titleKey: 'project_title_toDoList',
    descriptionKey: 'project_description_toDoList',
    contributionKey: 'project_contribution_toDoList',
    link: 'https://github.com/AlonShaul/To-Do-List-Project.git',
    image: toDoListImg,
    imageSrcSet: `${toDoListImg583} 583w, ${toDoListImg} 1166w`,
    tech: ['Node.js', 'Express', 'EJS', 'MongoDB', 'Mongoose', 'CSS'],
  },
];

export default projects;
