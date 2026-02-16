const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}
