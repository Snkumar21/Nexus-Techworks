import { useEffect, useState } from "react";

import CurrencySelector from "../../components/CurrencySelector/CurrencySelector";

import "./Services.css";

const services = [
    {
        id: "01",
        title: "Software Development",
        description:
            "Custom software solutions designed around your business requirements, workflows and goals.",
        price: 49,
        priceType: "starting",
    },

    {
        id: "02",
        title: "Web Development",
        description:
            "Modern, responsive and scalable websites and web applications built for a strong digital presence.",
        price: 29,
        priceType: "starting",
    },

    {
        id: "03",
        title: "Content Creation",
        description:
            "Creative content including social media creatives, reels, videos and digital content for your brand.",
        price: 9,
        priceType: "starting",
    },

    {
        id: "04",
        title: "Digital Marketing",
        description:
            "Digital marketing strategies designed to improve your online presence, reach and engagement.",
        price: 19,
        priceType: "monthly",
    },

    {
        id: "05",
        title: "Branding & Design",
        description:
            "Visual identities, social media designs and creative assets that make your brand recognizable.",
        price: 49,
        priceType: "starting",
    },

    {
        id: "06",
        title: "Business Solutions",
        description:
            "Technology-driven solutions that help businesses improve processes, productivity and digital operations.",
        price: 29,
        priceType: "starting",
    },
];

const Services = () => {
    const [currency, setCurrency] = useState("USD");
    const [rates, setRates] = useState({
        USD: 1,
    });
    const [loadingRates, setLoadingRates] = useState(true);

    /* FETCH LIVE CURRENCY RATES */
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(
                    "https://open.er-api.com/v6/latest/USD"
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch currency rates");
                }

                const data = await response.json();

                if (data?.rates) {
                    setRates(data.rates);
                }
            } catch (error) {
                console.error(
                    "Currency API error:",
                    error
                );

                /* USD fallback */
                setRates({
                    USD: 1,
                });
            } finally {
                setLoadingRates(false);
            }
        };
        fetchRates();
    }, []);

    /* ========================================
        FORMAT PRICE
    ======================================== */
    const formatPrice = (usdPrice) => {
        const rate = rates[currency] || 1;
        const convertedPrice = usdPrice * rate;
        return new Intl.NumberFormat(
            undefined,
            {
                style: "currency",
                currency: currency,
                maximumFractionDigits: 0,
            }
        ).format(convertedPrice);
    };

    return (
        <main className="services-page">

            <section className="services-hero">
                <div className="container services-hero-container">
                    <span className="section-label">
                        OUR SERVICES
                    </span>

                    <h1>
                        Solutions built
                        <span> to evolve.</span>
                    </h1>

                    <p>
                        From software and websites to digital marketing,
                        content and business solutions — we help turn
                        ideas into meaningful digital experiences.
                    </p>
                </div>
            </section>

            <section className="services-pricing">
                <div className="container">
                    <div className="services-pricing-header">
                        <div>
                            <span className="section-label">
                                SERVICES & PRICING
                            </span>

                            <h2>
                                Choose what
                                <span> you need.</span>
                            </h2>

                            <p>
                                Explore our core services and get an
                                estimated starting price in your preferred
                                currency.
                            </p>
                        </div>

                        {/* Currency */}
                        <CurrencySelector
                            currency={currency}
                            setCurrency={setCurrency}
                        />
                    </div>

                    <div className="services-list">
                        {services.map((service) => (
                            <article
                                className="service-card"
                                key={service.id}
                            >
                                <div className="service-number">
                                    {service.id}
                                </div>

                                <div className="service-content">
                                    <h3>
                                        {service.title}
                                    </h3>

                                    <p>
                                        {service.description}
                                    </p>
                                </div>

                                <div className="service-price">
                                    <span>
                                        {service.priceType === "monthly"
                                            ? "Starting / month"
                                            : "Starting from"
                                        }
                                    </span>

                                    <strong>
                                        {loadingRates
                                            ? "..."
                                            : formatPrice(service.price)
                                        }
                                    </strong>
                                </div>

                                <a
                                    href="/contact"
                                    className="service-link"
                                >
                                    Get Started
                                    <span>→</span>
                                </a>
                            </article>
                        ))}
                    </div>

                    <div className="pricing-note">
                        <span>
                            * Pricing shown is an estimated starting price.
                            Final pricing depends on project scope,
                            requirements, features, timeline and complexity.
                        </span>
                    </div>
                </div>
            </section>

            <section className="services-process">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                HOW WE WORK
                            </span>

                            <h2>
                                From concept
                                <span> to creation.</span>
                            </h2>
                        </div>
                        <p>
                            We follow a straightforward process to keep
                            projects focused, transparent and effective.
                        </p>
                    </div>

                    <div className="process-grid">
                        <div className="process-card">
                            <span>01</span>

                            <h3>
                                Understand
                            </h3>

                            <p>
                                We understand your goals, requirements
                                and business challenges.
                            </p>
                        </div>

                        <div className="process-card">
                            <span>02</span>

                            <h3>
                                Plan
                            </h3>

                            <p>
                                We define the right strategy, technology
                                and execution plan.
                            </p>
                        </div>

                        <div className="process-card">
                            <span>03</span>

                            <h3>
                                Build
                            </h3>

                            <p>
                                We transform the plan into a functional,
                                creative and reliable solution.
                            </p>
                        </div>

                        <div className="process-card">
                            <span>04</span>

                            <h3>
                                Evolve
                            </h3>

                            <p>
                                We improve, support and evolve the solution
                                as your needs grow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="services-cta">
                <div className="container">
                    <span className="section-label">
                        HAVE A PROJECT?
                    </span>

                    <h2>
                        Let's build something
                        <span> meaningful.</span>
                    </h2>

                    <p>
                        Tell us what you have in mind and let's explore
                        how Nexus Techworks can help.
                    </p>

                    <a
                        href="/contact"
                        className="services-cta-button"
                    >
                        Let's Talk
                    </a>
                </div>
            </section>
        </main>
    );
};
export default Services;