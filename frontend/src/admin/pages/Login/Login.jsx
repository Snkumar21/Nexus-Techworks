import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi, setAdminCsrfToken, } from "../../utils/adminApi";
import Logo from "../../../assets/logo/nexus-logo-bg-removed.png";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, }));
        if (error) { setError(""); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const data = await adminApi("/admin/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe,
                }),
            });

            setAdminCsrfToken(data.csrfToken);

            localStorage.removeItem("nexusAdminAuth");
            localStorage.removeItem("nexusAdminUser");
            sessionStorage.removeItem("nexusAdminAuth");
            sessionStorage.removeItem("nexusAdminUser");

            navigate("/admin/dashboard", {
                replace: true,
            });
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-page">
            {/* BRAND PANEL */}
            <section className="admin-login-brand">
                <div className="brand-grid" />
                <div className="brand-glow" />
                
                <div className="brand-x">X</div>

                <div className="admin-brand-content">
                    <div className="admin-brand-top">
                        <img src={Logo} alt="Nexus Techworks" className="admin-login-logo"/>
                        <span className="admin-portal-badge"> ADMIN PORTAL </span>
                    </div>
                    <div className="admin-brand-main">
                        <span className="admin-brand-label"> NEXUS CONTROL CENTER </span>
                        <h1> Manage. <br /> Control. <br /> <span>Grow.</span> </h1>
                        <p>
                            A centralized workspace for managing
                            Nexus Techworks services, projects,
                            marketplace listings, enquiries and
                            business operations.
                        </p>
                        <div className="admin-brand-features">
                            <div> <span>01</span> <p>Content Management</p> </div>
                            <div> <span>02</span> <p>Business Operations</p> </div>
                            <div> <span>03</span> <p>Platform Control</p> </div>
                        </div>
                    </div>
                    <div className="admin-brand-footer">
                        <span>KEEP EVOLVING.</span>
                        <span>NEXUS TECHWORKS</span>
                    </div>
                </div>
            </section>

            {/* LOGIN PANEL */}
            <section className="admin-login-form-section">
                <div className="mobile-admin-brand">
                    <img src={Logo} alt="Nexus Techworks"/>
                    <span>ADMIN</span>
                </div>
                <div className="admin-login-wrapper">
                    <div className="login-status">
                        <span className="status-dot" />
                        Secure Administrator Access
                    </div>
                    <div className="login-heading">
                        <span>WELCOME BACK</span>
                        <h2> Sign in to your workspace. </h2>
                        <p>
                            Enter your administrator credentials
                            to access the Nexus Control Center.
                        </p>
                    </div>

                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        {/* EMAIL */}
                        <div className="admin-form-group">
                            <label htmlFor="admin-email"> Email Address </label>
                            <div className="admin-input-wrapper">
                                <i className="fa-regular fa-envelope" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@nexustechworks.live"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="admin-form-group">
                            <div className="password-label-row">
                                <label htmlFor="admin-password"> Password </label>
                                <span> Administrator only </span>
                            </div>

                            <div className="admin-input-wrapper">
                                <i className="fa-solid fa-lock" />
                                <input id="admin-password" type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)} aria-label={ showPassword ? "Hide password" : "Show password" }>
                                    <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}/>
                                </button>
                            </div>
                        </div>

                        {/* OPTIONS */}
                        <div className="admin-login-options">
                            <label className="remember-option">
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe( e.target.checked )} />
                                <span className="custom-checkbox"> <i className="fa-solid fa-check" /> </span>
                                <span> Remember me </span>
                            </label>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="admin-login-error">
                                <i className="fa-solid fa-circle-exclamation" />
                                <span> {error} </span>
                            </div>
                        )}

                        {/* LOGIN */}
                        <button type="submit" className="admin-login-button" disabled={loading} >
                            <span> {loading ? "Authenticating..." : "Access Dashboard"} </span>
                            {loading ? ( <span className="login-spinner" /> ) : ( <i className="fa-solid fa-arrow-right" /> )}
                        </button>
                    </form>

                    <div className="admin-security-note">
                        <i className="fa-solid fa-shield-halved" />
                        <p>
                            This portal is restricted to authorized
                            Nexus Techworks administrators.
                        </p>
                    </div>
                </div>

                <div className="admin-login-copyright">
                    © {new Date().getFullYear()} Nexus Techworks.
                    Authorized Access Only.
                </div>
            </section>
        </main>
    );
};

export default Login;