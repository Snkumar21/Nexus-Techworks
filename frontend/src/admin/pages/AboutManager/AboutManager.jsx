import { useEffect, useState } from "react";
import { DEFAULT_ABOUT_CONTENT } from "../../../data/aboutContent";
import { adminApi } from "../../utils/adminApi";
import "./AboutManager.css";

const sections = [
  {
    title: "Hero Section",
    subtitle: "Main introduction displayed at the top of the About page.",
    icon: "fa-solid fa-house",
    fields: [
      ["heroTitle", "Main Heading"],
      ["heroAccent", "Highlighted Heading"],
      ["heroDescription", "Hero Description"],
    ],
  },
  {
    title: "Company Information",
    subtitle: "Introduce Nexus Techworks and its purpose.",
    icon: "fa-solid fa-building",
    fields: [
      ["introLead", "Who We Are"],
      ["vision", "Company Vision"],
      ["mission", "Company Mission"],
    ],
  },
  {
    title: "Founder Information",
    subtitle: "Manage the founder's introduction and message.",
    icon: "fa-solid fa-user-tie",
    fields: [
      ["founderBio", "Founder Biography"],
      ["founderMessage", "Founder Message"],
    ],
  },
];

export default function AboutManager() {
  const [form, setForm] = useState({ ...DEFAULT_ABOUT_CONTENT });
  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const data = await adminApi("/about/admin/page");

        if (!cancelled) {
          setForm({
            ...DEFAULT_ABOUT_CONTENT,
            ...(data.page || {}),
          });

          setHasChanges(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError( err.message || "About content could not able to load. Please login again and retry." );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadContent();
    return () => { cancelled = true; };
  }, []);

  // Update a field in the form.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setHasChanges(true);
    setMessage("");
    setError("");
  };

  // Save all About fields to MongoDB.
  const handleSave = async (event) => {
    event?.preventDefault?.();

    if (loading || saving) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await adminApi("/about/admin/page", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      setForm({
        ...DEFAULT_ABOUT_CONTENT,
        ...(data.page || form),
      });

      setHasChanges(false);
      setMessage(
        data.message || "About page saved successfully."
      );
    } catch (err) {
      setError(
        err.message || "About page could not able to save."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (loading || saving) return;

    const confirmed = window.confirm(
      "Reset all About page fields to their default values? Click Save Changes afterward to publish these defaults."
    );

    if (!confirmed) return;

    setForm({ ...DEFAULT_ABOUT_CONTENT });
    setHasChanges(true);
    setMessage(
      "Default content loaded. Click Save Changes to publish it."
    );
    setError("");
  };

  const currentSection = sections[activeSection];

  return (
    <div className="about-manager">
      {/* PAGE HEADER */}
      <div className="about-manager-heading">
        <div>
          <span className="about-manager-eyebrow">
            CONTENT MANAGEMENT / ABOUT
          </span>

          <h1>About Page</h1>

          <p>
            Manage company information, vision, mission
            and founder content from your admin workspace.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="about-manager-preview"
        >
          <i className="fa-solid fa-arrow-up-right-from-square" />
          <span>Preview Website</span>
        </a>
      </div>

      {/* SUMMARY */}
      <div className="about-manager-overview">
        <div className="about-overview-card">
          <div className="about-overview-icon">
            <i className="fa-solid fa-layer-group" />
          </div>

          <div>
            <span>Content Sections</span>
            <strong>{sections.length}</strong>
          </div>
        </div>

        <div className="about-overview-card">
          <div className="about-overview-icon">
            <i className="fa-solid fa-pen-to-square" />
          </div>

          <div>
            <span>Editable Fields</span>
            <strong>
              {sections.reduce(
                (total, section) =>
                  total + section.fields.length,
                0
              )}
            </strong>
          </div>
        </div>

        <div className="about-overview-card">
          <div className="about-overview-icon">
            <i className="fa-solid fa-circle-check" />
          </div>

          <div>
            <span>Editing Status</span>
            <strong className="about-status-text">
              {loading
                ? "Loading..."
                : hasChanges
                  ? "Unsaved"
                  : "No Changes"}
            </strong>
          </div>
        </div>
      </div>

      {/* API STATUS MESSAGES */}
      {loading && (
        <p role="status" className="about-manager-message">
          Loading About content...
        </p>
      )}

      {message && (
        <p role="status" className="about-manager-message">
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="about-manager-message error"
        >
          {error}
        </p>
      )}

      {/* EDITOR */}
      <div className="about-manager-workspace">
        {/* SECTION NAVIGATION */}
        <aside className="about-manager-sidebar">
          <div className="about-sidebar-heading">
            <span>PAGE STRUCTURE</span>
            <h3>Content Sections</h3>
          </div>

          <div className="about-section-navigation">
            {sections.map((section, index) => (
              <button
                key={section.title}
                type="button"
                className={`about-section-nav ${
                  activeSection === index ? "active" : ""
                }`}
                onClick={() => setActiveSection(index)}
                disabled={loading || saving}
              >
                <i className={section.icon} />

                <span>{section.title}</span>

                <i className="fa-solid fa-chevron-right" />
              </button>
            ))}
          </div>

          <div className="about-sidebar-note">
            <i className="fa-solid fa-circle-info" />

            <p>
              About page content is saved to the database
              and displayed on the public website after saving.
            </p>
          </div>
        </aside>

        {/* FORM */}
        <form
          id="about-manager-form"
          className="about-manager-form"
          onSubmit={handleSave}
        >
          <div className="about-editor-header">
            <div className="about-editor-icon">
              <i className={currentSection.icon} />
            </div>

            <div>
              <span>CONTENT EDITOR</span>
              <h2>{currentSection.title}</h2>
              <p>{currentSection.subtitle}</p>
            </div>
          </div>

          <div className="about-editor-fields">
            {currentSection.fields.map(([key, label]) => (
              <div className="about-field" key={key}>
                <label htmlFor={`about-${key}`}>
                  {label}
                </label>

                <textarea
                  id={`about-${key}`}
                  name={key}
                  rows={
                    key === "heroTitle" ||
                    key === "heroAccent"
                      ? 2
                      : 5
                  }
                  value={form[key] ?? ""}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  disabled={loading || saving}
                  required
                />
              </div>
            ))}
          </div>

          <div className="about-editor-footer">
            <button
              type="button"
              className="about-reset-btn"
              onClick={handleReset}
              disabled={loading || saving}
            >
              <i className="fa-solid fa-rotate-left" />
              Reset Defaults
            </button>

            <button
              type="submit"
              className="about-save-btn"
              disabled={loading || saving || !hasChanges}
            >
              <i className="fa-solid fa-floppy-disk" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="about-manager-bottom">
        <span>
          © {new Date().getFullYear()} Nexus Techworks
        </span>

        <strong>KEEP EVOLVING.</strong>
      </div>
    </div>
  );
}