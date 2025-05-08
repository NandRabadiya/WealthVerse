// ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext"; // Correct import path

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // Access 'theme' from context

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full cursor-pointer dark:hover:bg-gray-600 transition-colors bg-gray-700 hover:bg-gray-600"
      title="Toggle Theme"
    >
      {theme === "dark" ? ( // Check if the theme is 'dark'
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  );
};
