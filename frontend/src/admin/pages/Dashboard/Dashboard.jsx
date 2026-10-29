import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const statCards = [
    {
        label: "Active Services",
        key: "services",
        icon: "fa-solid fa-layer-group",
        index: "01",
        status: "Active",
        statusClass: "positive",
    },
    {
        label: "Projects",
        key: "projects",
        icon: "fa-solid fa-diagram-project",
        index: "02",
        status: "Published",
    },
    {
        label: "New Enquiries",
        key: "enquiries",
        icon: "fa-regular fa-envelope",
        index: "03",
        status: "Needs attention",
        statusClass: "attention",
    },
    {
        label: "Marketplace",
        key: "marketplace",
        icon: "fa-solid fa-store",
        index: "04",
        status: "Listings",
        gold: true,
    },
];

const quickActions = [
    {
        label: "Add Service",
        icon: "fa-solid fa-plus",
        path: "/admin/services?new=1",
    },
    {
        label: "Add Project",
        icon: "fa-solid fa-folder-plus",
        path: "/admin/projects?new=1",
    },
    {
        label: "Add Listing",
        icon: "fa-solid fa-store",
        path: "/admin/marketplace?new=1",
    },
    {
        label: "Post Job",
        icon: "fa-solid fa-briefcase",
        path: "/admin/careers?new=1",
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [apiStatus, setApiStatus] = useState("Checking");
    const [error, setError] = useState("");

    /* LOAD DASHBOARD STATISTICS */
    useEffect(() => {
        const controller = new AbortController();

        const loadDashboardStats = async () => {
            try {
                const response = await fetch(`${API_URL}/api/admin/dashboard/stats`,
                    {
                        signal: controller.signal,
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Dashboard API returned ${response.status}`
                    );
                }

                const data = await response.json();

                if (
                    !response.ok ||
                    data?.success === false ||
                    !data?.counts ||
                    typeof data.counts !== "object"
                ) {
                    throw new Error(
                        data?.message || "Invalid dashboard API response"
                    );
                }

                setStats(data.counts);
                setApiStatus("Connected");
                setError("");
            } catch (err) {
                if (err.name !== "AbortError") {
                    setStats(null);
                    setApiStatus("Unavailable");
                    setError(
                        "Unable to load dashboard statistics. Please check the backend API and database connection."
                    );
                }
            }
        };

        loadDashboardStats();
        const interval = setInterval( loadDashboardStats, 60000 );
        return () => { controller.abort(); clearInterval(interval); };
    }, []);

    const displayCount = (key) => {
        const value = stats?.[key];
        return typeof value === "number" && Number.isFinite(value) ? value : "—";
    };

    return (
        <div className="admin-dashboard-content">

            {/* WELCOME SECTION */}
            <section className="admin-welcome">
                <div>
                    <span className="welcome-label"> ADMIN WORKSPACE </span>
                    <h2> Welcome back, <span> Administrator.</span> </h2>
                    <p>
                        Manage Nexus Techworks content, projects,
                        enquiries and business operations from one
                        centralized workspace.
                    </p>
                </div>
                <div className="welcome-mark" aria-hidden="true"> X </div>
            </section>
        
            {/* API ERROR */}
            {error && (
                <p role="alert" className="admin-data-error">
                    <i className="fa-solid fa-circle-exclamation" />
                    {" "}
                    {error}
                </p>
            )}

            {/* DASHBOARD STATISTICS */}
            <section className="admin-stats-grid">
                {statCards.map((card) => (
                    <article className="admin-stat-card" key={card.key} >
                        <div className="stat-card-top">
                        <div
                            className={`stat-icon ${
                            card.gold ? "gold" : ""
                            }`}
                        >
                            <i className={card.icon} />
                        </div>

                        <span
                            className={`stat-index ${
                            card.gold ? "gold-text" : ""
                            }`}
                        >
                            {card.index}
                        </span>
                        </div>

                        <span className="stat-label">
                        {card.label}
                        </span>

                        <div className="stat-value-row">
                            <strong>
                                {displayCount(card.key)}
                            </strong>

                            <span className={card.statusClass || ""}>
                                {card.status}
                            </span>
                        </div>
                    </article>
                ))}
            </section>

            {/* QUICK ACTIONS & SYSTEM */}
            <section className="dashboard-lower-grid">
            
                {/* QUICK ACTIONS */}
                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <span>MANAGEMENT</span>
                            <h3>Quick Actions</h3>
                        </div>
                    </div>

                    <div className="quick-actions-grid">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                onClick={() => navigate(action.path)}
                            >
                                <div> <i className={action.icon} /> </div>
                                <span>{action.label}</span>
                                <i className="fa-solid fa-arrow-right" />
                            </button>
                        ))}
                    </div>
                </article>

                {/* SYSTEM STATUS */}
                <article className="dashboard-panel system-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <span>PLATFORM</span>
                            <h3>System Status</h3>
                        </div>

                        <span className={`system-online ${ apiStatus === "Unavailable" ? "system-offline" : "" }`}>
                            <i />
                            {
                                apiStatus === "Connected"
                                ? "Operational"
                                : apiStatus
                            }
                        </span>
                    </div>

                    <div className="system-list">
                        <div>
                            <span>Website</span>
                            <strong>Not checked</strong>
                        </div>

                        <div>
                            <span>Backend API</span>
                            <strong>{apiStatus}</strong>
                        </div>

                        <div>
                            <span>Database</span>
                            <strong>
                                {apiStatus === "Connected"
                                ? "Not independently checked"
                                : "Unknown"}
                            </strong>
                        </div>

                        <div>
                            <span>Admin Access</span>
                            <strong>Session present</strong>
                        </div>
                    </div>
                </article>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="dashboard-panel recent-panel">
                <div className="dashboard-panel-header">
                    <div>
                        <span>ACTIVITY</span>
                        <h3>Recent Activity</h3>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/activity-logs")}
                    >
                        View All
                    </button>
                </div>

                <div className="activity-empty">
                    <div> <i className="fa-solid fa-clock-rotate-left" /> </div>
                    <h4>No recent activity available</h4>
                    <p>
                        Activity logs will appear here once the
                        backend activity tracking module is connected.
                    </p>
                </div>
            </section>

            {/* DASHBOARD FOOTER */}
            <footer className="admin-dashboard-footer">
                <p> © {new Date().getFullYear()} Nexus Techworks </p>
                <span>KEEP EVOLVING.</span>
            </footer>
        </div>
    );
};

export default Dashboard;