
import { useEffect, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./Settings.css";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const initialSettings = {
  company: {
    name: "Nexus Techworks",
    tagline: "KEEP EVOLVING",
    email: "",
    phone: "",
    address: "",
    website: "",
  },
  admin: {
    name: "Nexus Administrator",
    designation: "Administrator",
    email: "",
    phone: "",
  },
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
    github: "",
  },
  preferences: {
    maintenanceMode: false,
    showSocialLinks: true,
  },
  logoUrl: "",
};

const sections = [
  {
    id: "company",
    title: "Company Details",
    description: "Manage your public business information.",
    fields: [
      ["name", "Company Name"],
      ["tagline", "Tagline"],
      ["email", "Contact Email", "email"],
      ["phone", "Contact Phone", "tel"],
      ["website", "Website URL", "url"],
      ["address", "Office Address", "textarea"],
    ],
  },
  {
    id: "admin",
    title: "Personal Details",
    description: "Manage the administrator profile shown in the panel.",
    fields: [
      ["name", "Full Name"],
      ["designation", "Designation"],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
    ],
  },
  {
    id: "social",
    title: "Social Links",
    description: "Add links to your official social profiles.",
    fields: [
      ["linkedin", "LinkedIn URL", "url"],
      ["instagram", "Instagram URL", "url"],
      ["facebook", "Facebook URL", "url"],
      ["youtube", "YouTube URL", "url"],
      ["github", "GitHub URL", "url"],
    ],
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    adminApi("/settings")
      .then((data) => {
        if (!active) return;

        const saved = data.settings || {};

        setSettings((previous) => ({
          ...previous,
          ...saved,
          company: { ...previous.company, ...saved.company },
          admin: { ...previous.admin, ...saved.admin },
          social: { ...previous.social, ...saved.social },
          preferences: {
            ...previous.preferences,
            ...saved.preferences,
          },
        }));

        if (saved.logoUrl) {
          setLogoPreview(
            `${API_BASE}${saved.logoUrl}?v=${Date.now()}`
          );
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (section, field, value) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        company: settings.company,
        admin: settings.admin,
        social: settings.social,
        preferences: settings.preferences,
      };

      const result = await adminApi("/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSettings((previous) => ({
        ...previous,
        ...result.settings,
      }));

      setMessage(result.message || "Settings saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a PNG, JPG or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be smaller than 2 MB.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const result = await adminApi("/settings/logo", {
        method: "POST",
        body: formData,
      });

      const previewUrl = `${API_BASE}${result.logoUrl}`;

      setLogoPreview(previewUrl);
      setSettings((previous) => ({
        ...previous,
        logoUrl: result.logoUrl,
      }));

      setMessage(result.message || "Logo uploaded successfully.");
    } catch (err) {
      setError(err.message || "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <span className="settings-eyebrow">CONFIGURATION</span>
          <h2>Website Settings</h2>
          <p>Manage your brand, business information and admin profile.</p>
        </div>
      </div>

      {message && (
        <div className="settings-alert settings-success" role="status">
          <i className="fa-solid fa-circle-check" />
          {message}
        </div>
      )}

      {error && (
        <div className="settings-alert settings-error" role="alert">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      <section className="settings-card settings-brand-card">
        <div className="settings-card-heading">
          <div className="settings-card-icon">
            <i className="fa-solid fa-image" />
          </div>
          <div>
            <h3>Branding & Logo</h3>
            <p>Your logo is stored in MongoDB.</p>
          </div>
        </div>

        <div className="settings-logo-content">
          <div className="settings-logo-preview">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Current company logo"
                onError={() => setLogoPreview("")}
              />
            ) : (
              <div className="settings-logo-placeholder">
                <i className="fa-solid fa-image" />
                <span>No uploaded logo</span>
              </div>
            )}
          </div>

          <div className="settings-logo-actions">
            <strong>Company logo</strong>
            <p>PNG, JPG or WebP. Maximum file size: 2 MB.</p>

            <label className="settings-upload-button">
              <i className="fa-solid fa-cloud-arrow-up" />
              {uploading ? "Uploading..." : "Upload new logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadLogo}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
        </div>
      </section>

      <form onSubmit={saveSettings}>
        {sections.map((section) => (
          <section className="settings-card" key={section.id}>
            <div className="settings-card-heading">
              <div className="settings-card-icon">
                <i
                  className={
                    section.id === "company"
                      ? "fa-solid fa-building"
                      : section.id === "admin"
                        ? "fa-solid fa-user-shield"
                        : "fa-solid fa-share-nodes"
                  }
                />
              </div>
              <div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
            </div>

            <div className="settings-fields">
              {section.fields.map(([field, label, type = "text"]) => (
                <label className="settings-field" key={field}>
                  <span>{label}</span>

                  {type === "textarea" ? (
                    <textarea
                      value={settings[section.id][field] || ""}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          field,
                          event.target.value
                        )
                      }
                      rows={3}
                      maxLength={1000}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={type}
                      value={settings[section.id][field] || ""}
                      onChange={(event) =>
                        updateField(
                          section.id,
                          field,
                          event.target.value
                        )
                      }
                      maxLength={1000}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <i className="fa-solid fa-sliders" />
            </div>
            <div>
              <h3>Preferences</h3>
              <p>Configure basic website display options.</p>
            </div>
          </div>

          <label className="settings-toggle">
            <span>
              <strong>Show social links</strong>
              <small>Allow the public website to display social links.</small>
            </span>
            <input
              type="checkbox"
              checked={settings.preferences.showSocialLinks}
              onChange={(event) =>
                updateField(
                  "preferences",
                  "showSocialLinks",
                  event.target.checked
                )
              }
            />
          </label>

          <label className="settings-toggle">
            <span>
              <strong>Maintenance mode</strong>
              <small>
                Save this preference for future maintenance-mode integration.
              </small>
            </span>
            <input
              type="checkbox"
              checked={settings.preferences.maintenanceMode}
              onChange={(event) =>
                updateField(
                  "preferences",
                  "maintenanceMode",
                  event.target.checked
                )
              }
            />
          </label>
        </section>

        <div className="settings-save-bar">
          <span>Remember to save your changes.</span>
          <button
            type="submit"
            className="settings-save-button"
            disabled={saving || uploading}
          >
            <i className="fa-solid fa-floppy-disk" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}