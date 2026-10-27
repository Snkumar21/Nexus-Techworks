import { Link, useParams } from "react-router-dom";

const titles = {
  services: "Services", projects: "Projects", marketplace: "Marketplace",
  enquiries: "Enquiries", careers: "Careers", applications: "Applications",
  clients: "Clients", analytics: "Analytics", "activity-logs": "Activity Logs",
  settings: "Settings",
};

export default function Module() {
  const { module } = useParams();
  return (
    <main style={{ minHeight: "100vh", padding: "45px", background: "#f5f5f6" }}>
      <Link to="/admin/dashboard" style={{ color: "#e31b23" }}>← Back to Dashboard</Link>
      <h1 style={{ marginTop: 25 }}>{titles[module] || "Admin Module"}</h1>
      <p>This section is routed. CRUD and database operations are not implemented yet.</p>
    </main>
  );
}
