import type { InventoryItem } from "../types/intentory";
import apiClient from "../utils/apiClient";

export const sparePartService = {
    getInventoryItems: async (): Promise<InventoryItem[]> => {
        const data = await apiClient("/job-item-usage/inventory-items");
        return data.content || [];
    },

    useSparePart: (maintenanceJobId: number, inventoryItemId: number, quantityUsed: number) =>
        apiClient("/job-item-usage", {
            method: "POST",
            body: JSON.stringify({ maintenanceJobId, inventoryItemId, quantityUsed }),
        }),
};
