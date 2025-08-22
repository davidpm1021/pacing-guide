import React, { useState, useEffect } from 'react'
import LessonByLessonPacingGuide from '../pacing guide'
import TrimesterPacingGuide from '../trimester-pacing-guide'

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'semester' | 'trimester'>('semester');

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
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1 w-fit mx-auto">
            <button
              onClick={() => setActiveTab('semester')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'semester'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Semester Course
            </button>
            <button
              onClick={() => setActiveTab('trimester')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'trimester'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Trimester Course
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'semester' ? (
          <LessonByLessonPacingGuide darkMode={darkMode} setDarkMode={setDarkMode} />
        ) : (
          <TrimesterPacingGuide darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
      </div>
    </div>
  )
}

export default App 