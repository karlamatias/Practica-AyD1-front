import type { ClientVehicle } from "../types/client";
import type { Ratings } from "../types/ratings";
import apiClient from "../utils/apiClient";

export const customerService = {
  getMyVehicles: async (): Promise<ClientVehicle[]> => {
    const data = await apiClient("/client/vehicles");
    // Devuelve el array directo, sin buscar .content
    return Array.isArray(data) ? data : [];
  },
  createRating: (maintenanceJob: number, data: Ratings) =>
    apiClient(`/client/vehicles/service-ratings/${maintenanceJob}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPaymentRequest: (maintenanceJob: number) =>
    apiClient(`/invoice-requests/maintenance-job/${maintenanceJob}`, {
      method: "GET",
    }),

  getApprovalByMaintenaceJob: (maintenanceJob: number) =>
    apiClient(`/client/approval_requests/maitenance_job/${maintenanceJob}`, {
      method: "GET",
    }),

  approveRequest: (requestId: number, data: any) =>
    apiClient(`/client/approval_requests/change_status/${requestId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
