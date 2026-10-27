import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../utils/adminApi";
import "./EnquiriesManager.css";

const STATUSES = [ "New", "Contacted", "Quotation Sent", "Negotiation", "Won", "Lost", ];
const money = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount || 0);

function EnquiriesManager() {
    const [enquiries, setEnquiries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [mode, setMode] = useState("");
    const [reply, setReply] = useState({ subject: "", body: "", });

    const [quotation, setQuotation] = useState({
        amount: "",
        currency: "INR",
        items: [{ description: "", amount: "" }],
        timeline: "",
        terms: "50% advance payment. Remaining payment as mutually agreed.\nProject scope and timeline will be confirmed before commencement.",
    });

    const loadEnquiries = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();

            if (filter !== "All") params.set("status", filter);
            if (search.trim()) params.set("search", search.trim());

            const query = params.toString();
            const data = await adminApi( `/enquiries${query ? `?${query}` : ""}` );

            setEnquiries(data.enquiries || []);
        } catch (err) {
            setError(err.message || "Unable to load enquiries.");
        } finally { setLoading(false); }
    }, [filter, search]);

    useEffect(() => {
        const timer = setTimeout(() => { loadEnquiries(); }, 250);
        return () => clearTimeout(timer);
    }, [loadEnquiries]);

    const openDetails = async (id) => {
        setError("");
        setNotice("");
        try {
            const data = await adminApi(`/enquiries/${id}`);
            setSelected(data.enquiry);
            setMode("");
        } catch (err) { setError(err.message || "Unable to load enquiry details."); }
    };

    const updateStatus = async (id, status) => {
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const data = await adminApi(`/enquiries/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });

            setEnquiries((previous) =>
                previous.map((item) =>
                    item._id === id ? { ...item, status } : item
                )
            );

            if (selected?._id === id) { setSelected(data.enquiry); }

            setNotice("Enquiry status updated.");
        } catch (err) {
            setError(err.message || "Unable to update status.");
        } finally { setSaving(false); }
    };

    const startReply = () => {
        setReply({
            subject: `Re: Your enquiry about ${selected.service} | Nexus Techworks`,
            body: `Hello ${selected.name},\n\nThank you for contacting Nexus Techworks.\n\n`,
        });
        setMode("reply");
    };

    const sendReply = async (event) => {
        event.preventDefault();

        if (!window.confirm(`Send this email to ${selected.email}?`)) return;

        setSaving(true);
        setError("");
        setNotice("");

        try {
            const data = await adminApi(`/enquiries/${selected._id}/reply`, {
                method: "POST",
                body: JSON.stringify(reply),
            });

            setSelected(data.enquiry);
            setMode("");
            setNotice("Reply email sent successfully.");
            await loadEnquiries();
        } catch (err) {
            setError(err.message || "Unable to send reply.");
        } finally { setSaving(false); }
    };

    const startQuotation = () => {
        setQuotation({
            amount: "",
            currency: "INR",
            items: [{ description: selected.service, amount: "" }],
            timeline: "",
            terms: "50% advance payment. Remaining payment as mutually agreed.\nProject scope and timeline will be confirmed before commencement.",
        });
        setMode("quotation");
    };

    const updateQuotationItem = (index, field, value) => {
        setQuotation((previous) => ({
            ...previous,
            items: previous.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addQuotationItem = () => {
        setQuotation((previous) => ({
            ...previous,
            items: [...previous.items, { description: "", amount: "" }],
        }));
    };

    const removeQuotationItem = (index) => {
        setQuotation((previous) => ({
            ...previous,
            items: previous.items.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const quotationTotal = quotation.items.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const sendQuotation = async (event) => {
        event.preventDefault();

        const amount = Number(quotation.amount);

        if (!Number.isFinite(amount) || amount < 0) {
            setError("Please enter a valid quotation total.");
            return;
        }

        const items = quotation.items
            .filter((item) => item.description.trim())
            .map((item) => ({
                description: item.description.trim(),
                amount: Number(item.amount),
            }));

        if (items.some((item) => !Number.isFinite(item.amount) || item.amount < 0)) {
            setError("Please enter valid amounts for each quotation item.");
            return;
        }

        if (
            items.length > 0 &&
            Math.abs(items.reduce((sum, item) => sum + item.amount, 0) - amount) > 0.01
        ) {
            setError("Quotation item amounts must add up to the total amount.");
            return;
        }

        const confirmed = window.confirm(
            `Send quotation of ${money(amount, quotation.currency)} to ${selected.email}?`
        );

        if (!confirmed) return;

        setSaving(true);
        setError("");
        setNotice("");

        try {
            const data = await adminApi(
                `/enquiries/${selected._id}/quotation`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        amount,
                        currency: quotation.currency,
                        items,
                        timeline: quotation.timeline,
                        terms: quotation.terms,
                    }),
                }
            );

            setSelected(data.enquiry);
            setMode("");
            setNotice("Quotation sent successfully.");
            await loadEnquiries();
        } catch (err) {
            setError(err.message || "Unable to send quotation.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="enquiries-page">
            <div className="enquiries-heading">
                <div>
                    <h1>Enquiry Management</h1>
                    <p>Manage website enquiries, customer replies and quotations.</p>
                </div>

                <button
                    type="button"
                    className="enq-button enq-secondary"
                    onClick={loadEnquiries}
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            {error && <div className="enq-alert enq-error">{error}</div>}
            {notice && <div className="enq-alert enq-success">{notice}</div>}

            <div className="enq-toolbar">
                <input
                    type="search"
                    placeholder="Search name, email, phone, service..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search enquiries"
                />

                <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label="Filter enquiries by status"
                >
                    <option value="All">All statuses</option>
                    {STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="enq-table-wrap">
                <table className="enq-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Budget</th>
                            <th>Received</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="enq-empty">
                                    Loading enquiries...
                                </td>
                            </tr>
                        ) : enquiries.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="enq-empty">
                                    No enquiries found.
                                </td>
                            </tr>
                        ) : (
                            enquiries.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <strong>{item.name}</strong>
                                        <span className="enq-subtext">{item.email}</span>
                                        <span className="enq-subtext">{item.phone}</span>
                                    </td>
                                    <td>{item.service}</td>
                                    <td>{item.budget || "—"}</td>
                                    <td>
                                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                    <td>
                                        <select
                                            className={`enq-status status-${item.status
                                                .toLowerCase()
                                                .replaceAll(" ", "-")}`}
                                            value={item.status}
                                            disabled={saving}
                                            onChange={(event) =>
                                                updateStatus(item._id, event.target.value)
                                            }
                                            aria-label={`Status for ${item.name}`}
                                        >
                                            {STATUSES.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="enq-button enq-primary"
                                            onClick={() => openDetails(item._id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div
                    className="enq-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelected(null);
                            setMode("");
                        }
                    }}
                >
                    <section
                        className="enq-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="enq-modal-title"
                    >
                        <div className="enq-modal-heading">
                            <div>
                                <h2 id="enq-modal-title">Enquiry Details</h2>
                                <p>{selected.name}</p>
                            </div>
                            <button
                                type="button"
                                className="enq-close"
                                onClick={() => {
                                    setSelected(null);
                                    setMode("");
                                }}
                                aria-label="Close details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="enq-detail-grid">
                            <div>
                                <span>Name</span>
                                <strong>{selected.name}</strong>
                            </div>
                            <div>
                                <span>Email</span>
                                <strong>{selected.email}</strong>
                            </div>
                            <div>
                                <span>Phone</span>
                                <strong>{selected.phone || "—"}</strong>
                            </div>
                            <div>
                                <span>Company</span>
                                <strong>{selected.company || "—"}</strong>
                            </div>
                            <div>
                                <span>Service</span>
                                <strong>{selected.service}</strong>
                            </div>
                            <div>
                                <span>Budget</span>
                                <strong>{selected.budget || "Not provided"}</strong>
                            </div>
                            <div>
                                <span>Received</span>
                                <strong>
                                    {new Date(selected.createdAt).toLocaleString("en-IN")}
                                </strong>
                            </div>
                            <div>
                                <span>Status</span>
                                <select
                                    value={selected.status}
                                    disabled={saving}
                                    onChange={(event) =>
                                        updateStatus(selected._id, event.target.value)
                                    }
                                >
                                    {STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="enq-message-box">
                            <h3>Customer Message</h3>
                            <p>{selected.message}</p>
                        </div>

                        {selected.quotation?.sentAt && (
                            <div className="enq-message-box">
                                <h3>Last Quotation</h3>
                                <p>
                                    <strong>
                                        {money(
                                            selected.quotation.amount,
                                            selected.quotation.currency
                                        )}
                                    </strong>
                                </p>
                                <p>
                                    Sent:{" "}
                                    {new Date(selected.quotation.sentAt).toLocaleString("en-IN")}
                                </p>
                            </div>
                        )}

                        {selected.emails?.length > 0 && (
                            <div className="enq-message-box">
                                <h3>Email History</h3>
                                {selected.emails.slice().reverse().map((email, index) => (
                                    <div className="enq-history-item" key={`${email.sentAt}-${index}`}>
                                        <strong>{email.type}: {email.subject}</strong>
                                        <span>
                                            {email.sentAt
                                                ? new Date(email.sentAt).toLocaleString("en-IN")
                                                : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="enq-actions">
                            <button
                                type="button"
                                className="enq-button enq-secondary"
                                onClick={startReply}
                            >
                                Reply by Email
                            </button>
                            <button
                                type="button"
                                className="enq-button enq-primary"
                                onClick={startQuotation}
                            >
                                Create Quotation
                            </button>
                        </div>

                        {mode === "reply" && (
                            <form className="enq-form" onSubmit={sendReply}>
                                <h3>Reply to Customer</h3>
                                <p className="enq-recipient">To: {selected.email}</p>

                                <label>
                                    Subject
                                    <input
                                        required
                                        maxLength={200}
                                        value={reply.subject}
                                        onChange={(event) =>
                                            setReply({ ...reply, subject: event.target.value })
                                        }
                                    />
                                </label>

                                <label>
                                    Message
                                    <textarea
                                        required
                                        rows={6}
                                        maxLength={15000}
                                        value={reply.body}
                                        onChange={(event) =>
                                            setReply({ ...reply, body: event.target.value })
                                        }
                                    />
                                </label>

                                <div className="enq-actions">
                                    <button
                                        type="button"
                                        className="enq-button enq-secondary"
                                        onClick={() => setMode("")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="enq-button enq-primary"
                                        disabled={saving}
                                    >
                                        {saving ? "Sending..." : "Confirm & Send"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {mode === "quotation" && (
                            <form className="enq-form" onSubmit={sendQuotation}>
                                <h3>Prepare Quotation</h3>
                                <p className="enq-recipient">
                                    To: {selected.email} · Customer: {selected.name}
                                </p>

                                <label>
                                    Currency
                                    <select
                                        value={quotation.currency}
                                        onChange={(event) =>
                                            setQuotation({
                                                ...quotation,
                                                currency: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="INR">INR — Indian Rupee</option>
                                        <option value="USD">USD — US Dollar</option>
                                        <option value="EUR">EUR — Euro</option>
                                        <option value="GBP">GBP — British Pound</option>
                                    </select>
                                </label>

                                <h4>Quotation Items</h4>

                                {quotation.items.map((item, index) => (
                                    <div className="enq-quotation-item" key={index}>
                                        <label>
                                            Description
                                            <input
                                                value={item.description}
                                                maxLength={250}
                                                onChange={(event) =>
                                                    updateQuotationItem(
                                                        index,
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Service or deliverable"
                                            />
                                        </label>
                                        <label>
                                            Item amount
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required={Boolean(item.description.trim())}
                                                value={item.amount}
                                                onChange={(event) =>
                                                    updateQuotationItem(
                                                        index,
                                                        "amount",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="0.00"
                                            />
                                        </label>
                                        {quotation.items.length > 1 && (
                                            <button
                                                type="button"
                                                className="enq-remove"
                                                onClick={() => removeQuotationItem(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="enq-button enq-secondary"
                                    onClick={addQuotationItem}
                                    disabled={quotation.items.length >= 30}
                                >
                                    + Add Item
                                </button>

                                <label>
                                    Total Quotation Amount ({quotation.currency})
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={quotation.amount}
                                        onChange={(event) =>
                                            setQuotation({
                                                ...quotation,
                                                amount: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                {quotation.items.some((item) => item.description.trim()) && (
                                    <p className="enq-recipient">
                                        Items total: {money(quotationTotal, quotation.currency)}
                                    </p>
                                )}

                                <label>
                                    Estimated Timeline
                                    <input
                                        value={quotation.timeline}
                                        maxLength={500}
                                        onChange={(event) =>
                                            setQuotation({
                                                ...quotation,
                                                timeline: event.target.value,
                                            })
                                        }
                                        placeholder="e.g. 4–6 weeks"
                                    />
                                </label>

                                <label>
                                    Terms & Conditions
                                    <textarea
                                        rows={4}
                                        maxLength={3000}
                                        value={quotation.terms}
                                        onChange={(event) =>
                                            setQuotation({
                                                ...quotation,
                                                terms: event.target.value,
                                            })
                                        }
                                    />
                                </label>

                                <div className="enq-quote-preview">
                                    <h4>Quotation Preview</h4>
                                    <p>Customer: {selected.name}</p>
                                    <p>Service: {selected.service}</p>
                                    <p>
                                        Total: <strong>
                                            {money(Number(quotation.amount) || 0, quotation.currency)}
                                        </strong>
                                    </p>
                                    <p>Timeline: {quotation.timeline || "To be agreed"}</p>
                                    <p>Terms: {quotation.terms || "No terms added"}</p>
                                    <small>
                                        The quotation will be emailed only after you confirm.
                                    </small>
                                </div>

                                <div className="enq-actions">
                                    <button
                                        type="button"
                                        className="enq-button enq-secondary"
                                        onClick={() => setMode("")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="enq-button enq-primary"
                                        disabled={saving}
                                    >
                                        {saving ? "Sending..." : "Confirm & Send Quotation"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

export default EnquiriesManager;