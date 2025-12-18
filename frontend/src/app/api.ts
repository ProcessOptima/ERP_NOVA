export const API = "http://158.160.90.163:8000/api";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const url = `${API}/${cleanEndpoint}`;

    return fetch(url, {
        ...options,
        credentials: "include",   // 🔴 КЛЮЧЕВО
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
}
