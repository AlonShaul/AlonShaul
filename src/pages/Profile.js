import React from 'react';

const Profile = () => {
  return (
    <section className="py-16 bg-gray-100" dir="rtl">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">אודותי</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src="/AlonShaul.jpg" 
              alt="Alon Shaul" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3">
            <p className="text-gray-700 text-lg">
              אני Alon Shaul, מפתח Frontend המתמחה ביצירת אתרים מודרניים, חוויית משתמש מתקדמת ועיצוב נקי. אני מאמין בשילוב של חדשנות וטכנולוגיה, ומביא את היצירתיות לכל פרויקט.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
