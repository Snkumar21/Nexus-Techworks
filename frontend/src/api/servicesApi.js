
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export async function servicesRequest(
  path,
  options = {}
) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const response = await fetch(
    `${API_BASE_URL}/api${normalizedPath}`,
    {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed (${response.status}): ${normalizedPath}`
    );
  }

  return data;
}