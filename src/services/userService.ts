import type { CreateUserDTO } from "../types/user";
import apiClient from "../utils/apiClient";

export const UserService = {
    create: (data: CreateUserDTO) => apiClient("/users", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getAll: async () => {
        const data = await apiClient("/users");
        return data.content || [];
    },
    getEmployee: async () => {
        const data = await apiClient("/employees");
        return data.content || [];
    },
    update: (id: number, data: Partial<CreateUserDTO>) => apiClient(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiClient(`/users/${id}`, { method: "DELETE" }),

    getMe: async () => {
        const data = await apiClient("/users/me");
        return data;
    },
    update2FA: (use2fa: boolean) => apiClient(`/users/me/update-info`, {
        method: "PUT",
        body: JSON.stringify({ use2fa }),
    }),
};
