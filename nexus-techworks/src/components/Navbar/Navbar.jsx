import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import lightLogo from "../../assets/logo/nexus-logo-light.png";
import darkLogo from "../../assets/logo/nexus-logo-dark.png";

import "./Navbar.css";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setThemeMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* LOGO */}
                <NavLink
                    to="/"
                    className="navbar-logo"
                >
                    <img
                        src={lightLogo}
                        alt="Nexus Technoworks"
                        className="logo logo-light"
                    />

                    <img
                        src={darkLogo}
                        alt="Nexus Technoworks"
                        className="logo logo-dark"
                    />
                </NavLink>

                {/* NAVIGATION */}
                <nav className="navbar-menu">
                    <NavLink to="/" className="nav-link">
                        Home
                    </NavLink>

                    <NavLink to="/about" className="nav-link">
                        About
                    </NavLink>

                    <NavLink to="/services" className="nav-link">
                        Services
                    </NavLink>

                    <NavLink to="/projects" className="nav-link">
                        Projects
                    </NavLink>

                    <NavLink to="/clients" className="nav-link">
                        Career
                    </NavLink>

                    <NavLink to="/founder" className="nav-link">
                        Founder
                    </NavLink>
                </nav>

                {/* ACTIONS */}
                <div className="navbar-actions">
                    {/* Let's Talk */}
                    <NavLink
                        to="/contact"
                        className="navbar-contact"
                    >
                        Let's Talk
                    </NavLink>

                    {/* THEME MENU */}
                    <div className="theme-menu">
                        {/* Theme Button */}
                        <button
                            type="button"
                            className="theme-menu-trigger"
                            onClick={() =>
                                setThemeMenuOpen(!themeMenuOpen)
                            }
                            aria-label="Theme settings"
                            aria-expanded={themeMenuOpen}
                        >
                            <i className="fa-solid fa-sliders"></i>
                        </button>

                        {/* Dropdown */}
                        {themeMenuOpen && (
                            <div className="theme-dropdown">
                                <div className="theme-dropdown-title">
                                    Appearance
                                </div>

                                {/* Light */}
                                <button
                                    type="button"
                                    className={
                                        theme === "light"
                                            ? "theme-option active"
                                            : "theme-option"
                                    }
                                    onClick={() =>
                                        handleThemeChange("light")
                                    }
                                >
                                    <span className="theme-option-icon">
                                        <i className="fa-solid fa-sun"></i>
                                    </span>
                                    <span className="theme-option-text">
                                        Light
                                    </span>
                                    {theme === "light" && (
                                        <i className="fa-solid fa-check theme-check"></i>
                                    )}
                                </button>

                                {/* Dark */}
                                <button
                                    type="button"
                                    className={
                                        theme === "dark"
                                            ? "theme-option active"
                                            : "theme-option"
                                    }
                                    onClick={() =>
                                        handleThemeChange("dark")
                                    }
                                >
                                    <span className="theme-option-icon">
                                        <i className="fa-solid fa-moon"></i>
                                    </span>
                                    <span className="theme-option-text">
                                        Dark
                                    </span>
                                    {theme === "dark" && (
                                        <i className="fa-solid fa-check theme-check"></i>
                                    )}
                                </button>

                                {/* System */}
                                <button
                                    type="button"
                                    className={
                                        theme === "system"
                                            ? "theme-option active"
                                            : "theme-option"
                                    }
                                    onClick={() =>
                                        handleThemeChange("system")
                                    }
                                >
                                    <span className="theme-option-icon">
                                        <i className="fa-solid fa-desktop"></i>
                                    </span>
                                    <span className="theme-option-text">
                                        System
                                    </span>
                                    {theme === "system" && (
                                        <i className="fa-solid fa-check theme-check"></i>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;