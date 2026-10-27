
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminApi } from "../../utils/adminApi";
import "./ServicesManager.css";

/* API CONFIGURATION */
const API_URL = ( import.meta.env.VITE_API_URL || "http://localhost:5000" ).replace(/\/$/, "");

/* DEFAULT FORM VALUES */
const blankService = {
    title: "",
    description: "",
    price: 0,
    priceType: "starting",
    published: false,
    sortOrder: 0,
};

const emptyPage = {
    heroLabel: "",
    heroTitle: "",
    heroAccent: "",
    heroDescription: "",

    pricingLabel: "",
    pricingTitle: "",
    pricingAccent: "",
    pricingDescription: "",
    pricingNote: "",

    serviceButtonText: "",
    serviceLink: "/contact",

    processLabel: "",
    processTitle: "",
    processAccent: "",
    processDescription: "",
    processSteps: [],

    ctaLabel: "",
    ctaTitle: "",
    ctaAccent: "",
    ctaDescription: "",
    ctaButtonText: "",
    ctaLink: "/contact",
};

const textFields = [
    ["heroLabel", "Hero label"],
    ["heroTitle", "Hero heading"],
    ["heroAccent", "Hero highlighted text"],
    ["heroDescription", "Hero description"],

    ["pricingLabel", "Pricing label"],
    ["pricingTitle", "Pricing heading"],
    ["pricingAccent", "Pricing highlighted text"],
    ["pricingDescription", "Pricing description"],

    ["pricingNote", "Pricing note"],
    ["serviceButtonText", "Service button text"],
    ["serviceLink", "Service button link"],

    ["processLabel", "Process label"],
    ["processTitle", "Process heading"],
    ["processAccent", "Process highlighted text"],
    ["processDescription", "Process description"],

    ["ctaLabel", "CTA label"],
    ["ctaTitle", "CTA heading"],
    ["ctaAccent", "CTA highlighted text"],
    ["ctaDescription", "CTA description"],
    ["ctaButtonText", "CTA button text"],
    ["ctaLink", "CTA button link"],
];

/* BACKEND API REQUEST */
async function servicesRequest(path, options = {}) {
    return adminApi(path, options);
}

