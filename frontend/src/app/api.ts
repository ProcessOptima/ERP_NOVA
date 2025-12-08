export const API = "http://127.0.0.1:8000/api";

/**
 * Универсальный fetch с автоматическим Bearer токеном.
 */
export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("access") : null;

    // Важно: вместо HeadersInit используем обычный объект
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Корректная сборка URL
    let url: string;

    if (/^https?:\/\//i.test(endpoint)) {
        url = endpoint;
    } else {
        const cleanApi = API.replace(/\/+$/, ""); // без слэшей в конце
        const cleanEndpoint = endpoint.replace(/^\/+/, ""); // без слэшей в начале
        url = `${cleanApi}/${cleanEndpoint}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}
