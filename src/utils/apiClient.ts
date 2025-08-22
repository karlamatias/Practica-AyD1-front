const API_URL = import.meta.env.VITE_API_URL;

async function apiClient(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible. Inicia sesión primero.");

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || `Error en la petición a ${endpoint}`);
    }

    return res.json();
}

export default apiClient;
