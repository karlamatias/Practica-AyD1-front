"use client";
import { useEffect, useState } from "react";
import Alert from "../../atoms/Alert";
import InputText from "../../atoms/InputText";
import Button from "../../atoms/Button";
import { quotationService } from "../../../services/quotationService";
import ProviderLayout from "../../templates/ProviderLayout";

export default function ProviderQuotation() {
    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await quotationService.getQuotationProvider();
                setQuotations(
                    data.map((q: any) => ({
                        ...q,
                        items: q.items.map((i: any) => ({
                            ...i,
                            unitPrice: i.unitPrice ? i.unitPrice.toString() : "",
                        })),
                    }))
                );
            } catch (err) {
                setError("Error cargando cotizaciones");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePriceChange = (
        quotationId: number,
        itemId: number,
        value: string
    ) => {
        setQuotations((prev) =>
            prev.map((q) =>
                q.id === quotationId
                    ? {
                        ...q,
                        items: q.items.map((i: any) =>
                            i.id === itemId ? { ...i, unitPrice: value } : i
                        ),
                    }
                    : q
            )
        );
    };

    const savePrices = async (quotation: any) => {
        try {
            const payload = quotation.items.map((i: any) => ({
                id: i.id,
                price: i.unitPrice === "" ? 0 : parseFloat(i.unitPrice), 
            }));

            await quotationService.updateQuotationPrices(quotation.id, payload);
            alert("Precios guardados correctamente");
        } catch (err) {
            alert("Error guardando precios");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <ProviderLayout>
            <h1 className="text-xl font-bold mb-4">Cotizaciones del Proveedor</h1>
            {quotations.length === 0 ? (
                <Alert message={"No hay cotizaciones disponibles"}></Alert>
            ) : (
                quotations.map((q) => (
                    <div
                        key={q.id}
                        className="border p-4 rounded mb-4 shadow bg-white"
                    >
                        <h2 className="text-lg font-semibold mb-2">
                            Cotización #{q.id} - Estado: {q.status}
                        </h2>
                        <div className="space-y-2">
                            {q.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 border-b pb-2"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <p className="text-sm text-gray-800">
                                            Cantidad: <span className="font-semibold">{item.quantity}</span>
                                        </p>
                                    </div>
                                    <div className="w-28">
                                        <InputText
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                handlePriceChange(q.id, item.id, e.target.value)
                                            }
                                            placeholder="Precio/u"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3">
                            <Button onClick={() => savePrices(q)}>
                                Guardar Precios
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </ProviderLayout>
    );
}
