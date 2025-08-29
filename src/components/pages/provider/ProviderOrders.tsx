"use client";

import { useEffect, useState } from "react";
import Alert from "../../atoms/Alert";
import Button from "../../atoms/Button";
import { orderService } from "../../../services/orderService";
import ProviderLayout from "../../templates/ProviderLayout";
import { FaTruck, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Provider = {
    id: number;
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
};

type QuotationRequest = {
    id: number;
    createdAt: string;
};

type Invoice = {
    id: number | null;
    number: string | null;
    totalAmount: number | null;
    paymentMethodId: number | null;
    fileUrl: string | null;
    issuedAt: string | null;
};

type Order = {
    id: number;
    totalAmount: number;
    provider: Provider;
    quotationRequest: QuotationRequest;
    invoice: Invoice;
    status: "PENDING" | "PAID" | "CANCELLED" | "DELIVERED" | "DELAYED" | "COMPLETED";
};

export default function ProviderOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al cargar las órdenes" });
        }
    };

    const handleStatusChange = async (
        orderId: number,
        action: "DELIVERED" | "DELAYED" | "COMPLETED" | "CANCELLED"
    ) => {
        try {
            switch (action) {
                case "DELIVERED":
                    await orderService.markDelivered(orderId);
                    break;
                case "DELAYED":
                    await orderService.markDelayed(orderId);
                    break;
                case "COMPLETED":
                    await orderService.markCompleted(orderId);
                    break;
                case "CANCELLED":
                    await orderService.markCancelled(orderId);
                    break;
            }
            setAlert({ type: "success", message: `Orden ${orderId} actualizada a ${action}` });
            await loadOrders();
        } catch (err: any) {
            setAlert({ type: "error", message: err.message || "Error al actualizar el estado" });
        }
    };

    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 3000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <ProviderLayout>
            <h2 className="text-2xl font-bold mb-4">Órdenes del proveedor</h2>

            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">ID Orden</th>
                            <th className="px-4 py-2 text-left">Proveedor</th>
                            <th className="px-4 py-2 text-left">ID Cotización</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-4 py-2">{order.id}</td>
                                <td className="px-4 py-2">{order.provider.name}</td>
                                <td className="px-4 py-2">{order.quotationRequest.id}</td>
                                <td className="px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                                <td className="px-4 py-2">{order.status}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    {order.status === "PAID" && (
                                        <>
                                            <Button
                                                onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                title="Entregado"
                                            >
                                                <FaTruck size={16} />
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusChange(order.id, "DELAYED")}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                                title="Retrasado"
                                            >
                                                <FaClock size={16} />
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusChange(order.id, "COMPLETED")}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                title="Completado"
                                            >
                                                <FaCheckCircle size={16} />
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                title="Cancelar"
                                            >
                                                <FaTimesCircle size={16} />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No hay órdenes registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ProviderLayout>
    );
}
