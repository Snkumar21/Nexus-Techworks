
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Projects.css";

const API_URL = ( import.meta.env.VITE_API_URL || "http://localhost:5000" ).replace(/\/$/, "");

const getScreenshotUrl = (project) => {
    // Prefer a screenshot image explicitly saved with the project.
    const savedImage = project.previewImage || project.image;

    if (savedImage) { return savedImage; }

    // Use a live screenshot only when a valid public URL exists.
    try {
        const url = new URL(project.link);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return `https://image.thum.io/get/width/1200/crop/760/noanimate/${url.href}`;
        }
    } catch {
        // Projects without a valid live URL use the fallback preview.
    }

    return "";
};

const ProjectPreview = ({ project }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = project.previewImage || project.image || "";

    useEffect(() => { setImageFailed(false); }, [imageUrl]);
    
    return (
        <div className="project-preview">
            {project.previewImage && !imageFailed ? (
                <img
                    className="project-preview-image"
                    src={project.previewImage}
                    alt={`Website preview of ${project.title}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="project-preview-fallback">
                    <span className="preview-fallback-label">
                        NEXUS TECHWORKS / PROJECT
                    </span>

                    <span className="preview-fallback-number">
                        {project.title?.slice(0, 2).toUpperCase() || "NT"}
                    </span>

                    <div className="preview-fallback-content">
                        <span>{project.category || "Digital Solution"}</span>
                        <h4>{project.title}</h4>
                        <p>Ideas brought to life.</p>
                    </div>

                    <span className="preview-fallback-mark">↗</span>
                </div>
            )}

            {project.previewImage && !imageFailed && (
                <span className="project-preview-overlay" aria-hidden="true">
                    <span>Explore Project ↗</span>
                </span>
            )}
        </div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/projects/page`,
                    {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        data?.message || "Unable to load projects right now."
                    );
                }

                setProjects(
                    Array.isArray(data?.projects) ? data.projects : []
                );
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        err.message || "Unable to load projects right now."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadProjects();

        return () => controller.abort();
    }, []);

    // Reveal cards and archive rows as they enter the viewport.
    useEffect(() => {
        const page = document.querySelector(".projects-page");

        if (!page || loading || error) {
            return;
        }

        const elements = page.querySelectorAll(".reveal-on-scroll");

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) =>
                element.classList.add("is-visible")
            );
            return;
        }

        page.classList.add("reveal-enabled");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px",
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => {
            observer.disconnect();
            page.classList.remove("reveal-enabled");
        };
    }, [loading, error, projects.length]);

    const featuredProjects = projects.filter(
        (project) => project.featured
    );

    return (
        <main className="projects-page">
            <section className="projects-hero">
                <div className="container projects-hero-container">
                    <span className="section-label">OUR WORK</span>

                    <h1>
                        Ideas we have <span>brought to life.</span>
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
                    <div className="section-heading reveal-on-scroll">
                        <div>
                            <span className="section-label">
                                FEATURED WORK
                            </span>

                            <h2>
                                Built with <span>purpose.</span>
                            </h2>
                        </div>

                        <p>
                            Every project represents a combination of
                            technology, creativity and problem solving.
                        </p>
                    </div>

                    {loading ? (
                        <p className="projects-data-message" role="status">
                            Loading projects...
                        </p>
                    ) : error ? (
                        <p className="projects-data-message" role="alert">
                            {error}
                        </p>
                    ) : featuredProjects.length === 0 ? (
                        <p className="projects-data-message">
                            No featured projects are available right now.
                        </p>
                    ) : (
                        <div className="featured-project-grid">
                            {featuredProjects.map((project, index) => (
                                <article
                                    className="featured-project-card reveal-on-scroll"
                                    key={project._id || project.title}
                                    style={{
                                        "--reveal-delay": `${(index % 2) * 100}ms`,
                                    }}
                                >
                                    <ProjectPreview project={project} />

                                    <div className="project-card-top">
                                        <span className="project-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span className="project-status">
                                            {project.status}
                                        </span>
                                    </div>

                                    <div className="project-card-content">
                                        <span className="project-category">
                                            {project.category}
                                        </span>

                                        <h3>{project.title}</h3>

                                        <p>{project.description}</p>
                                    </div>

                                    <div className="project-tech">
                                        {(project.tech || []).map(
                                            (technology) => (
                                                <span key={technology}>
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-view-link"
                                        >
                                            View Project <span>↗</span>
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="all-projects">
                <div className="container">
                    <div className="section-heading reveal-on-scroll">
                        <div>
                            <span className="section-label">
                                PROJECT ARCHIVE
                            </span>

                            <h2>
                                More things we have <span>created.</span>
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <p className="projects-data-message" role="status">
                            Loading project archive...
                        </p>
                    ) : error ? (
                        <p className="projects-data-message" role="alert">
                            Project archive is temporarily unavailable.
                        </p>
                    ) : projects.length === 0 ? (
                        <p className="projects-data-message">
                            No published projects yet.
                        </p>
                    ) : (
                        <div className="projects-table">
                            {projects.map((project, index) => (
                                <div
                                    className="project-row reveal-on-scroll"
                                    key={project._id || project.title}
                                    style={{
                                        "--reveal-delay": `${Math.min(index * 45, 225)}ms`,
                                    }}
                                >
                                    <span className="project-row-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="project-row-name">
                                        <span>{project.category}</span>
                                        <h3>{project.title}</h3>
                                    </div>

                                    <div className="project-row-tech">
                                        {(project.tech || [])
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
                    )}
                </div>
            </section>

            <section className="projects-philosophy">
                <div className="container projects-philosophy-container">
                    <div className="reveal-on-scroll">
                        <span className="section-label">
                            OUR APPROACH
                        </span>

                        <h2>
                            We don't just <span>build.</span>
                        </h2>
                    </div>

                    <div className="projects-philosophy-content reveal-on-scroll">
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
                    <span className="section-label">HAVE AN IDEA?</span>

                    <h2>
                        Your project could be <span>next.</span>
                    </h2>

                    <p>Let's turn your idea into something real.</p>

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