"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../templates/AdminLayout";
import Alert from "../../atoms/Alert";
import Button from "../../atoms/Button";
import { FaCreditCard } from "react-icons/fa";
import { orderService } from "../../../services/orderService";
import PayOrderModal from "../../molecules/PayOrderModal";


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
    status: "PENDING" | "PAID" | "CANCELLED";
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

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

    const openPayModal = (orderId: number) => {
        setCurrentOrderId(orderId);
        setShowPayModal(true);
    };

    const handlePaid = async () => {
        setAlert({ type: "success", message: "Orden pagada correctamente" });
        await loadOrders();
    };

    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 3000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Órdenes</h2>

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
                                    <Button
                                        onClick={() => openPayModal(order.id)}
                                        disabled={order.status !== "PENDING"}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                    >
                                        <FaCreditCard size={16} /> Pagar
                                    </Button>
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

            {/* Modal de pago */}
            {showPayModal && currentOrderId && (
                <PayOrderModal
                    orderId={currentOrderId}
                    onClose={() => setShowPayModal(false)}
                    onPaid={handlePaid}
                />
            )}
        </AdminLayout>
    );
}
