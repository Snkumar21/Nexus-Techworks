
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./ClientsManager.css";

const EMPTY_FORM = {
    name: "",
    logo: "",
    service: "",
    website: "",
};

export default function ClientsManager() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadClients = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await adminApi("/clients/admin");
            setClients(data.clients || []);
        } catch (err) {
            setError(err.message || "Unable to load clients.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    const filteredClients = useMemo(() => {
        const query = search.trim().toLowerCase();

        return clients.filter((client) => {
            const matchesSearch = [
                client.name,
                client.service,
                client.website,
                client.enquiry?.email,
                client.enquiry?.company,
            ].some((value) => String(value || "").toLowerCase().includes(query));

            const matchesFilter =
                filter === "All" ||
                (filter === "Published" && client.isPublished) ||
                (filter === "Draft" && !client.isPublished);

            return matchesSearch && matchesFilter;
        });
    }, [clients, search, filter]);

    const counts = useMemo(() => ({
        total: clients.length,
        published: clients.filter((client) => client.isPublished).length,
        drafts: clients.filter((client) => !client.isPublished).length,
    }), [clients]);

    const openCreateForm = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        setError("");
        setNotice("");
        setShowForm(true);
    };

    const openEditForm = (client) => {
        setEditingId(client._id);
        setForm({
            name: client.name || "",
            logo: client.logo || "",
            service: client.service || "",
            website: client.website || "",
        });
        setError("");
        setNotice("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
    };

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        const payload = {
            name: form.name.trim(),
            logo: form.logo.trim(),
            service: form.service.trim(),
            website: form.website.trim(),
        };

        try {
            if (editingId) {
                await adminApi(`/clients/admin/${editingId}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
                setNotice("Client details updated successfully.");
            } else {
                await adminApi("/clients/admin", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                setNotice("Client created as an unpublished draft.");
            }

            setShowForm(false);
            setEditingId(null);
            setForm({ ...EMPTY_FORM });
            await loadClients();
        } catch (err) {
            setError(err.message || "Unable to save client.");
        } finally {
            setSaving(false);
        }
    };

    const togglePublish = async (client) => {
        const action = client.isPublished ? "unpublish" : "publish";

        if (
            client.isPublished &&
            !window.confirm(`Unpublish "${client.name}" from the public website?`)
        ) {
            return;
        }

        setError("");
        setNotice("");

        try {
            const data = await adminApi(
                `/clients/admin/${client._id}/publish`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        isPublished: !client.isPublished,
                    }),
                }
            );

            setNotice(data.message || `Client ${action}ed successfully.`);
            await loadClients();
        } catch (err) {
            setError(err.message || `Unable to ${action} client.`);
        }
    };

    const handleDelete = async (client) => {
        const confirmed = window.confirm(
            `Delete "${client.name}"? This cannot be undone. The enquiry itself will be retained.`
        );

        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            const data = await adminApi(`/clients/admin/${client._id}`, {
                method: "DELETE",
            });

            setNotice(data.message || "Client deleted.");
            await loadClients();
        } catch (err) {
            setError(err.message || "Unable to delete client.");
        }
    };

    return (
        <section className="clients-manager">
            <div className="cm-page-heading">
                <div>
                    <span className="cm-eyebrow">WORKSPACE / CLIENTS</span>
                    <h2>Client Management</h2>
                    <p>
                        Manage client profiles and control which clients appear
                        on your public website.
                    </p>
                </div>

                <button
                    type="button"
                    className="cm-primary-btn"
                    onClick={openCreateForm}
                >
                    <i className="fa-solid fa-plus" />
                    Add Client
                </button>
            </div>

            {error && (
                <div className="cm-alert cm-alert-error" role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={() => setError("")}>×</button>
                </div>
            )}

            {notice && (
                <div className="cm-alert cm-alert-success" role="status">
                    <span>{notice}</span>
                    <button type="button" onClick={() => setNotice("")}>×</button>
                </div>
            )}

            <div className="cm-stats">
                <article className="cm-stat-card">
                    <span>Total Clients</span>
                    <strong>{counts.total}</strong>
                    <i className="fa-solid fa-users" />
                </article>

                <article className="cm-stat-card">
                    <span>Published</span>
                    <strong>{counts.published}</strong>
                    <i className="fa-solid fa-globe" />
                </article>

                <article className="cm-stat-card">
                    <span>Unpublished Drafts</span>
                    <strong>{counts.drafts}</strong>
                    <i className="fa-solid fa-file-pen" />
                </article>
            </div>

            <div className="cm-toolbar">
                <label className="cm-search">
                    <i className="fa-solid fa-magnifying-glass" />
                    <input
                        type="search"
                        placeholder="Search clients, services, email..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </label>

                <select
                    aria-label="Filter clients by publication status"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="All">All Clients</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Unpublished Drafts</option>
                </select>

                <button
                    type="button"
                    className="cm-refresh-btn"
                    onClick={loadClients}
                    disabled={loading}
                    title="Refresh clients"
                >
                    <i className={`fa-solid fa-rotate ${loading ? "cm-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            <div className="cm-list-heading">
                <div>
                    <h3>All Clients</h3>
                    <p>{filteredClients.length} client(s) found</p>
                </div>
            </div>

            {loading ? (
                <div className="cm-empty-state">
                    <i className="fa-solid fa-spinner cm-spin" />
                    <p>Loading clients...</p>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="cm-empty-state">
                    <i className="fa-regular fa-building" />
                    <h3>No clients found</h3>
                    <p>
                        Add a client manually or mark an enquiry as Won to
                        create a client draft automatically.
                    </p>
                    <button
                        type="button"
                        className="cm-primary-btn"
                        onClick={openCreateForm}
                    >
                        Add First Client
                    </button>
                </div>
            ) : (
                <div className="cm-table-wrap">
                    <table className="cm-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Service</th>
                                <th>Website</th>
                                <th>Source</th>
                                <th>Visibility</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client._id}>
                                    <td>
                                        <div className="cm-client-cell">
                                            {client.logo ? (
                                                <img
                                                    src={client.logo}
                                                    alt=""
                                                    className="cm-client-logo"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="cm-logo-placeholder">
                                                    {(client.name || "C")
                                                        .slice(0, 1)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="cm-client-info">
                                                <strong>{client.name}</strong>
                                                <span>
                                                    Added{" "}
                                                    {client.createdAt
                                                        ? new Date(client.createdAt).toLocaleDateString()
                                                        : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{client.service || "—"}</td>

                                    <td>
                                        {client.website ? (
                                            <a
                                                className="cm-website-link"
                                                href={client.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Visit website ↗
                                            </a>
                                        ) : "—"}
                                    </td>

                                    <td>
                                        {client.enquiry ? (
                                            <div className="cm-source">
                                                <span className="cm-source-tag">Enquiry</span>
                                                <span>
                                                    {client.enquiry.company ||
                                                        client.enquiry.name ||
                                                        "Linked enquiry"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="cm-source-tag cm-manual-tag">
                                                Manual
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`cm-status ${
                                                client.isPublished
                                                    ? "cm-status-published"
                                                    : "cm-status-draft"
                                            }`}
                                        >
                                            <span />
                                            {client.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="cm-actions">
                                            <button
                                                type="button"
                                                className="cm-action-btn"
                                                onClick={() => openEditForm(client)}
                                                title="Edit client"
                                                aria-label={`Edit ${client.name}`}
                                            >
                                                <i className="fa-solid fa-pen" />
                                            </button>

                                            <button
                                                type="button"
                                                className={`cm-action-btn ${
                                                    client.isPublished
                                                        ? "cm-unpublish-btn"
                                                        : "cm-publish-btn"
                                                }`}
                                                onClick={() => togglePublish(client)}
                                                title={client.isPublished ? "Unpublish" : "Publish"}
                                                aria-label={`${client.isPublished ? "Unpublish" : "Publish"} ${client.name}`}
                                            >
                                                <i
                                                    className={`fa-solid ${
                                                        client.isPublished
                                                            ? "fa-eye-slash"
                                                            : "fa-eye"
                                                    }`}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="cm-action-btn cm-delete-btn"
                                                onClick={() => handleDelete(client)}
                                                title="Delete client"
                                                aria-label={`Delete ${client.name}`}
                                            >
                                                <i className="fa-solid fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div
                    className="cm-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeForm();
                    }}
                >
                    <section
                        className="cm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cm-form-title"
                    >
                        <div className="cm-modal-header">
                            <div>
                                <span className="cm-eyebrow">CLIENT PROFILE</span>
                                <h3 id="cm-form-title">
                                    {editingId ? "Edit Client" : "Add Client"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="cm-modal-close"
                                onClick={closeForm}
                                disabled={saving}
                                aria-label="Close form"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="cm-form-body">
                                <label className="cm-field">
                                    <span>Client / Company Name *</span>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={updateField}
                                        maxLength={160}
                                        required
                                        placeholder="e.g. Nexus Techworks Pvt Ltd."
                                    />
                                </label>

                                <label className="cm-field">
                                    <span>Service Provided *</span>
                                    <input
                                        name="service"
                                        value={form.service}
                                        onChange={updateField}
                                        maxLength={160}
                                        required
                                        placeholder="e.g. Website Development"
                                    />
                                </label>

                                <label className="cm-field">
                                    <span>Logo URL</span>
                                    <input
                                        name="logo"
                                        type="url"
                                        value={form.logo}
                                        onChange={updateField}
                                        maxLength={2048}
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <small>Use a publicly accessible HTTPS image URL.</small>
                                </label>

                                <label className="cm-field">
                                    <span>Website URL</span>
                                    <input
                                        name="website"
                                        type="url"
                                        value={form.website}
                                        onChange={updateField}
                                        maxLength={2048}
                                        placeholder="https://example.com"
                                    />
                                </label>

                                {form.logo && (
                                    <div className="cm-logo-preview">
                                        <span>Logo Preview</span>
                                        <img
                                            src={form.logo}
                                            alt="Client logo preview"
                                            onError={(event) => {
                                                event.currentTarget.style.display = "none";
                                            }}
                                            onLoad={(event) => {
                                                event.currentTarget.style.display = "block";
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="cm-draft-note">
                                    <i className="fa-solid fa-circle-info" />
                                    <span>
                                        {editingId
                                            ? "Saving these details will not change the current publication status."
                                            : "New clients are saved as drafts and will not appear publicly until published."}
                                    </span>
                                </div>
                            </div>

                            <div className="cm-modal-footer">
                                <button
                                    type="button"
                                    className="cm-secondary-btn"
                                    onClick={closeForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="cm-primary-btn"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <i className="fa-solid fa-spinner cm-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-check" />
                                            {editingId ? "Save Changes" : "Create Draft"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </section>
    );
}