import moveMentorImg700 from '../project/movementor-700.webp';
import moveMentorImg1400 from '../project/movementor-1400.webp';
import toDoListImg from '../project/Project 2 - To Do List.png';

// רשימת הפרויקטים המוצגים ב-ProjectShowcase. להוספת פרויקט – מוסיפים אובייקט נוסף למערך.
// titleKey / descriptionKey הם מפתחות תרגום ב-i18n.js.
// imagePosition (אופציונלי) קובע איזה חלק מהתמונה נשאר גלוי כשהמסגרת חותכת אותה (object-position).
const projects = [
  {
    id: 'moveMentor',
    titleKey: 'project_title_moveMentor',
    descriptionKey: 'project_description_moveMentor',
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
    link: 'https://github.com/AlonShaul/To-Do-List-Project.git',
    image: toDoListImg,
    tech: ['Node.js', 'Express', 'EJS', 'MongoDB', 'Mongoose', 'CSS'],
  },
];

export default projects;
