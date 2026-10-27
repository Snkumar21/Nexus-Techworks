
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import Logo from "../../assets/logo/nexus-logo-bg-removed.png";

const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const [settings, setSettings] = useState(null);
    const [logoSrc, setLogoSrc] = useState(Logo);

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
                console.error("Unable to load footer settings:", error);
            }
        };

        fetchPublicSettings();

        return () => {
            active = false;
        };
    }, []);

    const company = settings?.company || {};
    const social = settings?.social || {};
    const preferences = settings?.preferences || {};

    const companyName = company.name || "Nexus Techworks";
    const companyEmail = company.email || "technexus30@gmail.com";
    const companyPhone = company.phone || "+91 93739 37166";
    const companyAddress = company.address || "Pune, Maharashtra, India";
    const companyWebsite = company.website || "";
    const companyTagline = company.tagline || "Build. Create. Grow.";

    const socialLinks = [
        {
            key: "instagram",
            label: "Instagram",
            icon: "fa-brands fa-instagram",
        },
        {
            key: "linkedin",
            label: "LinkedIn",
            icon: "fa-brands fa-linkedin",
        },
        {
            key: "youtube",
            label: "YouTube",
            icon: "fa-brands fa-youtube",
        },
        {
            key: "facebook",
            label: "Facebook",
            icon: "fa-brands fa-facebook",
        },
        {
            key: "github",
            label: "GitHub",
            icon: "fa-brands fa-github",
        },
    ];

    const visibleSocialLinks = socialLinks.filter(({ key }) => {
        const url = social[key];

        return (
            typeof url === "string" &&
            /^https?:\/\//i.test(url.trim())
        );
    });

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* BRAND */}
                <div className="footer-brand">
                    <NavLink
                        to="/"
                        className="footer-logo"
                        aria-label={`${companyName} home`}
                    >
                        <img
                            src={logoSrc}
                            alt={companyName}
                            className="footer-logo-img"
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = Logo;
                            }}
                        />
                    </NavLink>

                    <p>
                        Technology, digital and business solutions
                        designed to help ideas grow into impactful
                        digital experiences.
                    </p>

                    <span className="footer-tagline">
                        {companyTagline}
                    </span>
                </div>

                {/* COMPANY */}
                <div className="footer-column">
                    <h3>Company</h3>

                    <NavLink to="/about">About Us</NavLink>
                    <NavLink to="/projects">Our Projects</NavLink>
                    <NavLink to="/clients">Our Clients</NavLink>
                    <NavLink to="/founder">Founder</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </div>

                {/* SERVICES */}
                <div className="footer-column">
                    <h3>Services</h3>

                    <NavLink to="/services">Software Development</NavLink>
                    <NavLink to="/services">Web Development</NavLink>
                    <NavLink to="/services">Content Creation</NavLink>
                    <NavLink to="/services">Digital Marketing</NavLink>
                    <NavLink to="/services">Business Solutions</NavLink>
                </div>

                {/* CONTACT */}
                <div className="footer-column footer-contact">
                    <h3>Let's Connect</h3>

                    <a href={`mailto:${companyEmail}`}>
                        {companyEmail}
                    </a>

                    <a href={`tel:${companyPhone.replace(/[^\d+]/g, "")}`}>
                        {companyPhone}
                    </a>

                    <p>{companyAddress}</p>

                    {companyWebsite && (
                        <a
                            href={companyWebsite}
                            target="_self"
                            rel="noopener noreferrer"
                        >
                            Visit Website
                        </a>
                    )}

                    {/* SOCIAL LINKS FROM ADMIN SETTINGS */}
                    {preferences.showSocialLinks !== false &&
                        visibleSocialLinks.length > 0 && (
                            <div className="footer-socials">
                                {visibleSocialLinks.map(
                                    ({ key, label, icon }) => (
                                        <a
                                            key={key}
                                            href={social[key]}
                                            aria-label={label}
                                            title={label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className={icon} />
                                        </a>
                                    )
                                )}
                            </div>
                        )}
                </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div className="footer-bottom">
                <div className="container footer-bottom-container">
                    <p>
                        © {currentYear} {companyName}.
                        All rights reserved.
                    </p>

                    <div className="footer-legal">
                        <NavLink to="/privacy-policy">
                            Privacy Policy
                        </NavLink>

                        <NavLink to="/terms">
                            Terms &amp; Conditions
                        </NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;