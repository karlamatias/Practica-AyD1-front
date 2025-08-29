"use client";

import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import Alert from "../atoms/Alert";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

type PayOrderModalProps = {
    orderId: number;
    onClose: () => void;
    onPaid: () => void;
};

export default function PayOrderModal({ orderId, onClose, onPaid }: PayOrderModalProps) {
    const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${orderId}-${Date.now()}`);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    useEffect(() => {
        const loadMethods = async () => {
            try {
                const data = await paymentService.getAllPayment();
                setPaymentMethods(data);
            } catch (err: any) {
                setAlert({ type: "error", message: err.message || "No se pudieron cargar los métodos de pago" });
            }
        };
        loadMethods();
    }, []);

    const handlePay = async () => {
        if (!selectedMethod || !file) {
            setAlert({ type: "error", message: "Selecciona un método de pago y un archivo" });
            return;
        }

        try {
            await orderService.payOrderWithFile(orderId, invoiceNumber, selectedMethod, file);
            setAlert({ type: "success", message: "Orden pagada correctamente" });
            onPaid();
            onClose();
        } catch (err: any) {
            setAlert({ type: "error", message: err.message || "Error al procesar el pago" });
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Fondo con desenfoque ligero */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

            {/* Modal */}
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-full max-w-md z-10">
                <h3 className="text-xl font-semibold mb-5 text-gray-800">Pagar Orden #{orderId}</h3>

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                {/* Número de factura */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">Número de factura:</label>
                    <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Método de pago */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">Método de pago:</label>
                    <select
                        className="border border-gray-300 p-2 w-full rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-400"
                        value={selectedMethod ?? ""}
                        onChange={(e) => setSelectedMethod(Number(e.target.value))}
                    >
                        <option value="">-- Selecciona un método --</option>
                        {paymentMethods.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {/* Archivo */}
                <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700">Archivo (PDF, JPG, PNG):</label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <Button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={handlePay}
                    >
                        Pagar
                    </Button>
                </div>
            </div>
        </div>
    );
}
