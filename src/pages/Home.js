import React from 'react';

const Home = () => {
  return (
    <div className="font-sans" dir="rtl">
      {/* ============================= */}
      {/* Header Section */}
      {/* ============================= */}
      <section className="bg-blue-700 text-white py-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
          {/* טקסט אישי – יוצג בצד שמאל */}
          <div className="md:w-2/3 text-center md:text-right order-2 md:order-1">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Alon Shaul</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">מפתח Frontend</h2>
            <blockquote className="text-xl italic text-blue-100 border-2-4 border-blue-300 pl-4">
              "אני מביא יצירתיות, חדשנות ומקצועיות לכל פרויקט, תוך דגש על חוויית משתמש מתקדמת."
            </blockquote>
          </div>
          {/* תמונת פרופיל – יוצג בצד ימין */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0 order-1 md:order-2">
            {/* הנח שהתמונה "AlonShaul.jpg" נמצאת בתיקיית public */}
            <img 
              src="/AlonShaul.png" 
              alt="Alon Shaul" 
              className="rounded-full border-4 border-white shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Skills Section */}
      {/* ============================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-4">המיומנויות שלי</h2>
          <p className="text-center text-gray-600 mb-8">
            כל כישור מתואר בקצרה, עם דגש על היכולות וההתמחות שלי.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Skill Card: React */}
            <div className="bg-white p-6 rounded-lg shadow border border-blue-200 hover:shadow-lg transition duration-300">
              <div className="flex flex-col items-center">
                {/* אם האייקונים עדיין לא מופיעים, בדקו את קישור ה-CDN */}
                <i className="fab fa-react text-5xl text-blue-500 mb-2"></i>
                <hr className="w-full border-t-2 border-blue-100 my-2" />
                <h3 className="text-2xl font-semibold mb-1">React</h3>
                <p className="text-gray-700 text-center text-sm">
                  בניית ממשקים דינמיים ומתקדמים.
                </p>
              </div>
            </div>
            {/* Skill Card: Node.js */}
            <div className="bg-white p-6 rounded-lg shadow border border-blue-200 hover:shadow-lg transition duration-300">
              <div className="flex flex-col items-center">
                <i className="fab fa-node text-5xl text-green-500 mb-2"></i>
                <hr className="w-full border-t-2 border-blue-100 my-2" />
                <h3 className="text-2xl font-semibold mb-1">Node.js</h3>
                <p className="text-gray-700 text-center text-sm">
                  יצירת API מהירים ואמינים.
                </p>
              </div>
            </div>
            {/* Skill Card: Tailwind CSS */}
            <div className="bg-white p-6 rounded-lg shadow border border-blue-200 hover:shadow-lg transition duration-300">
              <div className="flex flex-col items-center">
                <i className="fas fa-wind text-5xl text-teal-500 mb-2"></i>
                <hr className="w-full border-t-2 border-blue-100 my-2" />
                <h3 className="text-2xl font-semibold mb-1">Tailwind CSS</h3>
                <p className="text-gray-700 text-center text-sm">
                  עיצוב מודרני, רספונסיבי וקל לתפעול.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Articles Section */}
      {/* ============================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">כתבות ומאמרים</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article Card 1 */}
            <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img 
                src="https://source.unsplash.com/600x400/?web,development" 
                alt="כתבה 1" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">פיתוח אתרים מודרני</h3>
                <p className="text-gray-700 mb-4">
                  כתבה על שימוש בטכנולוגיות מתקדמות ליצירת אתרים איכותיים.
                </p>
                <a 
                  href="https://www.example.com/article1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  קראו עוד
                </a>
              </div>
            </div>
            {/* Article Card 2 */}
            <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img 
                src="https://source.unsplash.com/600x400/?javascript,coding" 
                alt="כתבה 2" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">עולם ה-JavaScript</h3>
                <p className="text-gray-700 mb-4">
                  מגמות ופיתוחים עכשוויים בתחום JavaScript.
                </p>
                <a 
                  href="https://www.example.com/article2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  קראו עוד
                </a>
              </div>
            </div>
            {/* Article Card 3 */}
            <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <img 
                src="https://source.unsplash.com/600x400/?frontend,design" 
                alt="כתבה 3" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">עיצוב חוויית משתמש</h3>
                <p className="text-gray-700 mb-4">
                  מאמר על חדשנות ויצירתיות בעיצוב חוויית המשתמש.
                </p>
                <a 
                  href="https://www.example.com/article3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  קראו עוד
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
