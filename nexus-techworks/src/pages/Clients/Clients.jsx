import "./Clients.css";

const Clients = () => {
    const clients = [
        {
            name: "Dice Technosoft",
            category: "Technology & Digital Solutions",
            description:
                "Branding, digital creatives, marketing support and business-focused digital solutions.",
        },
        {
            name: "Prathamesh Builders & Developers",
            category: "Real Estate",
            description:
                "Modern website experience and digital presence designed for a trusted real estate brand.",
        },
        {
            name: "GeoSnap Pro",
            category: "Mobile Application",
            description:
                "App valuation, documentation and strategic acquisition support.",
        },
    ];

    return (
        <main className="clients-page">
            {/* HERO */}
            <section className="clients-hero">
                <div className="container">
                    <span className="section-label">
                        OUR CLIENTS
                    </span>

                    <h1>
                        Partnerships Built On
                        <span> Trust & Results.</span>
                    </h1>

                    <p>
                        We work with businesses, startups and growing brands
                        to build meaningful technology, digital and business
                        solutions that create long-term value.
                    </p>
                </div>
            </section>

            {/* CLIENTS GRID */}
            <section className="clients-section">
                <div className="container">
                    <div className="clients-heading">
                        <div>
                            <span className="section-label">
                                CLIENT PARTNERSHIPS
                            </span>

                            <h2>
                                Businesses We've
                                <span> Worked With.</span>
                            </h2>
                        </div>

                        <p>
                            Every collaboration begins with understanding
                            the idea, identifying the challenge and building
                            the right solution.
                        </p>
                    </div>

                    <div className="clients-grid">
                        {clients.map((client, index) => (
                            <article
                                className="client-card"
                                key={client.name}
                            >
                                <span className="client-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="client-category">
                                    {client.category}
                                </span>

                                <h3>{client.name}</h3>

                                <p>
                                    {client.description}
                                </p>

                                <div className="client-card-line" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="clients-philosophy">
                <div className="container philosophy-container">
                    <div>
                        <span className="section-label">
                            HOW WE WORK
                        </span>

                        <h2>
                            More Than Clients.
                            <span> Long-Term Partners.</span>
                        </h2>
                    </div>

                    <p>
                        At Nexus Techworks, our goal is not only to deliver
                        projects. We focus on building partnerships where
                        technology, creativity and strategy work together
                        to support continuous business growth.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="clients-cta">
                <div className="container clients-cta-container">
                    <span className="section-label">
                        LET'S WORK TOGETHER
                    </span>

                    <h2>
                        Your Business Could Be
                        <span> Our Next Success Story.</span>
                    </h2>

                    <p>
                        Have an idea, project or business challenge?
                        Let's build something meaningful together.
                    </p>

                    <a href="/contact" className="btn-primary">
                        Start a Conversation →
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Clients;