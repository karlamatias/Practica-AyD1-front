import type { Payment, PaymentDTO } from "../types/payment";
import apiClient from "../utils/apiClient";

export const paymentService = {

    getAllPayment: async () => {
        const data = await apiClient("/payment_methods");
        return data.content || [];
    },
    createPayment: (data: PaymentDTO) => apiClient("/payment_methods", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    updatePayment: (id: number, data: Partial<Payment>) => apiClient(`/payment_methods/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
}