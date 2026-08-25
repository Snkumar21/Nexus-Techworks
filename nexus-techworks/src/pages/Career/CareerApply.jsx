import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CareerApply.css";

const CareerApply = () => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        portfolio: "",
        github: "",
        linkedin: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Application submitted:", formData);
        alert(
            "Thank you for applying to Nexus Techworks. We will get back to you soon."
        );
    };

    return (
        <main className="career-apply-page">
            <section className="career-apply-hero">
                <div className="container">
                    <NavLink
                        to="/career"
                        className="back-career-link"
                    >
                        ← Back to Careers
                    </NavLink>

                    <span className="section-label">
                        JOIN NEXUS TECHWORKS
                    </span>

                    <h1>
                        Let's build
                        <span> something.</span>
                    </h1>

                    <p>
                        Tell us about yourself, your skills and what you
                        would like to build with us.
                    </p>
                </div>
            </section>

            <section className="application-section">
                <div className="container application-layout">
                    <div className="application-info">
                        <span className="section-label">
                            APPLICATION
                        </span>

                        <h2>
                            Start your
                            <span> journey.</span>
                        </h2>

                        <p>
                            We are always interested in meeting people who
                            are passionate about technology, creativity,
                            business and learning.
                        </p>

                        <div className="application-note">
                            <strong>
                                Before you apply
                            </strong>

                            <ul>
                                <li>
                                    Be honest about your skills and experience.
                                </li>

                                <li>
                                    Share your portfolio or GitHub if available.
                                </li>

                                <li>
                                    Tell us what you want to learn.
                                </li>

                                <li>
                                    Show us what you can bring to the team.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* FORM */}
                    <form
                        className="application-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label htmlFor="name">
                                Full Name *
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email *
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    Phone
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="position">
                                Position *
                            </label>

                            <select
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select a position
                                </option>

                                <option value="Software Developer">
                                    Software Developer
                                </option>

                                <option value="Web Developer">
                                    Web Developer
                                </option>

                                <option value="Digital Content Creator">
                                    Digital Content Creator
                                </option>

                                <option value="Digital Marketing Associate">
                                    Digital Marketing Associate
                                </option>

                                <option value="General Application">
                                    General Application
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="experience">
                                Experience Level
                            </label>

                            <select
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select your experience
                                </option>

                                <option value="Student">
                                    Student
                                </option>

                                <option value="Fresher">
                                    Fresher
                                </option>

                                <option value="0-2">
                                    0–2 Years
                                </option>

                                <option value="2-5">
                                    2–5 Years
                                </option>

                                <option value="5+">
                                    5+ Years
                                </option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="portfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="github">
                                    GitHub
                                </label>

                                <input
                                    id="github"
                                    name="github"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    value={formData.github}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="linkedin">
                                LinkedIn
                            </label>

                            <input
                                id="linkedin"
                                name="linkedin"
                                type="url"
                                placeholder="https://linkedin.com/in/username"
                                value={formData.linkedin}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="application-submit"
                        >
                            Submit Application
                            <span>↗</span>
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};
export default CareerApply;