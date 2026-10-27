import { Navigate, Route, Routes } from "react-router-dom";

/* PUBLIC */
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import Projects from "../pages/Projects/Projects";
import Career from "../pages/Career/Career";
import CareerApply from "../pages/Career/CareerApply";
import Contact from "../pages/Contact/Contact";
import Clients from "../pages/Clients/Clients";

/* ADMIN PANEL */
import AdminLayout from "../admin/layouts/AdminLayout";
import Login from "../admin/pages/Login/Login";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import AboutManager from "../admin/pages/AboutManager/AboutManager";
import ServicesManager from "../admin/pages/ServicesManager/ServicesManager";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import ProjectsManager from "../admin/pages/Projects/ProjectsManager";
import CareersManager from "../admin/pages/Career/CareersManager";
import ApplicationsManager from "../admin/pages/Applications/ApplicationsManager";
import EnquiriesManager from "../admin/pages/Enquiries/EnquiriesManager";
import ClientsManager from "../admin/pages/Clients/ClientsManager";
import Settings from "../admin/pages/Settings/Settings";

/* APP ROUTES */
const AppRoutes = () => {
    return (
        <Routes>
        
        {/* PUBLIC */}
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/founder" element={<Navigate to="/about#founder" replace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/career" element={<Career />} />
            <Route path="/career/apply" element={<CareerApply />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* PROTECTED ADMIN PANEL */}
        <Route path="/admin" element=
            {
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
            {/* DEFAULT ADMIN ROUTE */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* DASHBOARD */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* ABOUT PAGE */}
            <Route path="about" element={<AboutManager />} />

            {/* SERVICE PAGE */}
            <Route path="services" element={<ServicesManager />} />

            {/* PROJECTS PAGE */}
            <Route path="projects" element={<ProjectsManager />} />

            {/* CAREERS MANAGEMENT */}
            <Route path="careers" element={<CareersManager />} />

            {/* JOB APPLICATIONS */}
            <Route path="applications" element={<ApplicationsManager />} />

            {/* ENQUIRY MANAGEMENT */}
            <Route path="enquiries" element={<EnquiriesManager />} />

            {/* CLIENT MANAGEMENT */}
            <Route path="clients" element={<ClientsManager />} />

            {/* UNKNOWN ADMIN MODULE */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />

            {/* ADMIN SETTINGS */}
            <Route path="settings" element={<Settings />} />
        </Route>

        {/* WEBSITE FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />}/> </Routes>
    );
};

export default AppRoutes;