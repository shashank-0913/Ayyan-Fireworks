import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 min-h-[40px] min-w-[40px] focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
        isDark
          ? 'bg-obsidian-900/90 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-amber-600 hover:text-amber-700 border border-slate-200 shadow-sm'
      } ${className}`}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Mode (Day Celebration)' : 'Switch to Dark Mode (Festive Midnight)'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 transform absolute ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100 text-amber-600'
          }`}
        />
        <Moon
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 transform absolute ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-amber-400'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>

      {showLabel && (
        <span className="ml-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
