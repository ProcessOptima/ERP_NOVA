export const API = "http://158.160.90.163:8000/api";

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    const url = `${API}/${cleanEndpoint}`;

    const access = localStorage.getItem("access");

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(access ? {Authorization: `Bearer ${access}`} : {}),
            ...(options.headers || {}),
        },
    });
}
