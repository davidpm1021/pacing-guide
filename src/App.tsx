import React, { useState, useEffect } from 'react'
import LessonByLessonPacingGuide from '../pacing guide'

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to body element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <LessonByLessonPacingGuide darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  )
}

export default App 