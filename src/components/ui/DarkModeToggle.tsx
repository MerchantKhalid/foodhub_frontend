'use client';

// ============================================================
// FILE: frontend/src/components/ui/DarkModeToggle.tsx  (NEW FILE)
//
// PURPOSE: The sun/moon toggle button shown in the navbar
//
// HOW IT WORKS:
//   - Reads isDark and toggleDark from ThemeProvider via useDarkMode()
//   - Shows 🌙 moon icon when in light mode (click to go dark)
//   - Shows ☀️ sun icon when in dark mode (click to go light)
//   - Has a smooth sliding animation (the circle slides left/right)
//
// WHAT IS A TOGGLE SWITCH?
//   It's a styled checkbox that looks like an iOS switch.
//   When dark mode is OFF: circle is on the left side, background is gray
//   When dark mode is ON: circle slides to the right, background turns dark
// ============================================================

import { useDarkMode } from '@/components/providers/ThemeProvider';

export default function DarkModeToggle() {
  // Get the current theme state and toggle function from our context
  const { isDark, toggleDark } = useDarkMode();

  return (
    // The whole button is clickable
    <button
      onClick={toggleDark}
      // aria-label is for screen readers (accessibility)
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center gap-1.5 cursor-pointer select-none group"
    >
      {/* Sun icon — shown when dark mode is active (click to go light) */}
      <span
        className={`text-base transition-all duration-300 ${
          isDark
            ? 'opacity-100 scale-100' // Visible in dark mode
            : 'opacity-40 scale-75' // Faded in light mode
        }`}
      >
        ☀️
      </span>

      {/* The toggle track — the pill-shaped background */}
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          isDark
            ? 'bg-primary-600' // Orange when dark mode is on
            : 'bg-gray-300' // Gray when light mode is on
        }`}
      >
        {/* The sliding circle inside the toggle */}
        {/* translate-x-5 moves it to the right (dark mode ON position) */}
        {/* translate-x-0.5 keeps it on the left (light mode position) */}
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
            isDark ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>

      {/* Moon icon — shown when light mode is active (click to go dark) */}
      <span
        className={`text-base transition-all duration-300 ${
          isDark
            ? 'opacity-40 scale-75' // Faded in dark mode
            : 'opacity-100 scale-100' // Visible in light mode
        }`}
      >
        🌙
      </span>
    </button>
  );
}
