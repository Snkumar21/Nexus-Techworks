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