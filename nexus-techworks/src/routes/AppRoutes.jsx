import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import Projects from "../pages/Projects/Projects";
import Career from "../pages/Career/Career";
import CareerApply from "../pages/Career/CareerApply";
import Founder from "../pages/Founder/Founder";
import Contact from "../pages/Contact/Contact";
import Clients from "../pages/Clients/Clients";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/career" element={<Career/>} />
            <Route path="/career/apply" element={<CareerApply />} />
            <Route path="/founder" element={<Founder/>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
        </Routes>
    );
};
export default AppRoutes;