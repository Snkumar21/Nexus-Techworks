import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("nexus-theme") || "system";
    });
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove(
            "light-theme",
            "dark-theme"
        );
        if (theme === "light") {
            root.classList.add("light-theme");
        }
        if (theme === "dark") {
            root.classList.add("dark-theme");
        }
        localStorage.setItem("nexus-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};