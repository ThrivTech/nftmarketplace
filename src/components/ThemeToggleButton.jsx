import React from 'react';
import { Sun, Moon } from 'lucide-react';

const GlobalThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // Apply theme to document immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);  
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[60] p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 hover:scale-105"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default GlobalThemeToggle;