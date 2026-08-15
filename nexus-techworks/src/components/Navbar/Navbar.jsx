import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <NavLink to="/" className="navbar-logo">
                    <img
                        src="/src/assets/logo/nexus-logo-light.png"
                        alt="Nexus Technoworks"
                        className="logo logo-light"
                    />

                    <img
                        src="/src/assets/logo/nexus-logo-dark.png"
                        alt="Nexus Technoworks"
                        className="logo logo-dark"
                    />
                </NavLink>

                {/* Navigation */}
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
                        Clients
                    </NavLink>

                    <NavLink to="/founder" className="nav-link">
                        Founder
                    </NavLink>
                </nav>

                {/* Contact */}
                <NavLink to="/contact" className="navbar-contact">
                    Let's Talk
                </NavLink>

            </div>
        </header>
    );
};

export default Navbar;