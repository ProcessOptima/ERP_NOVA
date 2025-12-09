export const API = "http://localhost:8000/api";

/**
 * fetch, который всегда отправляет cookies HttpOnly
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const url = `${API}/${cleanEndpoint}`;

    return fetch(url, {
        credentials: "include",  // <---- ВАЖНО
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
}
