import "./Home.css";

const Home = () => {
    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <span className="hero-label">
                            NEXUS TECHWORKS
                        </span>
                        <h1>
                            Technology.
                            <br />
                            <span>Digital.</span>
                            <br />
                            Business.
                        </h1>
                        <p>
                            We build innovative technology and digital solutions
                            that help businesses turn ideas into meaningful
                            digital experiences.
                        </p>
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
                        <div className="hero-card">
                            <span>01</span>
                            <h3>Build</h3>
                            <p>Turning ideas into technology.</p>
                        </div>
                        <div className="hero-card">
                            <span>02</span>
                            <h3>Create</h3>
                            <p>Creating meaningful digital experiences.</p>
                        </div>

                        <div className="hero-card">
                            <span>03</span>
                            <h3>Grow</h3>
                            <p>Helping businesses move forward.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="intro-section">
                <div className="container">
                    <span className="section-label">
                        WHO WE ARE
                    </span>
                    <h2>
                        Your Technology & Digital
                        <span> Growth Partner.</span>
                    </h2>
                    <p>
                        Nexus Technoworks is a technology and digital solutions
                        company focused on helping businesses build, improve
                        and grow their digital presence.
                    </p>
                </div>
            </section>

            {/* Services Preview */}
            <section className="services-preview" id="services">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                WHAT WE DO
                            </span>
                            <h2>
                                Solutions Built
                                <br />
                                For Your Business.
                            </h2>
                        </div>
                        <p>
                            From software development to digital marketing,
                            we bring technology and creativity together.
                        </p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card">
                            <span>01</span>
                            <h3>Software Development</h3>
                            <p>
                                Custom software solutions designed around
                                your business requirements.
                            </p>
                        </div>
                        <div className="service-card">
                            <span>02</span>
                            <h3>Web Development</h3>
                            <p>
                                Modern, responsive and scalable websites
                                built for your digital presence.
                            </p>
                        </div>
                        <div className="service-card">
                            <span>03</span>
                            <h3>Content Creation</h3>
                            <p>
                                Creative content that helps your brand
                                communicate and connect.
                            </p>
                        </div>
                        <div className="service-card">
                            <span>04</span>
                            <h3>Digital Marketing</h3>
                            <p>
                                Digital strategies designed to improve
                                visibility and business growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Software & App Marketplace */}
            <section className="software-marketplace">
                <div className="container marketplace-container">

                    <div className="marketplace-content">
                        <span className="section-label">
                            SOFTWARE & APP MARKETPLACE
                        </span>

                        <h2>
                            Have a Software or App to
                            <span> Buy or Sell?</span>
                        </h2>

                        <p>
                            Whether you're looking to sell an existing software product,
                            mobile application or digital solution — or searching for the
                            right product to acquire for your business — Nexus Techworks
                            can help you connect with the right opportunities.
                        </p>

                        <div className="marketplace-features">
                            <div className="marketplace-feature">
                                <span>01</span>
                                <div>
                                    <h4>Sell Your Product</h4>
                                    <p>
                                        Looking to sell your software, SaaS platform,
                                        website or mobile application? Connect with us
                                        to discuss the opportunity.
                                    </p>
                                </div>
                            </div>

                            <div className="marketplace-feature">
                                <span>02</span>
                                <div>
                                    <h4>Purchase Software & Apps</h4>
                                    <p>
                                        Looking for an existing digital product or
                                        software solution? Tell us your requirements
                                        and we'll explore suitable opportunities.
                                    </p>
                                </div>
                            </div>

                            <div className="marketplace-feature">
                                <span>03</span>
                                <div>
                                    <h4>Valuation & Documentation</h4>
                                    <p>
                                        Get professional product valuation,
                                        business documentation and supporting
                                        materials for software transactions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a href="/contact" className="btn-primary marketplace-btn">
                            Discuss Your Requirement →
                        </a>
                    </div>

                    <div className="marketplace-visual">

                        <div className="marketplace-card sell-card">
                            <span className="marketplace-card-label">SELL</span>
                            <h3>Have a Digital Product?</h3>
                            <p>Software • SaaS • Web Apps • Mobile Apps</p>
                        </div>

                        <div className="marketplace-divider">
                            <span>↔</span>
                        </div>

                        <div className="marketplace-card buy-card">
                            <span className="marketplace-card-label">BUY</span>
                            <h3>Looking to Acquire?</h3>
                            <p>Discover opportunities that match your requirements.</p>
                        </div>

                    </div>

                </div>
            </section>

            {/* Projects Preview */}
            <section className="projects-preview" id="projects">
                <div className="container">
                    <span className="section-label">
                        OUR WORK
                    </span>
                    <h2>
                        Ideas We've
                        <span> Turned Into Reality.</span>
                    </h2>
                    <p>
                        Explore selected projects built with technology,
                        creativity and purpose.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Home;