import { useEffect, useState } from "react";
import "./Clients.css";

const API_URL = (  import.meta.env.VITE_API_URL || "http://localhost:5000" ).replace(/\/$/, "");

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadClients = async () => {
            try {
                const response = await fetch(`${API_URL}/api/clients`, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Unable to load clients.");
                }

                const data = await response.json();
                setClients(data.clients || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError("Clients could not be loaded right now.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadClients();

        return () => controller.abort();
    }, []);

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
                        {loading && <p>Loading clients...</p>}

                        {!loading && error && <p>{error}</p>}

                        {!loading && !error && clients.length === 0 && (
                            <p>Our client partnerships will be showcased here soon.</p>
                        )}

                        {!loading && !error && clients.map((client, index) => (
                            <article className="client-card" key={client._id || client.name}>
                                <span className="client-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="client-category">
                                    {client.service}
                                </span>

                                {client.logo && (
                                    <img
                                        src={client.logo}
                                        alt={`${client.name} logo`}
                                        loading="lazy"
                                        className="client-logo"
                                    />
                                )}

                                <h3>{client.name}</h3>

                                {client.website && (
                                    <a
                                        href={client.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit Website ↗
                                    </a>
                                )}

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