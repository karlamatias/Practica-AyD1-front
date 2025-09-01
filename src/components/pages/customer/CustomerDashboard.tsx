"use client";

import { useEffect, useState } from "react";
import type { ClientVehicle } from "../../../types/client";
import { customerService } from "../../../services/customerService";
import ClientWorkList from "../../templates/ClientWorkList";
import CustomerLayout from "../../templates/CustomerLayout";
import { paymentService } from "../../../services/paymentService";

export default function ClientDashboard() {
    const [vehicles, setVehicles] = useState<ClientVehicle[]>([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await customerService.getMyVehicles();
                setVehicles(data);
            } catch (err) {
                console.error("Error al cargar vehículos", err);
            }
        };
        fetchVehicles();
    }, []);

    const handleApproveService = async (workId: number) => {
        alert("Servicio aprobado: " + workId);
    };

    const handleLeaveReview = async (rating: number, jobId: number, comment: string) => {
        try {
            await customerService.createRating(jobId, { maintenanceJobId: jobId, rating, comment });
            alert("Review enviada correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al enviar review");
        }
    };

    const handleMakePayment = async (workId: number, amount: number, paymentMethodId: number) => {
        try {
            await paymentService.createInvoice({
                invoiceRequestId: workId,
                paymentMethodId,
                amount,
            });
            alert(`Pago de Q${amount} realizado para trabajo ${workId}`);
            const data = await customerService.getMyVehicles();
            setVehicles(data);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Error al realizar el pago");
        }
    };

    const handleDownloadInvoice = async (workId: number) => {
        alert(`Descargando factura para trabajo ${workId}`);
    };

    return (
        <CustomerLayout>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Mis Vehiculos</h2>

                {vehicles.length === 0 && <p className="text-gray-600">No tienes vehículos registrados.</p>}

                {vehicles.map((vehicle) => (
                    <ClientWorkList
                        key={vehicle.id}
                        vehicle={`${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`}
                        works={vehicle.jobs}
                        onApproveService={handleApproveService}
                        onLeaveReview={handleLeaveReview}
                        onMakePayment={handleMakePayment}
                        onDownloadInvoice={handleDownloadInvoice}
                    />
                ))}
            </div>
        </CustomerLayout>
    );
}
