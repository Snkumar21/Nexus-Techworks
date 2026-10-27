import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./ApplicationsManager.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STATUSES = [
    "New",
    "Reviewing",
    "Shortlisted",
    "Rejected",
    "Hired",
];

export default function ApplicationsManager() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [openingResume, setOpeningResume] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await adminApi("/career-applications");
            setApplications(data.applications || []);
        } catch (err) {
            setError(err.message || "Unable to load applications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    const updateStatus = async (id, status) => {
        try {
            setError("");

            await adminApi(`/career-applications/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });

            setApplications((previous) =>
                previous.map((application) =>
                    application._id === id
                        ? { ...application, status }
                        : application
                )
            );
        } catch (err) {
            setError(err.message || "Unable to update application status.");
        }
    };

    const viewResume = async (application) => {
        let previewWindow = null;
        let objectUrl = null;

        try {
            setError("");
            setOpeningResume(application._id);

            // Open synchronously so the browser is less likely to block the tab.
            previewWindow = window.open("about:blank", "_blank");

            if (previewWindow) {
                previewWindow.document.title = "Opening resume...";
                previewWindow.document.body.textContent =
                    "Loading resume securely...";
            }

            const response = await fetch(
                `${API_URL}/api/career-applications/${application._id}/resume`,
                {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(
                    data?.message || "Unable to open this resume."
                );
            }

            const blob = await response.blob();
            const contentType =
                response.headers.get("content-type") || blob.type;

            if (
                contentType.includes("application/json") ||
                contentType.startsWith("text/")
            ) {
                throw new Error("The server did not return a valid resume file.");
            }

            objectUrl = URL.createObjectURL(blob);

            if (contentType.toLowerCase().includes("pdf")) {
                if (previewWindow) {
                    previewWindow.location.href = objectUrl;
                } else {
                    // Popup was blocked: provide a direct link to open the PDF.
                    const link = document.createElement("a");
                    link.href = objectUrl;
                    link.target = "_blank";
                    link.rel = "noopener";
                    link.click();
                }
            } else {
                // DOC/DOCX are not reliably previewable in browsers.
                const link = document.createElement("a");
                link.href = objectUrl;
                link.download =
                    application.resume?.originalName || "resume";
                document.body.appendChild(link);
                link.click();
                link.remove();

                previewWindow?.close();
            }

            // Keep the object URL alive briefly for the browser to open/download it.
            window.setTimeout(() => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }, 60_000);
        } catch (err) {
            previewWindow?.close();
            setError(err.message || "Unable to open this resume.");
        } finally {
            setOpeningResume(null);
        }
    };

    const deleteApplication = async (application) => {
        const confirmed = window.confirm(
            `Delete the application from ${application.name}?\n\n` +
            "This will permanently delete the database record and its stored resume. This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setError("");
            setDeletingId(application._id);

            await adminApi(
                `/career-applications/${application._id}`,
                { method: "DELETE" }
            );

            setApplications((previous) =>
                previous.filter((item) => item._id !== application._id)
            );
        } catch (err) {
            setError(err.message || "Unable to delete this application.");
        } finally {
            setDeletingId(null);
        }
    };

    const visibleApplications =
        filter === "All"
            ? applications
            : applications.filter(
                (application) => application.status === filter
            );

    return (
        <section className="career-manager">
            <div className="career-manager-heading">
                <h2>Job Applications</h2>
                <p>Review applicants and track recruitment progress.</p>
            </div>

            {error && (
                <p className="career-manager-error" role="alert">
                    {error}
                </p>
            )}

            <div className="application-manager-toolbar">
                <label htmlFor="application-filter">
                    Filter by status
                </label>

                <select
                    id="application-filter"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                >
                    <option value="All">All Applications</option>
                    {STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={loadApplications}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {loading ? (
                <p>Loading applications...</p>
            ) : visibleApplications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <div className="application-manager-list">
                    {visibleApplications.map((application) => (
                        <article
                            key={application._id}
                            className="career-manager-item"
                        >
                            <div className="application-manager-details">
                                <h3>{application.name}</h3>

                                <p>
                                    <strong>Position:</strong>{" "}
                                    {application.position}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    <a href={`mailto:${application.email}`}>
                                        {application.email}
                                    </a>
                                </p>

                                {application.phone && (
                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {application.phone}
                                    </p>
                                )}

                                <p>
                                    <strong>Experience:</strong>{" "}
                                    {application.experience || "Not specified"}
                                </p>

                                <div className="application-resource-links">
                                    {application.portfolio && (
                                        <a
                                            href={application.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Portfolio
                                        </a>
                                    )}

                                    {application.github && (
                                        <a
                                            href={application.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            GitHub
                                        </a>
                                    )}

                                    {application.linkedin && (
                                        <a
                                            href={application.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                </div>

                                <div className="application-resume-actions">
                                    <button
                                        type="button"
                                        className="resume-view-button"
                                        onClick={() => viewResume(application)}
                                        disabled={
                                            openingResume === application._id
                                        }
                                    >
                                        {openingResume === application._id
                                            ? "Opening..."
                                            : "View Resume / CV"}
                                    </button>

                                    {application.resume?.originalName && (
                                        <span className="resume-file-name">
                                            {application.resume.originalName}
                                        </span>
                                    )}
                                </div>

                                <small>
                                    Applied:{" "}
                                    {application.createdAt
                                        ? new Date(
                                            application.createdAt
                                        ).toLocaleString()
                                        : "Unknown"}
                                </small>
                            </div>

                            <div className="application-status-control">
                                <label htmlFor={`status-${application._id}`}>
                                    Application Status
                                </label>

                                <select
                                    id={`status-${application._id}`}
                                    value={application.status || "New"}
                                    onChange={(event) =>
                                        updateStatus(
                                            application._id,
                                            event.target.value
                                        )
                                    }
                                >
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="application-delete-button"
                                    onClick={() =>
                                        deleteApplication(application)
                                    }
                                    disabled={
                                        deletingId === application._id
                                    }
                                >
                                    {deletingId === application._id
                                        ? "Deleting..."
                                        : "Delete Application"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}