/* SERVICES MANAGER */
const ServicesManager = () => {
    const [params] = useSearchParams();

    /* STATES */
    const [tab, setTab] = useState("services");

    const [services, setServices] = useState([]);
    const [page, setPage] = useState(null);

    const [draft, setDraft] = useState({
        ...blankService,
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    /* LOAD DATABASE CONTENT */
    const load = useCallback(async () => {
        const data = await servicesRequest(
            "/services/admin"
        );

        if (!data || !Array.isArray(data.services)) {
            throw new Error(
                "Invalid Services Manager API response"
            );
        }

        setServices(data.services);

        setPage(
            data.page
                ? {
                    ...emptyPage,
                    ...data.page,
                    processSteps: Array.isArray(
                        data.page.processSteps
                    )
                        ? data.page.processSteps
                        : [],
                }
                : {
                    ...emptyPage,
                    processSteps: [],
                }
        );

    }, []);

    /* INITIAL LOAD */
    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await servicesRequest( "/services/admin" );
                if (!active) return;

                if ( !data || !Array.isArray(data.services) ) {
                    throw new Error(
                        "Invalid Services Manager API response"
                    );
                }

                setServices(data.services);

                setPage(
                    data.page
                        ? {
                            ...emptyPage,
                            ...data.page,
                            processSteps: Array.isArray(
                                data.page.processSteps
                            )
                                ? data.page.processSteps
                                : [],
                        }
                        : {
                            ...emptyPage,
                            processSteps: [],
                        }
                );

            } catch (err) {

                if (active) {
                    setError(
                        err.message ||
                        "Unable to load services."
                    );
                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }
        };

        fetchData();

        return () => {
            active = false;
        };

    }, []);

    /* ================================
       DASHBOARD QUICK ACTION
    ================================ */

    useEffect(() => {

        if (params.get("new") === "1") {

            setTab("services");
            setEditingId(null);
            setDraft({ ...blankService });

        }

    }, [params]);

    /* ================================
       RESET SERVICE FORM
    ================================ */

    const resetServiceForm = () => {

        setDraft({ ...blankService });
        setEditingId(null);

    };

    /* ================================
       SERVICE FORM CHANGE
    ================================ */

    const handleServiceChange = (event) => {

        const { name, value, type, checked } = event.target;

        setDraft((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    /* CREATE / UPDATE SERVICE */
    const saveService = async (event) => {
        event.preventDefault();

        if (busy) return;

        setBusy(true);
        setError("");
        setNotice("");

        try {
            const payload = {
                title: draft.title.trim(),
                description: draft.description.trim(),
                price: Number(draft.price),
                priceType: draft.priceType,
                published: Boolean(draft.published),
                sortOrder: Number(draft.sortOrder),
            };

            if (!payload.title || !payload.description) {
                throw new Error( "Service title and description are required." );
            }

            if (
                !Number.isFinite(payload.price) ||
                payload.price < 0
            ) {
                throw new Error( "Enter a valid service price." );
            }

            if (!Number.isInteger(payload.sortOrder)) {
                throw new Error( "Sort order must be a whole number." );
            }

            await servicesRequest(
                editingId
                    ? `/services/admin/${editingId}`
                    : "/services/admin",
                {
                    method: editingId ? "PUT" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            await load();

            resetServiceForm();

            setNotice( editingId ? "Service updated successfully." : "Service created successfully." );
        } catch (err) {
            setError( err.message || "Unable to save service." );
            window.scrollTo({ top: 0, behavior: "smooth", });
        } finally {
            setBusy(false);
        }

    };

    /* ================================
       EDIT SERVICE
    ================================ */

    const editService = (service) => {

        setTab("services");

        setEditingId(service._id);

        setDraft({
            title: service.title ?? "",
            description: service.description ?? "",
            price: service.price ?? 0,
            priceType: service.priceType ?? "starting",
            published: Boolean(service.published),
            sortOrder: service.sortOrder ?? 0,
        });

        setError("");
        setNotice("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };

    /* ================================
       DELETE SERVICE
    ================================ */

    const deleteService = async (service) => {

        if (busy) return;

        const confirmed = window.confirm(
            `Permanently delete "${service.title}"?`
        );

        if (!confirmed) return;

        setBusy(true);
        setError("");
        setNotice("");

        try {

            await servicesRequest(
                `/services/admin/${service._id}`,
                {
                    method: "DELETE",
                }
            );

            await load();

            if (editingId === service._id) {
                resetServiceForm();
            }

            setNotice(
                "Service deleted successfully."
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to delete service."
            );

        } finally {

            setBusy(false);

        }

    };

    /* ================================
       PUBLISH / UNPUBLISH
    ================================ */

    const togglePublish = async (service) => {

        if (busy) return;

        setBusy(true);
        setError("");
        setNotice("");

        try {

            const payload = {
                title: service.title,
                description: service.description,
                price: Number(service.price),
                priceType: service.priceType,
                published: !service.published,
                sortOrder: Number(service.sortOrder),
            };

            await servicesRequest(
                `/services/admin/${service._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            );

            await load();

            // Keep an open editor consistent with the saved record.
            if (editingId === service._id) {
                setDraft((previous) => ({
                    ...previous,
                    published: payload.published,
                }));
            }

            setNotice(
                payload.published
                    ? "Service published successfully."
                    : "Service unpublished successfully."
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to change publish status."
            );

        } finally {

            setBusy(false);

        }

    };

    /* ================================
       PAGE FIELD CHANGE
    ================================ */

    const handlePageChange = (event) => {

        const { name, value } = event.target;

        setPage((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    /* ================================
       PROCESS STEP CHANGE
    ================================ */

    const handleStepChange = (index, field, value) => {

        setPage((previous) => ({
            ...previous,

            processSteps: previous.processSteps.map(
                (step, stepIndex) =>
                    stepIndex === index
                        ? {
                            ...step,
                            [field]: value,
                        }
                        : step
            ),
        }));

    };

    /* ================================
       ADD PROCESS STEP
    ================================ */

    const addProcessStep = () => {

        setPage((previous) => ({
            ...previous,

            processSteps: [
                ...(previous.processSteps ?? []),
                {
                    title: "",
                    description: "",
                },
            ],
        }));

    };

    /* ================================
       REMOVE PROCESS STEP
    ================================ */

    const removeProcessStep = (index) => {

        setPage((previous) => ({
            ...previous,

            processSteps: previous.processSteps.filter(
                (_, stepIndex) => stepIndex !== index
            ),
        }));

    };

    /* ================================
       SAVE PAGE CONTENT
    ================================ */

    const savePage = async (event) => {

        event.preventDefault();

        if (!page || busy) return;

        setBusy(true);
        setError("");
        setNotice("");

        try {

            const payload = {
                ...emptyPage,
                ...page,

                processSteps: Array.isArray(
                    page.processSteps
                )
                    ? page.processSteps.map((step) => ({
                        title: step.title ?? "",
                        description: step.description ?? "",
                    }))
                    : [],
            };

            // Only internal website paths are accepted.
            for (const field of [
                "serviceLink",
                "ctaLink",
            ]) {

                if (
                    typeof payload[field] !== "string" ||
                    !payload[field].startsWith("/") ||
                    payload[field].startsWith("//")
                ) {
                    throw new Error(
                        `${field} must start with a single /.`
                    );
                }

            }

            if (payload.processSteps.length > 12) {
                throw new Error(
                    "Maximum 12 process steps are allowed."
                );
            }

            await servicesRequest(
                "/services/admin/page",
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            );

            await load();

            setNotice(
                "Services page content saved successfully."
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to save page content."
            );

        } finally {

            setBusy(false);

        }

    };

    /* ================================
       DATABASE COUNTS
    ================================ */

    const totalServices = services.length;

    const publishedServices = services.filter(
        (service) => service.published
    ).length;

    const draftServices =
        totalServices - publishedServices;

    /* ================================
       RENDER
    ================================ */

    return (
        <div className="services-manager admin-dashboard-content">

            {/* HEADER */}

            <div className="sm-heading">

                <div>
                    <span>CONTENT MANAGEMENT</span>

                    <h2>Services Manager</h2>

                    <p>
                        Manage pricing, published services,
                        process steps and page content.
                    </p>
                </div>

                <a
                    href="/services"
                    target="_blank"
                    rel="noreferrer"
                >
                    Preview website ↗
                </a>

            </div>

            {/* STATISTICS */}

            <div className="sm-stats">

                <article>
                    <span>Total Services</span>
                    <strong>
                        {loading ? "—" : totalServices}
                    </strong>
                </article>

                <article>
                    <span>Published</span>
                    <strong>
                        {loading ? "—" : publishedServices}
                    </strong>
                </article>

                <article>
                    <span>Drafts</span>
                    <strong>
                        {loading ? "—" : draftServices}
                    </strong>
                </article>

            </div>

            {/* TABS */}

            <div className="sm-tabs">

                <button
                    type="button"
                    className={
                        tab === "services" ? "selected" : ""
                    }
                    onClick={() => setTab("services")}
                >
                    Services & Pricing
                </button>

                <button
                    type="button"
                    className={
                        tab === "page" ? "selected" : ""
                    }
                    onClick={() => setTab("page")}
                >
                    Page Content
                </button>

            </div>

            {/* MESSAGES */}

            {error && (
                <p className="sm-error" role="alert">
                    {error}
                </p>
            )}

            {notice && (
                <p className="sm-success" role="status">
                    {notice}
                </p>
            )}

            {loading ? (

                <div className="sm-panel">
                    <p>Loading services from database...</p>
                </div>

            ) : (

                <>
                    {/* =========================
                        SERVICES TAB
                    ========================= */}

                    {tab === "services" && (

                        <>
                            {/* SERVICE FORM */}

                            <form
                                className="sm-panel sm-form"
                                onSubmit={saveService}
                            >

                                <h3>
                                    {editingId
                                        ? "Edit Service"
                                        : "Add Service"}
                                </h3>

                                <label>
                                    Service title

                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        value={draft.title}
                                        onChange={handleServiceChange}
                                        placeholder="Enter service title"
                                    />
                                </label>

                                <label>
                                    Description

                                    <textarea
                                        name="description"
                                        required
                                        rows={3}
                                        value={draft.description}
                                        onChange={handleServiceChange}
                                        placeholder="Enter service description"
                                    />
                                </label>

                                <div className="sm-two">

                                    <label>
                                        Base price (USD)

                                        <input
                                            name="price"
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={draft.price}
                                            onChange={handleServiceChange}
                                        />
                                    </label>

                                    <label>
                                        Price type

                                        <select
                                            name="priceType"
                                            value={draft.priceType}
                                            onChange={handleServiceChange}
                                        >
                                            <option value="starting">
                                                Starting from
                                            </option>

                                            <option value="monthly">
                                                Starting / month
                                            </option>
                                        </select>
                                    </label>

                                </div>

                                <div className="sm-two">

                                    <label>
                                        Sort order

                                        <input
                                            name="sortOrder"
                                            type="number"
                                            required
                                            step="1"
                                            value={draft.sortOrder}
                                            onChange={handleServiceChange}
                                        />
                                    </label>

                                    <label className="sm-check">

                                        <input
                                            name="published"
                                            type="checkbox"
                                            checked={draft.published}
                                            onChange={handleServiceChange}
                                        />

                                        Published on website

                                    </label>

                                </div>

                                <div className="sm-actions">

                                    <button
                                        type="submit"
                                        disabled={busy}
                                    >
                                        {busy
                                            ? "Saving..."
                                            : editingId
                                                ? "Save Service"
                                                : "Add Service"}
                                    </button>

                                    <button
                                        type="button"
                                        className="sm-secondary"
                                        disabled={busy}
                                        onClick={resetServiceForm}
                                    >
                                        Clear
                                    </button>

                                </div>

                            </form>

                            {/* ALL SERVICES */}

                            <div className="sm-panel">

                                <h3>All Services</h3>

                                {services.length === 0 ? (

                                    <p>
                                        No services in database yet.
                                    </p>

                                ) : (

                                    <div className="sm-list">

                                        {services.map((service) => (

                                            <article
                                                className="sm-item"
                                                key={service._id}
                                            >

                                                <div>

                                                    <strong>
                                                        {service.title}
                                                    </strong>

                                                    <p>
                                                        ${service.price} USD
                                                        {" · "}
                                                        {service.priceType}
                                                        {" · "}
                                                        Order {service.sortOrder}
                                                    </p>

                                                    <small>
                                                        {service.published
                                                            ? "Published"
                                                            : "Draft"}
                                                    </small>

                                                </div>

                                                <div className="sm-item-actions">

                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            editService(service)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            togglePublish(service)
                                                        }
                                                    >
                                                        {service.published
                                                            ? "Unpublish"
                                                            : "Publish"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="sm-danger"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            deleteService(service)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </article>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </>

                    )}

                    {/* =========================
                        PAGE CONTENT TAB
                    ========================= */}

                    {tab === "page" && page && (

                        <form
                            className="sm-panel sm-form"
                            onSubmit={savePage}
                        >

                            <h3>Page Content</h3>

                            <p>
                                Edit headings, descriptions,
                                pricing notes and buttons.
                                Changes will appear on the public
                                website after saving to MongoDB.
                            </p>

                            {/* TEXT FIELDS */}

                            <div className="sm-fields">

                                {textFields.map(([key, label]) => (

                                    <label key={key}>

                                        {label}

                                        <textarea
                                            name={key}
                                            rows={
                                                key.toLowerCase().includes(
                                                    "description"
                                                ) ||
                                                key === "pricingNote"
                                                    ? 3
                                                    : 2
                                            }
                                            value={page[key] ?? ""}
                                            onChange={handlePageChange}
                                        />

                                    </label>

                                ))}

                            </div>

                            {/* PROCESS STEPS */}

                            <h3>How We Work — Steps</h3>

                            {(page.processSteps ?? []).map(
                                (step, index) => (

                                    <div
                                        className="sm-step"
                                        key={index}
                                    >

                                        <label>
                                            Step title

                                            <input
                                                type="text"
                                                value={step.title ?? ""}
                                                onChange={(event) =>
                                                    handleStepChange(
                                                        index,
                                                        "title",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label>
                                            Step description

                                            <textarea
                                                rows={2}
                                                value={step.description ?? ""}
                                                onChange={(event) =>
                                                    handleStepChange(
                                                        index,
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            className="sm-secondary"
                                            disabled={busy}
                                            onClick={() =>
                                                removeProcessStep(index)
                                            }
                                        >
                                            Remove Step
                                        </button>

                                    </div>

                                )
                            )}

                            <button
                                type="button"
                                className="sm-secondary"
                                disabled={
                                    busy ||
                                    page.processSteps.length >= 12
                                }
                                onClick={addProcessStep}
                            >
                                + Add Process Step
                            </button>

                            {/* SAVE PAGE */}

                            <div className="sm-actions">

                                <button
                                    type="submit"
                                    disabled={busy}
                                >
                                    {busy
                                        ? "Saving..."
                                        : "Save Page Content"}
                                </button>

                            </div>

                        </form>

                    )}

                </>

            )}

        </div>
    );
};

export default ServicesManager;