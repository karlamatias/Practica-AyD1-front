"use client";
import { useState } from "react";
import Button from "../atoms/Button";

interface UseSparePartModalProps {
    isOpen: boolean;
    onClose: () => void;
    maintenanceJobId: number;
    onSuccess?: () => void;
}

const availableSpareParts = [
    { id: 1, name: "Filtro de aceite" },
    { id: 2, name: "Bujía" },
    { id: 3, name: "Correa de distribución" },
];

export default function UseSparePartModal({
    isOpen,
    onClose,
    maintenanceJobId,
    onSuccess,
}: UseSparePartModalProps) {
    const [inventoryItemId, setInventoryItemId] = useState<number>(availableSpareParts[0].id);
    const [quantityUsed, setQuantityUsed] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/job-item-usage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inventoryItemId,
                    maintenanceJobId,
                    quantityUsed,
                }),
            });

            if (!res.ok) throw new Error("Error al registrar uso de repuesto");

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert("No se pudo registrar el repuesto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo transparente con blur */}
            <div
                className="absolute inset-0 bg-white/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-xl p-6 w-96 shadow-lg z-10">
                <h2 className="text-lg font-semibold mb-4">Usar repuesto</h2>

                {/* Select de repuestos */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repuesto
                    </label>
                    <select
                        value={inventoryItemId}
                        onChange={(e) => setInventoryItemId(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        {availableSpareParts.map((part) => (
                            <option key={part.id} value={part.id}>
                                {part.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cantidad usada */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cantidad usada
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={quantityUsed}
                        onChange={(e) => setQuantityUsed(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={loading}>
                        {loading ? "Guardando..." : "Aceptar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
