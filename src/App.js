import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AccessibilityWidget from './components/AccessibilityWidget';
import ContactBot from './components/ContactBot'; // הוספת ייבוא של הבוט

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollIndicator />
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          {/* כל כתובת אחרת – עמוד "לא נמצא". כל עמוד חדש צריך גם שורה ב-public/_redirects */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AccessibilityWidget />
      <ContactBot /> {/* הוספת הבוט לתחתית העמוד */}
    </div>
  );
}

export default App;
