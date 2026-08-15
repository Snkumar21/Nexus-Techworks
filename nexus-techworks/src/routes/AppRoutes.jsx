import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            
            <Route
                path="/about"
                element={<h1>About Nexus Technoworks</h1>}
            />

            <Route
                path="/services"
                element={<h1>Our Services</h1>}
            />

            <Route
                path="/projects"
                element={<h1>Our Projects</h1>}
            />

            <Route
                path="/clients"
                element={<h1>Our Clients</h1>}
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