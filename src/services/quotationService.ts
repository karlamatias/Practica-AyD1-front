import type { CreateQuotationDTO } from "../types/quotation";
import apiClient from "../utils/apiClient";

export const quotationService = {

    getAllQuotation: async () => {
        const data = await apiClient("/quotation_requests");
        return data.content || [];
    },
    createQuotation: (data: CreateQuotationDTO) => apiClient("/quotation_requests", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    closeProvider: (id: number) => apiClient(`/quotation_requests/close/${id}`, { method: "PUT" }),
    cancelProvider: (id: number) => apiClient(`/quotation_requests/cancel/${id}`, { method: "PUT" }),
    getQuotationProvider: async () => {
        const data = await apiClient("/quotations");
        return data.content || [];
    },
    updateQuotationPrices: (id: number, items: { id: number; price: number }[]) =>
        apiClient(`/quotations/${id}`, {
            method: "PUT",
            body: JSON.stringify({ items }),
        }),
    acceptQuotation: (id: number) => apiClient(`/quotations/accept/${id}`, { method: "PUT" }),
    rejectQuotation: (id: number) => apiClient(`/quotations/reject/${id}`, { method: "PUT" }),
    getQuotationWithPrice: async (id: number) => {
        const data = await apiClient(`/quotation_requests/quotations/${id}`);
        return data || [];
    },
}