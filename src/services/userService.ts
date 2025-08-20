const API_URL = import.meta.env.VITE_API_URL;

export interface CreateUserDTO {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleId: number;
}

export const UserService = {
    create: async (data: CreateUserDTO) => {
        const token = localStorage.getItem("token");
        console.log("JWT actual:", token)
        if (!token) throw new Error("No hay token disponible. Inicia sesión y verifica el código primero.");

        const res = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.message || "Error al crear el usuario");
        }

        return res.json();
    },

    getAll: async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible. Inicia sesión primero.");

        const res = await fetch(`${API_URL}/users`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudieron cargar los usuarios");

        const json = await res.json();
        return json.content || [];
    },
    update: async (id: number, data: Partial<CreateUserDTO>) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible. Inicia sesión primero.");

        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("No se pudo actualizar el usuario");

        return res.json();
    },

    delete: async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible. Inicia sesión primero.");

        const res = await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.message || "No se pudo eliminar el usuario");
        }

        return res.json();
    },

};
