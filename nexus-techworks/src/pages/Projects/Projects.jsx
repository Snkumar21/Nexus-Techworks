import { NavLink } from "react-router-dom";
import "./Projects.css";

const projects = [
    {
        id: "01",
        title: "Nexus Arena",
        category: "Education Platform",
        description:
            "A digital education platform designed to bring learning resources and courses together in one accessible ecosystem.",
        tech: ["React.js", "Node.js", "MongoDB", "Firebase"],
        status: "Live",
        featured: true,
        link: "https://nexus-arena-zeta.vercel.app/",
    },

    {
        id: "02",
        title: "ERIC AI Chat Bot",
        category: "AI & Automation",
        description:
            "An AI-powered conversational platform designed to provide intelligent responses, voice interaction and personalized chat experiences.",
        tech: ["React.js", "Node.js", "MongoDB", "OpenAI"],
        status: "Live",
        featured: true,
        link: "https://eric-chat-bot-3-0.onrender.com",
    },

    {
        id: "03",
        title: "Prathamesh Builders & Developers",
        category: "Real Estate",
        description:
            "A modern digital presence designed for a real estate business to showcase projects, services and company information.",
        tech: ["React.js", "Node.js", "MongoDB", "Firebase"],
        status: "Delivered",
        featured: true,
    },

    {
        id: "04",
        title: "Smart Personal Finance",
        category: "FinTech",
        description:
            "A personal finance and budgeting application focused on helping users understand and manage their financial activities.",
        tech: ["React.js", "Node.js", "MongoDB"],
        status: "Developed",
    },

    {
        id: "05",
        title: "HubVerse",
        category: "Education",
        description:
            "An education-focused web platform created to organize and present learning resources through a structured digital experience.",
        tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
        status: "Developed",
    },

    {
        id: "06",
        title: "Nexus Techworks",
        category: "Corporate Website",
        description:
            "The official digital platform of Nexus Techworks, bringing technology, digital and business solutions together under one brand.",
        tech: ["React.js", "Node.js", "MongoDB"],
        status: "Live",
        featured: true,
        link: "https://nexus-techworks.vercel.app/",
    },
];

const Projects = () => {
    const featuredProjects = projects.filter(
        (project) => project.featured
    );
    return (
        <main className="projects-page">

            <section className="projects-hero">
                <div className="container projects-hero-container">
                    <span className="section-label">
                        OUR WORK
                    </span>

                    <h1>
                        Ideas we have
                        <span> brought to life.</span>
                    </h1>

                    <p>
                        A collection of digital products, platforms and
                        solutions we have built, developed and delivered
                        through Nexus Techworks.
                    </p>
                </div>
            </section>

            <section className="featured-projects">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                FEATURED WORK
                            </span>

                            <h2>
                                Built with
                                <span> purpose.</span>
                            </h2>
                        </div>
                        <p>
                            Every project represents a combination of
                            technology, creativity and problem solving.
                        </p>
                    </div>

                    <div className="featured-project-grid">
                        {featuredProjects.map((project) => (
                            <article
                                className="featured-project-card"
                                key={project.id}
                            >
                                <div className="project-card-top">
                                    <span className="project-number">
                                        {project.id}
                                    </span>

                                    <span className="project-status">
                                        {project.status}
                                    </span>
                                </div>

                                <div className="project-card-content">
                                    <span className="project-category">
                                        {project.category}
                                    </span>

                                    <h3>
                                        {project.title}
                                    </h3>

                                    <p>
                                        {project.description}
                                    </p>
                                </div>

                                <div className="project-tech">
                                    {project.tech.map((technology) => (
                                        <span key={technology}>
                                            {technology}
                                        </span>
                                    ))}
                                </div>

                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="project-view-link"
                                    >
                                        View Project
                                        <span>↗</span>
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="all-projects">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                PROJECT ARCHIVE
                            </span>

                            <h2>
                                More things we have
                                <span> created.</span>
                            </h2>
                        </div>
                    </div>

                    <div className="projects-table">
                        {projects.map((project) => (
                            <div
                                className="project-row"
                                key={project.id}
                            >
                                <span className="project-row-number">
                                    {project.id}
                                </span>

                                <div className="project-row-name">
                                    <span>
                                        {project.category}
                                    </span>

                                    <h3>
                                        {project.title}
                                    </h3>
                                </div>

                                <div className="project-row-tech">
                                    {project.tech
                                        .slice(0, 3)
                                        .map((technology) => (
                                            <span key={technology}>
                                                {technology}
                                            </span>
                                        ))}
                                </div>

                                <span className="project-row-status">
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="projects-philosophy">
                <div className="container projects-philosophy-container">
                    <div>
                        <span className="section-label">
                            OUR APPROACH
                        </span>

                        <h2>
                            We don't just
                            <span> build.</span>
                        </h2>
                    </div>

                    <div className="projects-philosophy-content">
                        <p className="large-text">
                            We build solutions that are meant to solve
                            real problems, create better experiences and
                            evolve with the people and businesses using them.
                        </p>

                        <p>
                            Every project starts with understanding the
                            problem. From there, we plan, design, develop,
                            test and continuously improve the solution.
                        </p>
                    </div>
                </div>
            </section>

            <section className="projects-cta">
                <div className="container">
                    <span className="section-label">
                        HAVE AN IDEA?
                    </span>

                    <h2>
                        Your project could be
                        <span> next.</span>
                    </h2>

                    <p>
                        Let's turn your idea into something real.
                    </p>

                    <NavLink
                        to="/contact"
                        className="projects-cta-button"
                    >
                        Start a Project
                    </NavLink>
                </div>
            </section>
        </main>
    );
};
export default Projects;