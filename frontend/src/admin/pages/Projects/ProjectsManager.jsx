import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./ProjectsManager.css";

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  tech: "",
  status: "Developed",
  link: "",
  previewImage: "",
  featured: false,
  published: false,
  sortOrder: 0,
};

const fromProject = (project) => ({
  title: project.title || "",
  category: project.category || "",
  description: project.description || "",
  tech: Array.isArray(project.tech) ? project.tech.join(", ") : "",
  status: project.status || "Developed",
  link: project.link || "",
  previewImage: project.previewImage || "",
  featured: Boolean(project.featured),
  published: Boolean(project.published),
  sortOrder: Number.isInteger(project.sortOrder) ? project.sortOrder : 0,
});

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi("/projects/admin");
      setProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : name === "sortOrder" ? value : value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setNotice("");
  };

  const handleEdit = (project) => {
    setForm(fromProject(project));
    setEditingId(project._id);
    setError("");
    setNotice("");
    document.querySelector(".projects-manager-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      tech: form.tech.split(",").map((item) => item.trim()).filter(Boolean),
      status: form.status.trim(),
      link: form.link.trim(),
      previewImage: form.previewImage.trim(),
      featured: form.featured,
      published: form.published,
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId) {
        await adminApi(`/projects/admin/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setNotice("Project updated successfully.");
      } else {
        await adminApi("/projects/admin", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setNotice("Project created successfully.");
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Delete “${project.title}”? This cannot be undone.`);
    if (!confirmed) return;

    setError("");
    setNotice("");
    try {
      await adminApi(`/projects/admin/${project._id}`, { method: "DELETE" });
      if (editingId === project._id) resetForm();
      setNotice("Project deleted successfully.");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to delete project.");
    }
  };

  return (
    <section className="projects-manager">
      <div className="projects-manager-heading">
        <div>
          <span className="projects-manager-eyebrow">CONTENT MANAGEMENT</span>
          <h2>Projects Manager</h2>
          <p>Manage portfolio projects, featured work and public visibility.</p>
        </div>
        <button type="button" className="pm-button pm-button-secondary" onClick={loadProjects} disabled={loading}>
          <i className="fa-solid fa-rotate" /> Refresh
        </button>
      </div>

      {error && <div className="pm-alert pm-alert-error" role="alert">{error}</div>}
      {notice && <div className="pm-alert pm-alert-success" role="status">{notice}</div>}

      <div className="pm-layout">
        <form className="projects-manager-form" onSubmit={handleSubmit}>
          <div className="pm-section-heading">
            <div>
              <span>{editingId ? "EDIT PROJECT" : "NEW ENTRY"}</span>
              <h3>{editingId ? "Update project" : "Add a project"}</h3>
            </div>
            {editingId && <button type="button" className="pm-text-button" onClick={resetForm}>Cancel edit</button>}
          </div>

          <label className="pm-field">
            <span>Project title *</span>
            <input name="title" value={form.title} onChange={handleChange} required maxLength={160} placeholder="e.g. Nexus Arena" />
          </label>

          <div className="pm-fields-two">
            <label className="pm-field">
              <span>Category *</span>
              <input name="category" value={form.category} onChange={handleChange} required maxLength={100} placeholder="e.g. Education Platform" />
            </label>
            <label className="pm-field">
              <span>Status *</span>
              <input name="status" value={form.status} onChange={handleChange} required maxLength={50} placeholder="Live / Delivered / Developed" />
            </label>
          </div>

          <label className="pm-field">
            <span>Description *</span>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} maxLength={2000} placeholder="Describe the project..." />
          </label>

          <label className="pm-field">
            <span>Technologies *</span>
            <input name="tech" value={form.tech} onChange={handleChange} placeholder="React.js, Node.js, MongoDB" required />
            <small>Separate technologies with commas.</small>
          </label>

          <label className="pm-field">
            <span>Project URL</span>
            <input name="link" type="url" value={form.link} onChange={handleChange} placeholder="https://example.com" />
          </label>
          
          <div className="form-group">
            <label htmlFor="previewImage">Project Preview Image URL</label>
            <input id="previewImage" name="previewImage" type="url" placeholder="https://res.cloudinary.com/..." value={form.previewImage} onChange={(e) => setForm((prev) => ({ ...prev, previewImage: e.target.value, })) }/>
            {form.previewImage && (
              <div className="project-image-preview">
                <img src={form.previewImage} alt="Project preview" onError={(e) => { e.currentTarget.style.display = "none"; }} onLoad={(e) => { e.currentTarget.style.display = "block"; }} />
              </div>
            )}
          </div>

          <label className="pm-field pm-sort-field">
            <span>Display order</span>
            <input name="sortOrder" type="number" min="0" step="1" value={form.sortOrder} onChange={handleChange} required />
            <small>Lower numbers appear first.</small>
          </label>

          <div className="pm-toggle-row">
            <label><input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} /> <span><strong>Featured project</strong><small>Show in the featured section.</small></span></label>
            <label><input name="published" type="checkbox" checked={form.published} onChange={handleChange} /> <span><strong>Published</strong><small>Visible on the public website.</small></span></label>
          </div>

          <div className="pm-form-actions">
            <button type="submit" className="pm-button pm-button-primary" disabled={saving || loading}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create project"}
            </button>
            <button type="button" className="pm-button pm-button-secondary" onClick={resetForm} disabled={saving}>Clear form</button>
          </div>
        </form>

        <div className="projects-manager-list-panel">
          <div className="pm-list-heading">
            <div><span>DATABASE RECORDS</span><h3>All projects</h3></div>
            <strong>{projects.length}</strong>
          </div>

          {loading ? (
            <div className="pm-empty-state"><i className="fa-solid fa-spinner fa-spin" /> Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="pm-empty-state">No projects found. Add your first project using the form.</div>
          ) : (
            <div className="pm-project-list">
              {projects.map((project, index) => (
                <article className="pm-project-item" key={project._id}>
                  <div className="pm-project-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="pm-project-details">
                    <h4>{project.title}</h4>
                    <p>{project.category} · {project.status}</p>
                    <div className="pm-project-badges">
                      <span className={project.published ? "is-published" : "is-draft"}>{project.published ? "Published" : "Draft"}</span>
                      {project.featured && <span className="is-featured">Featured</span>}
                    </div>
                  </div>
                  <div className="pm-project-actions">
                    <button type="button" onClick={() => handleEdit(project)} aria-label={`Edit ${project.title}`} title="Edit"><i className="fa-solid fa-pen" /></button>
                    <button type="button" className="pm-delete-button" onClick={() => handleDelete(project)} aria-label={`Delete ${project.title}`} title="Delete"><i className="fa-solid fa-trash" /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}