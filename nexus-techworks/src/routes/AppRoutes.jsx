import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import Projects from "../pages/Projects/Projects";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/about" element={<About />} />

            <Route path="/services" element={<Services />} />

            <Route path="/projects" element={<Projects />} />

            <Route
                path="/career"
                element={<h1>Career</h1>}
            />

            <Route
                path="/founder"
                element={<h1>Founder</h1>}
            />

            <Route
                path="/contact"
                element={<h1>Contact Nexus Technoworks</h1>}
            />

        </Routes>
    );
};

export default AppRoutes;