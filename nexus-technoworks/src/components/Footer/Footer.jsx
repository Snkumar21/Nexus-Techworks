import { NavLink } from "react-router-dom";
import "./Footer.css";

import lightLogo from "../../assets/logo/nexus-logo-light.png";
import darkLogo from "../../assets/logo/nexus-logo-dark.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* BRAND */}
                <div className="footer-brand">
                    <NavLink to="/" className="footer-logo">
                        <img
                            src={lightLogo}
                            alt="Nexus Technoworks"
                            className="footer-logo-light"
                        />
                        <img
                            src={darkLogo}
                            alt="Nexus Technoworks"
                            className="footer-logo-dark"
                        />
                    </NavLink>
                    <p>
                        Technology, digital and business solutions
                        designed to help ideas grow into impactful
                        digital experiences.
                    </p>
                    <span className="footer-tagline">
                        Build. Create. Grow.
                    </span>
                </div>

                {/* COMPANY */}
                <div className="footer-column">
                    <h3>Company</h3>
                    <NavLink to="/about">
                        About Us
                    </NavLink>
                    <NavLink to="/projects">
                        Our Projects
                    </NavLink>
                    <NavLink to="/clients">
                        Our Clients
                    </NavLink>
                    <NavLink to="/founder">
                        Founder
                    </NavLink>
                    <NavLink to="/contact">
                        Contact
                    </NavLink>
                </div>

                {/* SERVICES */}
                <div className="footer-column">
                    <h3>Services</h3>
                    <NavLink to="/services">
                        Software Development
                    </NavLink>
                    <NavLink to="/services">
                        Web Development
                    </NavLink>
                    <NavLink to="/services">
                        Content Creation
                    </NavLink>
                    <NavLink to="/services">
                        Digital Marketing
                    </NavLink>
                    <NavLink to="/services">
                        Business Solutions
                    </NavLink>
                </div>

                {/* CONTACT */}
                <div className="footer-column footer-contact">
                    <h3>Let's Connect</h3>
                    <a href="mailto:technexus.6926@gmail.com">
                        technexus.6926@gmail.com
                    </a>
                    <a href="tel:+919373937166">
                        +91 93739 37166
                    </a>
                    <p>
                        Pune, Maharashtra, India
                    </p>
                    <div className="footer-socials">
                        <a
                            href="https://www.instagram.com/nexustechworks/"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fa-brands fa-instagram"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fa-brands fa-linkedin"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="YouTube"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fa-brands fa-youtube"></i>
                        </a>
                        <a
                            href="#"
                            aria-label="GitHub"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div className="footer-bottom">
                <div className="container footer-bottom-container">
                    <p>
                        © {currentYear} Nexus Technoworks.
                        All rights reserved.
                    </p>
                    <div className="footer-legal">
                        <NavLink to="/privacy-policy">
                            Privacy Policy
                        </NavLink>
                        <NavLink to="/terms">
                            Terms & Conditions
                        </NavLink>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;