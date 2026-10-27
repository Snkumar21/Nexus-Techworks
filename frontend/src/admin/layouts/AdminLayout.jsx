
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminApi, setAdminCsrfToken, } from "../utils/adminApi";
import Logo from "../../assets/logo/nexus-logo-bg-removed.png";
import "../pages/Dashboard/Dashboard.css";

const workspaceItems = [
  { label: "Dashboard", icon: "fa-solid fa-table-cells-large", path: "/admin/dashboard" },
  { label: "About", icon: "fa-solid fa-building", path: "/admin/about" },
  { label: "Services", icon: "fa-solid fa-layer-group", path: "/admin/services" },
  { label: "Projects", icon: "fa-solid fa-diagram-project", path: "/admin/projects" },
  { label: "Careers", icon: "fa-solid fa-briefcase", path: "/admin/careers" },
  { label: "Applications", icon: "fa-regular fa-file-lines", path: "/admin/applications" },
  { label: "Enquiries", icon: "fa-regular fa-envelope", path: "/admin/enquiries" },
  { label: "Clients", icon: "fa-solid fa-users", path: "/admin/clients" },
  { label: "Marketplace", icon: "fa-solid fa-store", path: "/admin/marketplace" },
];

const managementItems = [
  { label: "Settings", icon: "fa-solid fa-gear", path: "/admin/settings" },
  { label: "Analytics", icon: "fa-solid fa-chart-line", path: "/admin/analytics" },
  { label: "Activity Logs", icon: "fa-solid fa-clock-rotate-left", path: "/admin/activity" },
];

const pageTitles = Object.fromEntries(
  [...workspaceItems, ...managementItems].map((item) => [
    item.path,
    item.label,
  ])
);

const getAdminUser = () => {
  try {
    const stored =
      sessionStorage.getItem("nexusAdminUser") ||
      localStorage.getItem("nexusAdminUser");

    return stored
      ? JSON.parse(stored)
      : {
          name: "Nexus Administrator",
          role: "Administrator",
        };
  } catch {
    return {
      name: "Nexus Administrator",
      role: "Administrator",
    };
  }
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser] = useState(getAdminUser);
  const [sidebarLogo, setSidebarLogo] = useState(Logo);
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || "Admin Workspace";

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  
useEffect(() => {
  let active = true;

  const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  const loadAdminBranding = async () => {
    try {
      console.log("Settings API:", `${API_BASE}/api/settings`);

      const data = await adminApi("/settings");

      console.log("Settings API response:", data);

      if (active && data?.settings?.logoUrl) {
        const logoUrl = data.settings.logoUrl.startsWith("http")
          ? data.settings.logoUrl
          : `${API_BASE}${data.settings.logoUrl}`;

        setSidebarLogo(`${logoUrl}${logoUrl.includes("?") ? "&" : "?"}v=${Date.now()}`);
      }
    } catch (error) {
      console.error("Admin settings fetch failed:", error);
    }
  };

  loadAdminBranding();

  return () => {
    active = false;
  };
}, []);

  const handleLogout = async () => {
    try {
        await adminApi("/admin/logout", {
            method: "POST",
        });

        setAdminCsrfToken(null);

        ["nexusAdminAuth", "nexusAdminUser"].forEach((key) => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        navigate("/admin/login", { replace: true });
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Unable to log out. Please try again.");
    }
  };

  const renderNavigation = (items) =>
    items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/admin/dashboard"}
        className={({ isActive }) =>
          `admin-nav-item ${isActive ? "active" : ""}`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <span className="admin-nav-icon">
          <i className={item.icon} />
        </span>

        <span className="admin-nav-text">
          {item.label}
        </span>
      </NavLink>
    ));

  return (
    <div className="nexus-admin">
      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-logo">
          <img src={sidebarLogo} alt="Nexus Techworks" />
          <span>CONTROL CENTER</span>
        </div>

        <div className="admin-sidebar-content">
          <span className="admin-menu-label">
            Workspace
          </span>

          <nav className="admin-navigation">
            {renderNavigation(workspaceItems)}
          </nav>

          <span className="admin-menu-label admin-management-label">
            Management
          </span>

          <nav className="admin-navigation">
            {renderNavigation(managementItems)}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">NT</div>

            <div>
              <strong>{adminUser.name}</strong>
              <span>{adminUser.role}</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* MAIN AREA */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <i className="fa-solid fa-bars" />
            </button>

            <div>
              <span className="admin-header-eyebrow">
                NEXUS TECHWORKS PANEL
              </span>
              <h1>{pageTitle}</h1>
            </div>
          </div>

          <div className="admin-header-actions">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="view-website-btn"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" />
              <span>View Website</span>
            </a>

            <div className="admin-header-user">
              <div className="header-avatar">NT</div>

              <div>
                <strong>{adminUser.name}</strong>
                <span>{adminUser.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* NESTED PAGE CONTENT */}
        <Outlet />
      </main>
    </div>
  );
}
