import { Link } from "react-router-dom";
import "./AdminPlaceholder.css";

const AdminPlaceholder = () => (
  <main className="admin-placeholder">
    <section className="admin-placeholder-card">
      <span className="admin-placeholder-badge">NEXUS TECHWORKS</span>
      <h1>Admin Panel</h1>
      <p>
        The admin workspace has been merged into the main frontend structure.
        Authentication and dashboard modules can now be built here without a
        second Vite application.
      </p>
      <div className="admin-placeholder-path">src/admin/</div>
      <Link to="/" className="admin-placeholder-link">Back to website</Link>
    </section>
  </main>
);

export default AdminPlaceholder;
