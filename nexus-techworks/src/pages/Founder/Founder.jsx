import { NavLink } from "react-router-dom";
import "./Founder.css";

const Founder = () => {
    return (
        <main className="founder-page">
            <section className="founder-hero">
                <div className="container founder-hero-container">
                    <div className="founder-hero-content">
                        <span className="section-label">
                            THE FOUNDER
                        </span>

                        <h1>
                            Building ideas.
                            <br />
                            <span>Creating impact.</span>
                        </h1>

                        <p>
                            I'm the founder of Nexus Techworks — a technology,
                            digital and business solutions company focused on
                            helping ideas and businesses grow through
                            meaningful digital experiences.
                        </p>

                        <div className="founder-hero-buttons">
                            <NavLink
                                to="/contact"
                                className="btn-primary"
                            >
                                Let's Work Together
                                <span>↗</span>
                            </NavLink>

                            <NavLink
                                to="/projects"
                                className="btn-secondary"
                            >
                                Explore Our Work
                            </NavLink>
                        </div>
                    </div>

                    {/* Founder Visual */}
                    <div className="founder-visual">
                        <div className="founder-card">
                            <div className="founder-card-top">
                                <span>01</span>
                                <span>FOUNDER</span>
                            </div>

                            <div className="founder-initial">
                                N
                            </div>

                            <div className="founder-card-bottom">
                                <strong>
                                    Nexus Techworks
                                </strong>

                                <span>
                                    Tech • Digital • Business Solutions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-about">
                <div className="container founder-about-grid">
                    <div>
                        <span className="section-label">
                            ABOUT THE FOUNDER
                        </span>

                        <h2>
                            Technology is not just
                            <span> about code.</span>
                        </h2>
                    </div>

                    <div className="founder-about-content">
                        <p className="large-text">
                            I'm a technology-focused professional and the
                            founder of Nexus Techworks, passionate about
                            building practical digital solutions that solve
                            real business problems.
                        </p>

                        <p>
                            My approach combines software development,
                            creativity, digital strategy and business
                            thinking. Instead of simply building products,
                            I focus on understanding the problem first and
                            then creating solutions that are useful,
                            scalable and meaningful.
                        </p>

                        <p>
                            Nexus Techworks was created with a simple belief:
                            businesses shouldn't have to choose between
                            technology, creativity and strategy. They should
                            be able to access all three together.
                        </p>
                    </div>
                </div>
            </section>

            <section className="founder-vision">
                <div className="container">
                    <div className="vision-header">
                        <span className="section-label">
                            VISION
                        </span>

                        <h2>
                            Keep <span>Evolving.</span>
                        </h2>
                    </div>

                    <div className="vision-grid">
                        <div className="vision-main">
                            <p>
                                My vision for Nexus Techworks is to build a
                                technology-driven company that helps
                                businesses, creators and entrepreneurs turn
                                ideas into scalable digital experiences.
                            </p>

                            <p>
                                The goal is not to follow every trend.
                                The goal is to understand what actually
                                creates value and use technology,
                                creativity and strategy to create it.
                            </p>
                        </div>

                        <div className="vision-points">
                            <div className="vision-point">
                                <span>01</span>
                                <h3>Build</h3>
                                <p>
                                    Create reliable and scalable digital
                                    solutions.
                                </p>
                            </div>

                            <div className="vision-point">
                                <span>02</span>
                                <h3>Evolve</h3>
                                <p>
                                    Continuously learn, improve and adapt.
                                </p>
                            </div>

                            <div className="vision-point">
                                <span>03</span>
                                <h3>Impact</h3>
                                <p>
                                    Turn technology into measurable value.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-expertise">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                EXPERTISE
                            </span>

                            <h2>
                                What I bring to
                                <span> the table.</span>
                            </h2>
                        </div>
                        <p>
                            A combination of technical knowledge,
                            creativity and business-oriented thinking.
                        </p>
                    </div>

                    <div className="expertise-grid">
                        <div className="expertise-card">
                            <span>01</span>
                            <h3>Software Development</h3>
                            <p>
                                Building modern applications and
                                technology solutions with a focus on
                                performance, scalability and usability.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <span>02</span>
                            <h3>Web Development</h3>
                            <p>
                                Creating responsive, modern and
                                conversion-focused websites and web
                                applications.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <span>03</span>
                            <h3>AI & Digital Solutions</h3>
                            <p>
                                Exploring AI-powered products,
                                automation and intelligent digital
                                experiences.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <span>04</span>
                            <h3>Content & Creative</h3>
                            <p>
                                Combining technology with visual
                                storytelling, content creation and
                                creative digital experiences.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <span>05</span>
                            <h3>Digital Strategy</h3>
                            <p>
                                Helping businesses identify opportunities
                                and build practical digital strategies.
                            </p>
                        </div>

                        <div className="expertise-card">
                            <span>06</span>
                            <h3>Problem Solving</h3>
                            <p>
                                Understanding the problem first and
                                designing solutions around real-world
                                requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-stack">
                <div className="container">
                    <div className="stack-header">
                        <span className="section-label">
                            TECHNOLOGY
                        </span>

                        <h2>
                            Tools I use to
                            <span> build.</span>
                        </h2>
                    </div>

                    <div className="stack-list">
                        <span>React.js</span>
                        <span>JavaScript</span>
                        <span>Node.js</span>
                        <span>Express.js</span>
                        <span>MongoDB</span>
                        <span>MySQL</span>
                        <span>Python</span>
                        <span>Java</span>
                        <span>Git & GitHub</span>
                        <span>REST APIs</span>
                        <span>Firebase</span>
                        <span>AI / ML</span>
                    </div>
                </div>
            </section>

            <section className="founder-journey">
                <div className="container">
                    <span className="section-label">
                        THE JOURNEY
                    </span>

                    <h2>
                        From learning
                        <span> to building.</span>
                    </h2>

                    <div className="journey-timeline">
                        <div className="journey-item">
                            <span className="journey-number">
                                01
                            </span>

                            <div>
                                <h3>
                                    Foundation
                                </h3>

                                <p>
                                    Started the journey with computer
                                    applications, programming and a strong
                                    curiosity for technology.
                                </p>
                            </div>
                        </div>

                        <div className="journey-item">
                            <span className="journey-number">
                                02
                            </span>

                            <div>
                                <h3>
                                    Building
                                </h3>

                                <p>
                                    Developed websites, applications,
                                    automation projects and explored
                                    different areas of software development.
                                </p>
                            </div>
                        </div>

                        <div className="journey-item">
                            <span className="journey-number">
                                03
                            </span>

                            <div>
                                <h3>
                                    Creating
                                </h3>

                                <p>
                                    Started working across technology,
                                    digital content and creative projects
                                    while building a broader understanding
                                    of digital businesses.
                                </p>
                            </div>
                        </div>

                        <div className="journey-item">
                            <span className="journey-number">
                                04
                            </span>

                            <div>
                                <h3>
                                    Nexus Techworks
                                </h3>

                                <p>
                                    Turned that experience and vision into
                                    Nexus Techworks — bringing technology,
                                    digital creativity and business
                                    solutions together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-achievements">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                HIGHLIGHTS
                            </span>

                            <h2>
                                Milestones that
                                <span> matter.</span>
                            </h2>
                        </div>
                    </div>

                    <div className="achievement-grid">
                        <div className="achievement-card">
                            <strong>HackVerse</strong>
                            <span>Hackathon Winner — 2025</span>
                        </div>

                        <div className="achievement-card">
                            <strong>AI Projects</strong>
                            <span>
                                Built AI-powered applications and
                                intelligent digital solutions
                            </span>
                        </div>

                        <div className="achievement-card">
                            <strong>Tech Community</strong>
                            <span>
                                Technology creator and community
                                contributor
                            </span>
                        </div>

                        <div className="achievement-card">
                            <strong>Continuous Learning</strong>
                            <span>
                                Always exploring new technologies,
                                frameworks and digital possibilities
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="founder-message">
                <div className="container">
                    <span className="section-label">
                        A MESSAGE FROM THE FOUNDER
                    </span>

                    <blockquote>
                        "Every great digital product starts with a
                        problem worth solving, an idea worth exploring,
                        and the willingness to keep evolving."
                    </blockquote>

                    <div className="founder-signature">
                        <strong>
                            Founder
                        </strong>

                        <span>
                            Nexus Techworks
                        </span>
                    </div>
                </div>
            </section>

            <section className="founder-cta">
                <div className="container">
                    <span className="section-label">
                        HAVE AN IDEA?
                    </span>

                    <h2>
                        Let's turn your
                        <span> idea into reality.</span>
                    </h2>

                    <p>
                        Let's build something useful, meaningful and
                        built to evolve.
                    </p>

                    <NavLink
                        to="/contact"
                        className="founder-cta-button"
                    >
                        Start a Conversation
                        <span>↗</span>
                    </NavLink>
                </div>
            </section>
        </main>
    );
};
export default Founder;