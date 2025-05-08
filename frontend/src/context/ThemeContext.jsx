// src/theme/ThemeContext.js
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to dark mode if no theme is found in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark"; // default is dark
  });

  useEffect(() => {
    // Set the theme as an attribute on the document root
    // document.documentElement.setAttribute("data-theme", theme);
    // Add or remove the "dark" class on the html element based on the current theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme); // Persist the theme in localStorage
  }, [theme]);

  // Function to toggle the theme between dark and light
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access the theme context
export const useTheme = () => useContext(ThemeContext);
