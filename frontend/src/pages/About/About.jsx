import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { DEFAULT_ABOUT_CONTENT } from "../../data/aboutContent";
import "./About.css";

const API_URL = ( import.meta.env.VITE_API_URL || "http://localhost:5000" ).replace(/\/$/, "");

const About = () => {
    const [content, setContent] = useState({
        ...DEFAULT_ABOUT_CONTENT,
    });

    useEffect(() => {
        let cancelled = false;
        const fetchAboutContent = async () => {
            try {
                const response = await fetch(`${API_URL}/api/about/page`, {
                    method: "GET",
                    headers: { Accept: "application/json", },
                    cache: "no-store",
                });
                if (!response.ok) {
                    throw new Error("Unable to fetch About page content.");
                }
                const data = await response.json();
                if (!cancelled) {
                    setContent({
                        ...DEFAULT_ABOUT_CONTENT,
                        ...(data.page || {}),
                    });
                }
            } catch (error) {
                console.error("About page content fetch failed:", error);
                if (!cancelled) {
                    setContent({ ...DEFAULT_ABOUT_CONTENT });
                }
            }
        };
        fetchAboutContent();
        return () => {
            cancelled = true;
        };
    }, []);

    return <main className="about-page">
            {/* HERO */}
            <section className="about-hero">
                <div className="container about-hero-container">

                    <div className="about-hero-content">
                        <span className="section-label">ABOUT NEXUS TECHWORKS</span>
                        <h1> {content.heroTitle} <span>{content.heroAccent}</span> </h1>
                        <p> {content.heroDescription} </p>
                    </div>

                </div>
            </section>

            {/* WHO WE ARE */}
            <section className="about-intro">
                <div className="container about-intro-grid">
                    <div className="about-section-title">
                        <span className="section-label">
                            WHO WE ARE
                        </span>

                        <h2>
                            Technology with
                            <span> purpose.</span>
                        </h2>
                    </div>

                    <div className="about-intro-content">
                        <p className="about-large-text">
                            {content.introLead}
                        </p>

                        <p>
                            We work across software development, digital
                            solutions, content creation, digital marketing
                            and business solutions to help brands establish
                            a stronger presence in an evolving digital world.
                        </p>

                        <p>
                            From developing digital products to creating
                            content and helping businesses strengthen their
                            online presence, we bring technology, creativity
                            and strategy together under one roof.
                        </p>
                    </div>
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="about-services">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                WHAT WE DO
                            </span>

                            <h2>
                                From ideas to
                                <span> execution.</span>
                            </h2>
                        </div>

                        <p>
                            We combine technical expertise, creative thinking
                            and business understanding to create solutions
                            that deliver real value.
                        </p>
                    </div>

                    <div className="about-services-grid">
                        <article className="about-service-card">
                            <span>01</span>

                            <h3>
                                Software Development
                            </h3>

                            <p>
                                Building modern, scalable and reliable
                                software solutions designed around real
                                business requirements.
                            </p>
                        </article>

                        <article className="about-service-card">
                            <span>02</span>

                            <h3>
                                Web Development
                            </h3>

                            <p>
                                Creating responsive and engaging websites
                                and web applications that deliver seamless
                                digital experiences.
                            </p>
                        </article>

                        <article className="about-service-card">
                            <span>03</span>

                            <h3>
                                Content Creation
                            </h3>

                            <p>
                                Developing visual and digital content that
                                helps brands communicate their identity and
                                connect with their audience.
                            </p>
                        </article>

                        <article className="about-service-card">
                            <span>04</span>

                            <h3>
                                Digital Marketing
                            </h3>

                            <p>
                                Helping businesses build their digital
                                presence through creative and strategic
                                marketing solutions.
                            </p>
                        </article>

                        <article className="about-service-card">
                            <span>05</span>

                            <h3>
                                Branding & Design
                            </h3>

                            <p>
                                Creating meaningful visual identities and
                                digital experiences that make brands
                                recognizable and memorable.
                            </p>
                        </article>

                        <article className="about-service-card">
                            <span>06</span>

                            <h3>
                                Business Solutions
                            </h3>

                            <p>
                                Understanding business challenges and
                                developing technology-driven solutions that
                                support growth and efficiency.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* VISION */}
            <section className="about-vision">
                <div className="container about-vision-container">
                    <div className="about-vision-label">
                        <span className="section-label">
                            OUR VISION
                        </span>
                    </div>

                    <div className="about-vision-content">
                        <h2>
                            Keep
                            <span> Evolving.</span>
                        </h2>

                        <p>
                            {content.vision}
                        </p>

                        <p>
                            We aim to continuously learn, adapt and evolve
                            with technology while helping our clients do
                            the same.
                        </p>
                    </div>
                </div>
            </section>

            {/* MISSION */}
            <section className="about-mission">
                <div className="container about-mission-container">
                    <div className="about-mission-content">
                        <span className="section-label">
                            OUR MISSION
                        </span>

                        <h2>
                            Make technology
                            <span> meaningful.</span>
                        </h2>

                        <p>
                            {content.mission}
                        </p>
                    </div>

                    <div className="mission-points">
                        <div className="mission-point">
                            <span>01</span>
                            <p>
                                Understand before we build.
                            </p>
                        </div>

                        <div className="mission-point">
                            <span>02</span>
                            <p>
                                Create with purpose.
                            </p>
                        </div>

                        <div className="mission-point">
                            <span>03</span>
                            <p>
                                Deliver with quality.
                            </p>
                        </div>

                        <div className="mission-point">
                            <span>04</span>
                            <p>
                                Keep evolving.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="about-values">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                OUR VALUES
                            </span>

                            <h2>
                                What drives
                                <span> us.</span>
                            </h2>
                        </div>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <span>01</span>
                            <h3>Innovation</h3>
                            <p>
                                We continuously explore better ideas,
                                technologies and ways of solving problems.
                            </p>
                        </div>

                        <div className="value-card">
                            <span>02</span>
                            <h3>Quality</h3>
                            <p>
                                We believe good work starts with attention
                                to detail and ends with meaningful results.
                            </p>
                        </div>

                        <div className="value-card">
                            <span>03</span>
                            <h3>Transparency</h3>
                            <p>
                                Clear communication and honest collaboration
                                are at the heart of how we work.
                            </p>
                        </div>

                        <div className="value-card">
                            <span>04</span>
                            <h3>Growth</h3>
                            <p>
                                We believe in continuous learning,
                                improvement and long-term growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* MERGED FOUNDER CONTENT */}
            <section className="founder-about" id="founder">
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
                            {content.founderBio}
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
                        {content.founderMessage}
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
            {/* CTA */}

            <section className="about-cta">
                <div className="container about-cta-container">
                    <span className="section-label">
                        LET'S BUILD TOGETHER
                    </span>

                    <h2>
                        Have an idea?
                        <span> Let's make it real.</span>
                    </h2>

                    <p>
                        Let's discuss your idea, project or business
                        challenge and explore what we can build together.
                    </p>

                    <NavLink
                        to="/contact"
                        className="about-cta-button"
                    >
                        Let's Talk
                    </NavLink>
                </div>
            </section>

  </main>;
};
export default About;