"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { ClientVehicle } from "../../../types/client";
import { customerService } from "../../../services/customerService";
import ClientWorkList from "../../templates/ClientWorkList";
import CustomerLayout from "../../templates/CustomerLayout";
import { paymentService } from "../../../services/paymentService";
import autoTable from "jspdf-autotable";

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

    const handleApproveService = async (
        approveRequestId: number,
        approveType: string,
        comment: string
    ) => {
        const dataBody = {
            comment,
            status: approveType,
        };
        customerService.approveRequest(approveRequestId, dataBody);
        alert(`Aprobacion actualizada`);
        const data = await customerService.getMyVehicles();
        setVehicles(data);
    };

    const handleLeaveReview = async (
        rating: number,
        jobId: number,
        comment: string
    ) => {
        try {
            await customerService.createRating(jobId, {
                maintenanceJobId: jobId,
                rating,
                comment,
            });
            alert("Review enviada correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al enviar review");
        }
    };

    const handleMakePayment = async (
        InvoiceRequestId: number,
        amount: number,
        paymentMethodId: number
    ) => {
        try {
            await paymentService.createInvoice({
                invoiceRequestId: InvoiceRequestId,
                paymentMethodId,
                amount,
            });
            alert(`Pago de Q${amount} realizado`);
            const data = await customerService.getMyVehicles();
            setVehicles(data);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Error al realizar el pago");
        }
    };

    const handleDownloadInvoice = async (workId: number) => {
        const Invoice = await customerService.getPaymentRequest(workId);
        if (Invoice && Invoice[0] && Invoice[0].status == "COMPLETED") {
            generarFactura(Invoice[0]);
        } else {
            alert("No hay factura disponible para este trabajo");
        }
    };

    return (
        <CustomerLayout>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Mis Vehiculos</h2>

                {vehicles.length === 0 && (
                    <p className="text-gray-600">No tienes vehículos registrados.</p>
                )}

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

const generarFactura = (invoiceRequest: any) => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(16);
    doc.text("FACTURA DE SERVICIO", 14, 20);
    doc.setFontSize(12);
    doc.text(`Factura ID: ${invoiceRequest.id}`, 14, 30);
    doc.text(`Total a pagar: Q${invoiceRequest.amountRequested}`, 14, 38);
    doc.text(`Total pagado: Q${invoiceRequest.totalPaid}`, 14, 46);

    // Pagos realizados
    if (invoiceRequest.invoices?.length) {
        const rows = invoiceRequest.invoices.map((item: any) => [
            `Q${item.amountPaid}`,
            new Date(item.paymentDate).toLocaleDateString(),
            item.paymentMethod?.name,
        ]);

        autoTable(doc, {
            startY: 60,
            head: [["Monto", "Fecha", "Método de Pago"]],
            body: rows,
        });
    }

    // Descargar PDF
    doc.save(`factura_${invoiceRequest.id}.pdf`);
};