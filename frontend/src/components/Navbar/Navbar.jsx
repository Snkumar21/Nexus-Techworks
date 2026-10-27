
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import Logo from "../../assets/logo/nexus-logo-bg-removed.png";
import "./Navbar.css";

const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const navItems = [
    ["/", "Home"],
    ["/about", "About"],
    ["/services", "Services"],
    ["/projects", "Projects"],
    ["/career", "Career"],
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const [logoSrc, setLogoSrc] = useState(Logo);
    const location = useLocation();

    useEffect(() => {
        let active = true;

        const fetchPublicSettings = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/settings/public`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`Settings fetch failed: ${response.status}`);
                }

                const data = await response.json();

                if (!active) return;

                setSettings(data);

                if (data.logoUrl) {
                    const url = data.logoUrl.startsWith("http")
                        ? data.logoUrl
                        : `${API_BASE}${data.logoUrl}`;

                    const separator = url.includes("?") ? "&" : "?";
                    const version = data.logoUpdatedAt
                        ? new Date(data.logoUpdatedAt).getTime()
                        : Date.now();

                    setLogoSrc(`${url}${separator}v=${version}`);
                }
            } catch (error) {
                console.error("Unable to load website settings:", error);
            }
        };

        fetchPublicSettings();

        return () => {
            active = false;
        };
    }, []);

    // Close mobile menu whenever route changes.
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scrolling while mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const companyName = settings?.company?.name || "Nexus Techworks";

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* DYNAMIC LOGO */}
                <NavLink
                    to="/"
                    className="navbar-logo"
                    aria-label={`${companyName} home`}
                >
                    <img
                        src={logoSrc}
                        alt={companyName}
                        className="logo"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = Logo;
                        }}
                    />
                </NavLink>

                {/* NAVIGATION */}
                <nav
                    className={`navbar-menu ${mobileOpen ? "is-open" : ""}`}
                    aria-label="Main navigation"
                >
                    <div className="mobile-menu-head">
                        <span>Menu</span>

                        <button
                            type="button"
                            className="mobile-close"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    </div>

                    {navItems.map(([to, label]) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className="nav-link"
                        >
                            {label}
                        </NavLink>
                    ))}

                    <NavLink to="/contact" className="mobile-contact">
                        Let's Talk
                    </NavLink>
                </nav>

                {/* MOBILE BACKDROP */}
                {mobileOpen && (
                    <button
                        type="button"
                        className="nav-backdrop"
                        aria-label="Close navigation"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* ACTIONS */}
                <div className="navbar-actions">
                    <NavLink to="/contact" className="navbar-contact">
                        Let's Talk
                    </NavLink>

                    <button
                        type="button"
                        className="mobile-toggle"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                    >
                        <i className="fa-solid fa-bars" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;