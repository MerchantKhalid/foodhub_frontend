'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean; // Is dark mode currently active?
  toggleDark: () => void; // Function to switch between modes
}


const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleDark: () => {},
});

// The Provider component — wraps the whole app in layout.tsx
// All children inside this component can access the theme context
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // isDark = true means dark mode is ON
  const [isDark, setIsDark] = useState(false);

  // On first load, check what the user previously chose
  // This useEffect runs once when the component mounts ([] dependency = runs once)
  useEffect(() => {
    // localStorage.getItem returns the saved value or null if nothing saved
    const savedTheme = localStorage.getItem('foodhub-theme');

    if (savedTheme === 'dark') {
      // User previously chose dark mode → restore it
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      // User previously chose light mode → keep light
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // No saved preference → check the OS/system preference
      // window.matchMedia('prefers-color-scheme: dark') = true if OS is in dark mode
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []); // Empty array = run once on mount

  //  The toggle function — switches between dark and light
  const toggleDark = () => {
    setIsDark((prev) => {
      const newValue = !prev; // Flip the boolean: true→false or false→true

      if (newValue) {
        // Switching TO dark mode:
        document.documentElement.classList.add('dark'); // Add "dark" to <html>
        localStorage.setItem('foodhub-theme', 'dark'); // Save preference
      } else {
        // Switching TO light mode:
        document.documentElement.classList.remove('dark'); // Remove "dark" from <html>
        localStorage.setItem('foodhub-theme', 'light'); // Save preference
      }

      return newValue;
    });
  };


  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Instead of writing useContext(ThemeContext) everywhere,
// components just write useDarkMode()
export function useDarkMode() {
  return useContext(ThemeContext);
}
