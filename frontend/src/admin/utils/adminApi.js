const API_URL = ( import.meta.env.VITE_API_URL || "http://localhost:5000" ).replace(/\/$/, "");
let csrfToken = null;

export const setAdminCsrfToken = (token) => { csrfToken = token || null; };

export const adminApi = async (path, options = {}) => {
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers = {
        ...(
            options.body && !isFormData
            ? { "Content-Type": "application/json" }
            : {}
        ),
        ...options.headers,
    };

    // Let the browser set multipart/form-data boundary automatically.
    if (isFormData) {
        delete headers["Content-Type"];
        delete headers["content-type"];
    }

    if (
        csrfToken &&
        !["GET", "HEAD"].includes((options.method || "GET").toUpperCase())
    ) {
        headers["X-CSRF-Token"] = csrfToken;
    }

    const response = await fetch(`${API_URL}/api${path}`, {
        ...options,
        credentials: "include",
        cache: "no-store",
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || `Request failed (${response.status})`
        );
    }

    return data;
};

export const getAdminSession = async () => {
    const data = await adminApi("/admin/me");
    setAdminCsrfToken(data.csrfToken);
    return data;
};