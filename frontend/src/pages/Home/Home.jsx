
import { useEffect, useState } from "react";
import "./Home.css";
import nexus from "../../assets/images/nexus-techworks.png";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const defaultHomeContent = {
    heroLabel: "NEXUS TECHWORKS",
    heroTitle: "Technology.",
    heroAccent: "Digital.",
    heroLastLine: "Business.",
    heroDescription:
        "We build innovative technology and digital solutions that help businesses turn ideas into meaningful digital experiences.",
    heroCards: [
        {
            number: "01",
            title: "Build",
            description: "Turning ideas into technology.",
        },
        {
            number: "02",
            title: "Create",
            description: "Creating meaningful digital experiences.",
        },
        {
            number: "03",
            title: "Grow",
            description: "Helping businesses move forward.",
        },
    ],
    introLabel: "WHO WE ARE",
    introTitle: "Your Technology & Digital",
    introAccent: " Growth Partner.",
    introDescription:
        "Nexus Techworks is a technology and digital solutions company focused on helping businesses build, improve and grow their digital presence.",
    servicesLabel: "WHAT WE DO",
    servicesTitle: "Solutions Built",
    servicesAccent: "For Your Business.",
    servicesDescription:
        "From software development to digital marketing, we bring technology and creativity together.",
    marketplaceLabel: "SOFTWARE & APP MARKETPLACE",
    marketplaceTitle: "Have a Software or App to",
    marketplaceAccent: " Buy or Sell?",
    marketplaceDescription:
        "Whether you're looking to sell an existing software product, mobile application or digital solution — or searching for the right product to acquire for your business — Nexus Techworks can help you connect with the right opportunities.",
    marketplaceFeatures: [
        {
            number: "01",
            title: "Sell Your Product",
            description:
                "Looking to sell your software, SaaS platform, website or mobile application? Connect with us to discuss the opportunity.",
        },
        {
            number: "02",
            title: "Purchase Software & Apps",
            description:
                "Looking for an existing digital product or software solution? Tell us your requirements and we'll explore suitable opportunities.",
        },
        {
            number: "03",
            title: "Valuation & Documentation",
            description:
                "Get professional product valuation, business documentation and supporting materials for software transactions.",
        },
    ],
    marketplaceButtonText: "Discuss Your Requirement →",
    marketplaceLink: "/contact",
    sellLabel: "SELL",
    sellTitle: "Have a Digital Product?",
    sellDescription: "Software • SaaS • Web Apps • Mobile Apps",
    buyLabel: "BUY",
    buyTitle: "Looking to Acquire?",
    buyDescription:
        "Discover opportunities that match your requirements.",
    projectsLabel: "OUR WORK",
    projectsTitle: "Ideas We've",
    projectsAccent: " Turned Into Reality.",
    projectsDescription:
        "Explore selected projects built with technology, creativity and purpose.",
};

