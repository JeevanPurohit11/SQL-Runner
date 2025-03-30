import React from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeToggle;