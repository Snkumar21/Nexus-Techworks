import { NavLink } from "react-router-dom";
import "./About.css";

const About = () => {
    return (
        <main className="about-page">

            {/* HERO */}
            <section className="about-hero">
                <div className="container about-hero-container">
                    <div className="about-hero-content">
                        <span className="section-label">
                            ABOUT NEXUS TECHWORKS
                        </span>

                        <h1>
                            We build ideas
                            <span> that evolve.</span>
                        </h1>

                        <p>
                            Nexus Techworks is a technology, digital and
                            business solutions company focused on turning
                            ideas into meaningful digital experiences.
                        </p>
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
                            Nexus Techworks was built with a simple idea:
                            technology should help people and businesses
                            move forward.
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
                            We envision a future where businesses of every
                            size can use technology and digital innovation
                            to create meaningful opportunities, solve
                            problems and grow with confidence.
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
                            Our mission is to create practical, innovative
                            and accessible solutions that combine technology,
                            creativity and business strategy.
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
        </main>
    );
};
export default About;