const Home = () => {
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [homeContent, setHomeContent] = useState(defaultHomeContent);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchHomeData = async () => {
            setLoading(true);
            setApiError("");

            try {
                const [servicesResponse, projectsResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/api/services/page`, {
                            signal: controller.signal,
                        }),
                        fetch(`${API_URL}/api/projects/page`, {
                            signal: controller.signal,
                        }),
                    ]);

                if (!servicesResponse.ok || !projectsResponse.ok) {
                    throw new Error(
                        "Unable to load services or projects from the server."
                    );
                }

                const [servicesData, projectsData] = await Promise.all([
                    servicesResponse.json(),
                    projectsResponse.json(),
                ]);

                setServices(
                    Array.isArray(servicesData.services)
                        ? servicesData.services
                        : []
                );

                setProjects(
                    Array.isArray(projectsData.projects)
                        ? projectsData.projects
                        : []
                );

                // Home content API can be connected when its backend
                // model and public route are created.
                if (servicesData.homeContent) {
                    setHomeContent((previous) => ({
                        ...previous,
                        ...servicesData.homeContent,
                    }));
                }
            } catch (error) {
                if (error.name === "AbortError") return;

                console.error("Home page data error:", error);
                setApiError(
                    "Some website data could not be loaded. Please try again later."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchHomeData();

        return () => controller.abort();
    }, []);

    const content = homeContent;

    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <span className="hero-label">
                            {content.heroLabel}
                        </span>

                        <h1>
                            {content.heroTitle}
                            <br />
                            <span>{content.heroAccent}</span>
                            <br />
                            {content.heroLastLine}
                        </h1>

                        <p>{content.heroDescription}</p>

                        <div className="hero-buttons">
                            <a href="#services" className="btn-primary">
                                Explore Services
                            </a>

                            <a href="#projects" className="btn-secondary">
                                View Our Work
                            </a>
                        </div>
                    </div>

                    <div className="hero-visual">
                        {(content.heroCards || []).map((card, index) => (
                            <div className="hero-card" key={card.title || index}>
                                <span>{card.number || `0${index + 1}`}</span>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="intro-section">
                <div className="container">
                    <span className="section-label">
                        {content.introLabel}
                    </span>

                    <h2>
                        {content.introTitle}
                        <span>{content.introAccent}</span>
                    </h2>

                    <p>{content.introDescription}</p>
                </div>
            </section>

            {/* Services Preview */}
            <section className="services-preview" id="services">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                {content.servicesLabel}
                            </span>

                            <h2>
                                {content.servicesTitle}
                                <br />
                                <span>{content.servicesAccent}</span>
                            </h2>
                        </div>

                        <p>{content.servicesDescription}</p>
                    </div>

                    {loading && (
                        <p role="status">Loading services...</p>
                    )}

                    {!loading && services.length === 0 && (
                        <p>
                            No published services are available right now.
                        </p>
                    )}

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                className="service-card"
                                key={service._id}
                            >
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Software & App Marketplace */}
            <section className="software-marketplace">
                <div className="container marketplace-container">
                    <div className="marketplace-content">
                        <span className="section-label">
                            {content.marketplaceLabel}
                        </span>

                        <h2>
                            {content.marketplaceTitle}
                            <span>{content.marketplaceAccent}</span>
                        </h2>

                        <p>{content.marketplaceDescription}</p>

                        <div className="marketplace-features">
                            {(content.marketplaceFeatures || []).map(
                                (feature, index) => (
                                    <div
                                        className="marketplace-feature"
                                        key={feature.title || index}
                                    >
                                        <span>
                                            {feature.number ||
                                                String(index + 1).padStart(2, "0")}
                                        </span>

                                        <div>
                                            <h4>{feature.title}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <a
                            href={content.marketplaceLink || "/contact"}
                            className="btn-primary marketplace-btn"
                        >
                            {content.marketplaceButtonText}
                        </a>
                    </div>

                    <div className="marketplace-visual">
                        <div className="marketplace-card sell-card">
                            <span className="marketplace-card-label">
                                {content.sellLabel}
                            </span>

                            <h3>{content.sellTitle}</h3>
                            <p>{content.sellDescription}</p>
                        </div>

                        <div className="marketplace-divider">
                            <span>↔</span>
                        </div>

                        <div className="marketplace-card buy-card">
                            <span className="marketplace-card-label">
                                {content.buyLabel}
                            </span>

                            <h3>{content.buyTitle}</h3>
                            <p>{content.buyDescription}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Preview */}
            <section className="projects-preview" id="projects">
                <div className="container">
                    <span className="section-label">
                        {content.projectsLabel}
                    </span>

                    <h2>
                        {content.projectsTitle}
                        <span>{content.projectsAccent}</span>
                    </h2>

                    <p>{content.projectsDescription}</p>

                    {loading && (
                        <p role="status">Loading projects...</p>
                    )}

                    {!loading && projects.length === 0 && (
                        <p>
                            No published projects are available right now.
                        </p>
                    )}

                    <div className="projects-grid">
                        {projects.map((project) => (
                            <article
                                className="project-card"
                                key={project._id}
                            >
                                <div className="project-image">
                                    <img
                                        src={project.previewImage || nexus}
                                        alt={project.title}
                                        loading="lazy"
                                    />
                                </div>

                                <div className="project-content">
                                    <span>{project.category}</span>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>

                                    <div className="project-technologies">
                                        {(project.tech || []).map((tech) => (
                                            <span key={tech}>{tech}</span>
                                        ))}
                                    </div>

                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Project →
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {apiError && (
                <p className="container" role="status">
                    {apiError}
                </p>
            )}
        </main>
    );
};

export default Home;