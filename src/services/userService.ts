const API_URL = import.meta.env.VITE_API_URL;

export interface CreateUserDTO {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    // role?: string; // pendiente
}

export const UserService = {
    create: async (data: CreateUserDTO) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${localStorage.getItem("token")}` // cuando agregues auth
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Error al crear el usuario");
        return res.json();
    },


};
