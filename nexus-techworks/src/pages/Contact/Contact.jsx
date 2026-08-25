import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        message: "",
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
        console.log("Contact enquiry:", formData);
        alert(
            "Thank you for contacting Nexus Techworks. We will get back to you soon."
        );
    };

    return (
        <main className="contact-page">
            <section className="contact-hero">
                <div className="container contact-hero-container">
                    <span className="section-label">
                        GET IN TOUCH
                    </span>

                    <h1>
                        Let's build
                        <span> something.</span>
                    </h1>

                    <p>
                        Have an idea, a business challenge or a project in
                        mind? Let's turn your vision into a digital solution.
                    </p>
                </div>
            </section>

            <section className="contact-section">
                <div className="container contact-layout">
                    <div className="contact-info">
                        <span className="section-label">
                            CONTACT NEXUS
                        </span>

                        <h2>
                            Tell us what you're
                            <span> building.</span>
                        </h2>

                        <p className="contact-description">
                            Whether you need a website, software solution,
                            digital marketing strategy, creative content or
                            a complete digital solution, we're here to help.
                        </p>

                        {/* Email */}
                        <div className="contact-detail">
                            <span className="contact-detail-label">
                                EMAIL
                            </span>

                            <a href="mailto:technexus.6926@gmail.com">
                                technexus.6926@gmail.com
                            </a>
                        </div>

                        {/* Website */}
                        <div className="contact-detail">
                            <span className="contact-detail-label">
                                WEBSITE
                            </span>

                            <a
                                href="https://nexus-techworks.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                nexus-techworks.vercel.app ↗
                            </a>
                        </div>

                        {/* Social */}
                        <div className="contact-detail">
                            <span className="contact-detail-label">
                                SOCIAL
                            </span>

                            <div className="contact-socials">
                                <a
                                    href="https://www.instagram.com/nexustechworks/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>

                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                >
                                    <i className="fab fa-linkedin-in"></i>
                                </a>

                                <a
                                    href="#"
                                    aria-label="GitHub"
                                >
                                    <i className="fab fa-github"></i>
                                </a>
                            </div>
                        </div>

                        {/* Response */}
                        <div className="contact-response">
                            <span>●</span>
                            <div>
                                <strong>
                                    Let's connect
                                </strong>

                                <p>
                                    Tell us about your idea and we'll get
                                    back to you as soon as possible.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <div className="contact-form-header">
                            <span className="section-label">
                                START A PROJECT
                            </span>

                            <h3>
                                How can we help?
                            </h3>
                        </div>

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >
                            {/* Name + Email */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        Full Name *
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

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
                            </div>

                            {/* Phone + Company */}
                            <div className="form-row">
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

                                <div className="form-group">
                                    <label htmlFor="company">
                                        Company / Brand
                                    </label>

                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        placeholder="Your company"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Service */}
                            <div className="form-group">
                                <label htmlFor="service">
                                    What do you need? *
                                </label>

                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select a service
                                    </option>

                                    <option value="Software Development">
                                        Software Development
                                    </option>

                                    <option value="Web Development">
                                        Web Development
                                    </option>

                                    <option value="Content Creation">
                                        Content Creation
                                    </option>

                                    <option value="Digital Marketing">
                                        Digital Marketing
                                    </option>

                                    <option value="Branding & Design">
                                        Branding & Design
                                    </option>

                                    <option value="Complete Digital Solution">
                                        Complete Digital Solution
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div className="form-group">
                                <label htmlFor="budget">
                                    Estimated Budget
                                </label>

                                <select
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select your budget
                                    </option>

                                    <option value="Below $250">
                                        Below $250
                                    </option>

                                    <option value="$250 - $500">
                                        $250 – $500
                                    </option>

                                    <option value="$500 - $1000">
                                        $500 – $1,000
                                    </option>

                                    <option value="$1000 - $2500">
                                        $1,000 – $2,500
                                    </option>

                                    <option value="$2500+">
                                        $2,500+
                                    </option>

                                    <option value="Not Sure">
                                        Not sure yet
                                    </option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="form-group">
                                <label htmlFor="message">
                                    Tell us about your project *
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="7"
                                    placeholder="Tell us about your project, goals, requirements or idea..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="contact-submit"
                            >
                                Send Enquiry
                                <span>↗</span>
                            </button>

                            <p className="form-note">
                                By submitting this form, you agree to be
                                contacted by Nexus Techworks regarding your
                                enquiry.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            <section className="contact-cta">
                <div className="container">
                    <span className="section-label">
                        NOT SURE WHERE TO START?
                    </span>

                    <h2>
                        We can figure it out
                        <span> together.</span>
                    </h2>

                    <p>
                        You don't need to have everything planned.
                        Just bring the idea.
                    </p>

                    <NavLink
                        to="/services"
                        className="contact-cta-button"
                    >
                        Explore Our Services
                        <span>↗</span>
                    </NavLink>
                </div>
            </section>
        </main>
    );
};
export default Contact;