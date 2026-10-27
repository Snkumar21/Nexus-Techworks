const requireAdmin = (req, res, next) => {
    try {
        // Verify server-side authenticated session
        const user = req.session?.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Admin login required.",
            });
        }

        // Verify administrator role
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        // Authorized administrator
        next();
    } catch (error) {
        console.error(
            "Admin authentication error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Authentication verification failed.",
        });
    }
};

export default requireAdmin;