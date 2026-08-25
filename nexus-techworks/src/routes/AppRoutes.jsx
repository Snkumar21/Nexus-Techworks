import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import Projects from "../pages/Projects/Projects";
import Career from "../pages/Career/Career";
import CareerApply from "../pages/Career/CareerApply";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/about" element={<About />} />

            <Route path="/services" element={<Services />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/career" element={<Career/>} />

            <Route path="/career/apply" element={<CareerApply />} />

            <Route
                path="/contact"
                element={<h1>Contact Nexus Technoworks</h1>}
            />

        </Routes>
    );
};

export default AppRoutes;