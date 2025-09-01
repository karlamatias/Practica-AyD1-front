"use client";

import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { sparePartService } from "../../services/sparePartService";
import type { InventoryItem } from "../../types/intentory";


interface UseSparePartModalProps {
    isOpen: boolean;
    onClose: () => void;
    maintenanceJobId: number;
     onSuccess?: (message: string) => void;
}

export default function UseSparePartModal({
    isOpen,
    onClose,
    maintenanceJobId,
    onSuccess,
}: UseSparePartModalProps) {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [inventoryItemId, setInventoryItemId] = useState<number | null>(null);
    const [quantityUsed, setQuantityUsed] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    // Cargar repuestos al abrir modal
    useEffect(() => {
        if (!isOpen) return;

        const fetchInventoryItems = async () => {
            try {
                const items = await sparePartService.getInventoryItems();
                setInventoryItems(items);
                if (items.length > 0) setInventoryItemId(items[0].id);
            } catch (err) {
                console.error("Error cargando repuestos", err);
                alert("No se pudieron cargar los repuestos disponibles");
            }
        };

        fetchInventoryItems();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!inventoryItemId) return alert("Selecciona un repuesto");

        setLoading(true);
        try {
            await sparePartService.useSparePart(maintenanceJobId, inventoryItemId, quantityUsed);
            onSuccess?.("Solicitud de repuesto correcta");
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
            <div
                className="absolute inset-0 bg-white/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-xl p-6 w-96 shadow-lg z-10">
                <h2 className="text-lg font-semibold mb-4">Usar repuesto</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Repuesto
                    </label>
                    <select
                        value={inventoryItemId ?? ""}
                        onChange={(e) => setInventoryItemId(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        {inventoryItems.map((part) => (
                            <option key={part.id} value={part.id}>
                                {part.name}
                            </option>
                        ))}
                    </select>
                </div>

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
