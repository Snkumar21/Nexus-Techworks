import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./CareersManager.css";

const EMPTY_FORM = {
    title: "",
    type: "Internship / Entry Level",
    description: "",
    skills: "",
    published: false,
    sortOrder: 0,
};

export default function CareersManager() {
    const [careers, setCareers] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadCareers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminApi("/careers/admin");
            setCareers(data.careers || []);
        } catch (err) {
            setError(err.message || "Failed to load careers.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCareers();
    }, [loadCareers]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setMessage("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const payload = {
                ...form,
                title: form.title.trim(),
                type: form.type.trim(),
                description: form.description.trim(),
                skills: form.skills.trim(),
                sortOrder: Number(form.sortOrder),
            };

            const path = editingId
                ? `/careers/admin/${editingId}`
                : "/careers/admin";

            const data = await adminApi(path, {
                method: editingId ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });

            setMessage(
                editingId
                    ? "Career opportunity updated successfully."
                    : "Career opportunity created successfully."
            );

            resetForm();
            setMessage(
                editingId
                    ? "Career opportunity updated successfully."
                    : "Career opportunity created successfully."
            );

            await loadCareers();
        } catch (err) {
            setError(err.message || "Unable to save career.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (career) => {
        setEditingId(career._id);
        setForm({
            title: career.title || "",
            type: career.type || "",
            description: career.description || "",
            skills: career.skills || "",
            published: Boolean(career.published),
            sortOrder: career.sortOrder ?? 0,
        });

        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (career) => {
        const confirmed = window.confirm(
            `Delete "${career.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await adminApi(`/careers/admin/${career._id}`, {
                method: "DELETE",
            });

            if (editingId === career._id) resetForm();

            setMessage("Career opportunity deleted.");
            await loadCareers();
        } catch (err) {
            setError(err.message || "Unable to delete career.");
        }
    };

    return (
        <section className="career-manager">
            <div className="career-manager-heading">
                <h2>Career Opportunities</h2>
                <p>Create and manage public job listings.</p>
            </div>

            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}

            <form onSubmit={handleSubmit} className="career-manager-form">
                <h3>{editingId ? "Edit Opportunity" : "Add Opportunity"}</h3>

                <label htmlFor="job-title">Job Title *</label>
                <input
                    id="job-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={160}
                    required
                />

                <label htmlFor="job-type">Employment Type *</label>
                <input
                    id="job-type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    placeholder="Internship / Entry Level"
                />

                <label htmlFor="job-description">Description *</label>
                <textarea
                    id="job-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={5}
                    required
                />

                <label htmlFor="job-skills">Skills *</label>
                <input
                    id="job-skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    maxLength={500}
                    required
                    placeholder="React.js • Node.js • MongoDB"
                />

                <label htmlFor="job-sort">Sort Order</label>
                <input
                    id="job-sort"
                    name="sortOrder"
                    type="number"
                    min="0"
                    step="1"
                    value={form.sortOrder}
                    onChange={handleChange}
                />

                <label className="career-manager-checkbox">
                    <input
                        name="published"
                        type="checkbox"
                        checked={form.published}
                        onChange={handleChange}
                    />
                    Publish this opportunity on the website
                </label>

                <div className="career-manager-actions">
                    <button type="submit" disabled={saving}>
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Update Opportunity"
                                : "Create Opportunity"}
                    </button>

                    {editingId && (
                        <button type="button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className="career-manager-list">
                <h3>Existing Opportunities ({careers.length})</h3>

                {loading ? (
                    <p>Loading opportunities...</p>
                ) : careers.length === 0 ? (
                    <p>No opportunities created yet.</p>
                ) : (
                    careers.map((career) => (
                        <article
                            key={career._id}
                            className="career-manager-item"
                        >
                            <div>
                                <h4>{career.title}</h4>
                                <p>{career.type}</p>
                                <small>
                                    {career.published ? "Published" : "Draft"}
                                    {" · Order: "}
                                    {career.sortOrder}
                                </small>
                            </div>

                            <div className="career-manager-actions">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(career)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(career)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}