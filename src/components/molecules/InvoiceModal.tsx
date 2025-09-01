"use client";

import type { FC } from "react";
import Button from "../atoms/Button";


interface InvoiceModalProps {
    isOpen: boolean;
    amount: string;
    setAmount: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const InvoiceModal: FC<InvoiceModalProps> = ({ isOpen, amount, setAmount, onClose, onSubmit, loading }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold mb-4">Solicitud de pago</h3>
                <input
                    type="number"
                    placeholder="Monto a cobrar"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full border px-2 py-1 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <Button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={onSubmit} disabled={loading}
                    >
                        Pagar
                    </Button>


                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
