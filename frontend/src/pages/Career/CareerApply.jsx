import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./CareerApply.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const CareerApply = () => {
    const [searchParams] = useSearchParams();
    const resumeInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: searchParams.get("position") || "",
        experience: "",
        portfolio: "",
        github: "",
        linkedin: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [resume, setResume] = useState(null);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0];

        setResume(null);
        setSubmitMessage("");
        setSubmitError(false);

        if (!file) return;

        const extension = file.name.split(".").pop()?.toLowerCase();

        const allowedExtensions = ["pdf", "doc", "docx"];

        if (
            !allowedExtensions.includes(extension) ||
            !ALLOWED_RESUME_TYPES.includes(file.type)
        ) {
            event.target.value = "";
            setSubmitError(true);
            setSubmitMessage(
                "Please upload a valid PDF, DOC, or DOCX resume."
            );
            return;
        }

        if (file.size === 0 || file.size > MAX_RESUME_SIZE) {
            event.target.value = "";
            setSubmitError(true);
            setSubmitMessage(
                "Resume must be a non-empty file of 5 MB or less."
            );
            return;
        }

        setResume(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;

        if (!resume) {
            setSubmitError(true);
            setSubmitMessage("Please upload your resume before submitting.");
            resumeInputRef.current?.focus();
            return;
        }

        setSubmitting(true);
        setSubmitMessage("");
        setSubmitError(false);

        try {
            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });

            payload.append("resume", resume);

            const response = await fetch(
                `${API_URL}/api/career-applications`,
                {
                    method: "POST",
                    body: payload,
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.success) {
                throw new Error(
                    data?.message ||
                        "Unable to submit your application. Please try again."
                );
            }

            setSubmitMessage(
                "Thank you for applying to Nexus Techworks. Your application has been submitted successfully."
            );
            setSubmitError(false);

            setFormData({
                name: "",
                email: "",
                phone: "",
                position: "",
                experience: "",
                portfolio: "",
                github: "",
                linkedin: "",
            });

            setResume(null);

            if (resumeInputRef.current) {
                resumeInputRef.current.value = "";
            }
        } catch (error) {
            setSubmitError(true);
            setSubmitMessage(
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="career-apply-page">
            <section className="career-apply-hero">
                <div className="container">
                    <NavLink to="/career" className="back-career-link">
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
                        <span className="section-label">APPLICATION</span>

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
                            <strong>Before you apply</strong>

                            <ul>
                                <li>
                                    Be honest about your skills and experience.
                                </li>
                                <li>
                                    Share your portfolio or GitHub if available.
                                </li>
                                <li>Tell us what you want to learn.</li>
                                <li>Show us what you can bring to the team.</li>
                            </ul>
                        </div>
                    </div>

                    <form
                        className="application-form"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                maxLength={120}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    maxLength={254}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    maxLength={30}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="position">Position *</label>
                            <select
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a position</option>
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
                            <label htmlFor="experience">Experience Level</label>
                            <select
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                            >
                                <option value="">Select your experience</option>
                                <option value="Student">Student</option>
                                <option value="Fresher">Fresher</option>
                                <option value="0-2">0–2 Years</option>
                                <option value="2-5">2–5 Years</option>
                                <option value="5+">5+ Years</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="portfolio">Portfolio</label>
                                <input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    maxLength={500}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="github">GitHub</label>
                                <input
                                    id="github"
                                    name="github"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    value={formData.github}
                                    onChange={handleChange}
                                    maxLength={500}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input
                                id="linkedin"
                                name="linkedin"
                                type="url"
                                placeholder="https://linkedin.com/in/username"
                                value={formData.linkedin}
                                onChange={handleChange}
                                maxLength={500}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="resume">Resume / CV *</label>

                            <input
                                ref={resumeInputRef}
                                id="resume"
                                name="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                                required
                            />

                            <small>
                                Accepted formats: PDF, DOC, DOCX. Maximum size:
                                5 MB.
                            </small>

                            {resume && (
                                <p className="resume-selected">
                                    Selected: {resume.name} (
                                    {(resume.size / (1024 * 1024)).toFixed(2)}{" "}
                                    MB)
                                </p>
                            )}
                        </div>

                        {submitMessage && (
                            <p
                                className={`application-feedback ${
                                    submitError ? "error" : "success"
                                }`}
                                role="status"
                                aria-live="polite"
                            >
                                {submitMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="application-submit"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                            {!submitting && <span>↗</span>}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default CareerApply;