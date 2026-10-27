
import { useEffect, useState } from "react";
import CurrencySelector from "../../components/CurrencySelector/CurrencySelector";
import "./Services.css";

/* ================================
   API CONFIGURATION
================================ */

const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
).replace(/\/$/, "");

/* ================================
   SERVICES COMPONENT
================================ */

const Services = () => {

    /* ================================
       STATES
    ================================ */

    const [page, setPage] = useState(null);
    const [services, setServices] = useState([]);

    const [currency, setCurrency] = useState("USD");
    const [rates, setRates] = useState({ USD: 1 });
    const [loadingRates, setLoadingRates] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ================================
       FETCH SERVICES FROM DATABASE
    ================================ */

    useEffect(() => {

        const controller = new AbortController();

        const fetchServices = async () => {

            setLoading(true);
            setError("");

            try {

                const response = await fetch(
                    `${API_URL}/api/services/page`,
                    {
                        method: "GET",
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Services API returned ${response.status}`
                    );
                }

                const data = await response.json();

                if (
                    !data ||
                    !Array.isArray(data.services)
                ) {
                    throw new Error(
                        "Invalid services API response"
                    );
                }

                if (!controller.signal.aborted) {

                    setPage(data.page ?? null);
                    setServices(data.services);

                }

            } catch (err) {

                if (!controller.signal.aborted) {
                    setError(
                        err.message ||
                        "Unable to fetch services."
                    );
                }

            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }
        };

        fetchServices();

        return () => controller.abort();

    }, []);

    /* ================================
       FETCH LIVE CURRENCY RATES
    ================================ */

    useEffect(() => {

        const controller = new AbortController();

        const fetchCurrencyRates = async () => {

            setLoadingRates(true);

            try {

                const response = await fetch(
                    "https://open.er-api.com/v6/latest/USD",
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Currency exchange API unavailable"
                    );
                }

                const data = await response.json();

                if (
                    data?.result !== "success" ||
                    !data?.rates
                ) {
                    throw new Error(
                        "Invalid currency exchange response"
                    );
                }

                if (!controller.signal.aborted) {
                    setRates({
                        ...data.rates,
                        USD: 1,
                    });
                }

            } catch (err) {

                if (err.name !== "AbortError") {
                    console.error(
                        "Currency API error:",
                        err
                    );
                }

            } finally {

                if (!controller.signal.aborted) {
                    setLoadingRates(false);
                }

            }
        };

        fetchCurrencyRates();

        return () => controller.abort();

    }, []);

    /* ================================
       FORMAT SERVICE PRICE
    ================================ */

    const formatPrice = (amount) => {

        const usdPrice = Number(amount);

        if (!Number.isFinite(usdPrice)) {
            return "Price unavailable";
        }

        if (currency !== "USD" && loadingRates) {
            return "Loading...";
        }

        const exchangeRate = rates[currency];

        if (
            typeof exchangeRate !== "number" ||
            !Number.isFinite(exchangeRate) ||
            exchangeRate <= 0
        ) {
            return "Rate unavailable";
        }

        const convertedPrice = usdPrice * exchangeRate;

        try {

            return new Intl.NumberFormat(
                undefined,
                {
                    style: "currency",
                    currency: currency,
                    maximumFractionDigits: 0,
                }
            ).format(convertedPrice);

        } catch {
            return "Price unavailable";
        }

    };

    /* ================================
       LOADING STATE
    ================================ */

    if (loading) {
        return (
            <main className="services-page">
                <div className="container services-feedback">
                    Loading services...
                </div>
            </main>
        );
    }

    /* ================================
       ERROR STATE
    ================================ */

    if (error) {
        return (
            <main className="services-page">
                <div
                    className="container services-feedback error"
                    role="alert"
                >
                    Services could not load: {error}
                </div>
            </main>
        );
    }

    /* ================================
       PAGE NOT CONFIGURED
    ================================ */

    if (!page) {
        return (
            <main className="services-page">
                <div className="container services-feedback">
                    Services page is not configured yet.
                </div>
            </main>
        );
    }

    /* ================================
       MAIN SERVICES PAGE
    ================================ */

    return (
        <main className="services-page">

            {/* =========================
                HERO SECTION
            ========================= */}

            <section className="services-hero">

                <div className="container services-hero-container">

                    <span className="section-label">
                        {page.heroLabel}
                    </span>

                    <h1>
                        {page.heroTitle}
                        <span> {page.heroAccent}</span>
                    </h1>

                    <p>
                        {page.heroDescription}
                    </p>

                </div>

            </section>

            {/* =========================
                SERVICES & PRICING
            ========================= */}

            <section className="services-pricing">

                <div className="container">

                    <div className="services-pricing-header">

                        <div>

                            <span className="section-label">
                                {page.pricingLabel}
                            </span>

                            <h2>
                                {page.pricingTitle}
                                <span> {page.pricingAccent}</span>
                            </h2>

                            <p>
                                {page.pricingDescription}
                            </p>

                        </div>

                        {/* CURRENCY SELECTOR */}

                        <CurrencySelector
                            currency={currency}
                            setCurrency={setCurrency}
                        />

                    </div>

                    {/* SERVICES LIST */}

                    <div className="services-list">

                        {services.length === 0 ? (

                            <p className="services-empty">
                                No services published yet.
                            </p>

                        ) : (

                            services.map((service, index) => (

                                <article
                                    className="service-card"
                                    key={service._id}
                                >

                                    {/* SERVICE NUMBER */}

                                    <div className="service-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    {/* SERVICE DETAILS */}

                                    <div className="service-content">

                                        <h3>
                                            {service.title}
                                        </h3>

                                        <p>
                                            {service.description}
                                        </p>

                                    </div>

                                    {/* SERVICE PRICE */}

                                    <div className="service-price">

                                        <span>
                                            {service.priceType === "monthly"
                                                ? "Starting / month"
                                                : "Starting from"}
                                        </span>

                                        <strong>
                                            {formatPrice(service.price)}
                                        </strong>

                                    </div>

                                    {/* SERVICE BUTTON */}

                                    <a
                                        href={page.serviceLink || "/contact"}
                                        className="service-link"
                                    >
                                        {page.serviceButtonText || "Get Started"}

                                        <span>→</span>
                                    </a>

                                </article>

                            ))

                        )}

                    </div>

                    {/* PRICING NOTE */}

                    <div className="pricing-note">
                        {page.pricingNote}
                    </div>

                </div>

            </section>

            {/* =========================
                HOW WE WORK
            ========================= */}

            <section className="services-process">

                <div className="container">

                    <div className="section-heading">

                        <div>

                            <span className="section-label">
                                {page.processLabel}
                            </span>

                            <h2>
                                {page.processTitle}
                                <span> {page.processAccent}</span>
                            </h2>

                        </div>

                        <p>
                            {page.processDescription}
                        </p>

                    </div>

                    {/* PROCESS STEPS */}

                    <div className="process-grid">

                        {(Array.isArray(page.processSteps)
                            ? page.processSteps
                            : []
                        ).map((step, index) => (

                            <div
                                className="process-card"
                                key={index}
                            >

                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3>
                                    {step.title}
                                </h3>

                                <p>
                                    {step.description}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* =========================
                CALL TO ACTION
            ========================= */}

            <section className="services-cta">

                <div className="container">

                    <span className="section-label">
                        {page.ctaLabel}
                    </span>

                    <h2>
                        {page.ctaTitle}
                        <span> {page.ctaAccent}</span>
                    </h2>

                    <p>
                        {page.ctaDescription}
                    </p>

                    <a
                        href={page.ctaLink || "/contact"}
                        className="services-cta-button"
                    >
                        {page.ctaButtonText}
                    </a>

                </div>

            </section>

        </main>
    );
};

export default Services;