import { NavLink } from "react-router-dom";
import "./Career.css";

const opportunities = [
    {
        title: "Software Developer",
        type: "Internship / Entry Level",
        description:
            "Work on real-world web applications, APIs and software solutions using modern technologies.",
        skills: "React.js • Node.js • MongoDB",
    },
    {
        title: "Web Developer",
        type: "Internship / Entry Level",
        description:
            "Build responsive, modern and user-focused websites and web applications.",
        skills: "HTML • CSS • JavaScript • React.js",
    },
    {
        title: "Digital Content Creator",
        type: "Internship / Freelance",
        description:
            "Create engaging visual content, reels, videos and digital creatives for brands.",
        skills: "Video Editing • Design • Content Strategy",
    },
    {
        title: "Digital Marketing Associate",
        type: "Internship / Entry Level",
        description:
            "Help businesses improve their online presence through creative and data-driven strategies.",
        skills: "Social Media • SEO • Marketing",
    },
];

const Career = () => {
    return (
        <main className="career-page">
            <section className="career-hero">
                <div className="container career-hero-container">
                    <span className="section-label">
                        CAREERS AT NEXUS TECHWORKS
                    </span>

                    <h1>
                        Build.
                        <span> Learn.</span>
                        <br />
                        <span>Evolve.</span>
                    </h1>

                    <p>
                        We are building a team of curious minds, creative
                        thinkers and passionate problem solvers who want to
                        create meaningful digital experiences.
                    </p>

                    <NavLink
                        to="/career/apply"
                        className="career-primary-button"
                    >
                        Join Our Journey
                        <span>↗</span>
                    </NavLink>
                </div>
            </section>

            <section className="career-intro">
                <div className="container career-intro-grid">
                    <div>
                        <span className="section-label">
                            WHY NEXUS
                        </span>

                        <h2>
                            Don't just find a
                            <span> job.</span>
                            <br />
                            Build your future.
                        </h2>
                    </div>

                    <div className="career-intro-content">
                        <p className="large-text">
                            At Nexus Techworks, we believe people grow when
                            they get the opportunity to learn, experiment,
                            create and take ownership.
                        </p>

                        <p>
                            We want to create an environment where ideas are
                            welcomed, mistakes become lessons and every
                            contribution matters.
                        </p>
                    </div>
                </div>
            </section>

            <section className="career-goals">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                OUR GOALS
                            </span>

                            <h2>
                                What we are
                                <span> building.</span>
                            </h2>
                        </div>
                        <p>
                            Our goal is not only to build products. We want
                            to build people, ideas and opportunities.
                        </p>
                    </div>

                    <div className="goals-grid">
                        <div className="goal-card">
                            <span>01</span>

                            <h3>
                                Build Real Solutions
                            </h3>

                            <p>
                                Create technology that solves real problems
                                and delivers meaningful value to businesses
                                and users.
                            </p>
                        </div>

                        <div className="goal-card">
                            <span>02</span>

                            <h3>
                                Grow Together
                            </h3>

                            <p>
                                Create opportunities where individuals can
                                improve their technical, creative and
                                professional skills.
                            </p>
                        </div>

                        <div className="goal-card">
                            <span>03</span>

                            <h3>
                                Encourage Innovation
                            </h3>

                            <p>
                                Give people the freedom to experiment,
                                question existing ideas and find better ways
                                of doing things.
                            </p>
                        </div>

                        <div className="goal-card">
                            <span>04</span>

                            <h3>
                                Keep Evolving
                            </h3>

                            <p>
                                Technology never stops changing, and neither
                                should we. We continuously learn and adapt.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="career-motivation">
                <div className="container">
                    <span className="section-label">
                        A MESSAGE FROM NEXUS
                    </span>

                    <blockquote>
                        "You don't need to know everything
                        <span> to start.</span>
                        You just need the courage to
                        <span> learn.</span>"
                    </blockquote>

                    <p>
                        Everyone starts somewhere. Whether you are a student,
                        fresher, developer, designer, creator or someone
                        changing careers, your journey matters.
                    </p>

                    <p>
                        We believe the best teams are not built by finding
                        people who know everything. They are built by finding
                        people who are willing to learn, contribute and
                        evolve.
                    </p>
                </div>
            </section>

            <section className="career-culture">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                OUR CULTURE
                            </span>

                            <h2>
                                What matters
                                <span> here.</span>
                            </h2>
                        </div>
                    </div>

                    <div className="culture-grid">
                        <div className="culture-item">
                            <strong>01</strong>
                            <h3>Curiosity</h3>
                            <p>
                                Ask questions. Explore ideas. Never stop
                                learning.
                            </p>
                        </div>

                        <div className="culture-item">
                            <strong>02</strong>
                            <h3>Ownership</h3>
                            <p>
                                Take responsibility for your work and your
                                growth.
                            </p>
                        </div>

                        <div className="culture-item">
                            <strong>03</strong>
                            <h3>Creativity</h3>
                            <p>
                                Think differently and bring your own
                                perspective.
                            </p>
                        </div>

                        <div className="culture-item">
                            <strong>04</strong>
                            <h3>Collaboration</h3>
                            <p>
                                Great things happen when people build
                                together.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="career-opportunities">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                OPPORTUNITIES
                            </span>

                            <h2>
                                Find your
                                <span> place.</span>
                            </h2>
                        </div>
                        <p>
                            Explore the areas where you can learn, contribute
                            and grow with Nexus Techworks.
                        </p>
                    </div>

                    <div className="career-jobs">
                        {opportunities.map((job, index) => (
                            <div
                                className="career-job"
                                key={job.title}
                            >
                                <div className="career-job-number">
                                    0{index + 1}
                                </div>
                                <div className="career-job-info">
                                    <span>
                                        {job.type}
                                    </span>

                                    <h3>
                                        {job.title}
                                    </h3>

                                    <p>
                                        {job.description}
                                    </p>

                                    <small>
                                        {job.skills}
                                    </small>
                                </div>
                                <NavLink
                                    to="/career/apply"
                                    className="career-apply-link"
                                >
                                    Apply
                                    <span>↗</span>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="career-cta">
                <div className="container">
                    <span className="section-label">
                        READY TO START?
                    </span>

                    <h2>
                        Your journey
                        <span> starts here.</span>
                    </h2>

                    <p>
                        Bring your skills, ideas and curiosity.
                        We'll bring the opportunity to grow.
                    </p>

                    <NavLink
                        to="/career/apply"
                        className="career-cta-button"
                    >
                        Apply to Nexus Techworks
                        <span>↗</span>
                    </NavLink>
                </div>
            </section>
        </main>
    );
};
export default Career;