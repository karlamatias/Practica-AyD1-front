import apiClient from "../utils/apiClient";

export const orderService = {
    getAllOrders: async () => {
        const data = await apiClient("/purchase_orders");
        return data || [];
    },

    payOrderWithFile: async (
        orderId: number,
        invoiceNumber: string,
        paymentMethodId: number,
        file: File
    ) => {
        // Convertir archivo a Base64
        const toBase64 = (file: File) =>
            new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve((reader.result as string).split(",")[1]);
                reader.onerror = (error) => reject(error);
            });

        const fileBase64 = await toBase64(file);

        const issuedAt = new Date().toISOString().split(".")[0];

        const payload = {
            file: fileBase64,
        };

        return apiClient(`/purchase_orders_invoice?purchaseOrderId=${orderId}&invoiceNumber=${invoiceNumber}&paymentMethodId=${paymentMethodId}&issuedAt=${issuedAt}`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    markDelivered: async (id: number) => {
        return apiClient(`/purchase_orders/delivered/${id}`, { method: "PUT" });
    },

    markDelayed: async (id: number) => {
        return apiClient(`/purchase_orders/delayed/${id}`, { method: "PUT" });
    },

    markCompleted: async (id: number) => {
        return apiClient(`/purchase_orders/completed/${id}`, { method: "PUT" });
    },

    markCancelled: async (id: number) => {
        return apiClient(`/purchase_orders/cancel/${id}`, { method: "PUT" });
    }
};
