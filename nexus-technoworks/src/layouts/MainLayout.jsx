import Navbar from "../components/Navbar/Navbar";
import AppRoutes from "../routes/AppRoutes";

const MainLayout = () => {
    return (
        <>
            <Navbar />

            <AppRoutes />
        </>
    );
};

export default MainLayout;