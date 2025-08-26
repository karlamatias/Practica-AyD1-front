import { useEffect, useState } from "react";
import AdminLayout from "../../templates/AdminLayout";
import Alert from "../../atoms/Alert";
import InputText from "../../atoms/InputText";
import Button from "../../atoms/Button";
import { FaPlus, FaSave } from "react-icons/fa";
import { FiCheckCircle, FiTrash2, FiXCircle } from "react-icons/fi";
import { quotationService } from "../../../services/quotationService";
import { providerService } from "../../../services/providerService";
import type { QuotationItem, CreateQuotationDTO, Quotation } from "../../../types/quotation";

type Provider = {
    id: number;
    name: string;
};

export default function AdminQuotation() {
    const [items, setItems] = useState<QuotationItem[]>([]);
    const [form, setForm] = useState<QuotationItem>({
        name: "",
        description: "",
        quantity: 1,
    });
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // --- Proveedores ---
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<number[]>([]);

    useEffect(() => {
        loadQuotations();
        loadProviders();
    }, []);

    const loadQuotations = async () => {
        try {
            const data = await quotationService.getAllQuotation();
            setQuotations(data);
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al cargar cotizaciones" });
        }
    };

    const loadProviders = async () => {
        try {
            const data = await providerService.getAllProverdes();
            setProviders(data);
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al cargar proveedores" });
        }
    };

    // --- Ítems ---
    const addItem = () => {
        if (!form.name || !form.description || form.quantity <= 0) {
            setAlert({ type: "error", message: "Completa todos los campos del ítem" });
            return;
        }
        setItems([...items, form]);
        setForm({ name: "", description: "", quantity: 1 });
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // --- Proveedores seleccionados ---
    const addProvider = (id: number) => {
        if (!selectedProviders.includes(id)) {
            setSelectedProviders([...selectedProviders, id]);
        }
    };

    const removeProvider = (id: number) => {
        setSelectedProviders(selectedProviders.filter((p) => p !== id));
    };

    // --- API ---
    const saveQuotation = async () => {
        try {
            const payload: CreateQuotationDTO = {
                items,
                providers: selectedProviders
            };
            await quotationService.createQuotation(payload);
            setItems([]);
            setSelectedProviders([]);
            await loadQuotations();
            setAlert({ type: "success", message: "Cotización creada correctamente" });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al crear la cotización" });
        }
    };

    const closeQuotation = async (id: number) => {
        try {
            await quotationService.closeProvider(id);
            await loadQuotations();
            setAlert({ type: "success", message: "Cotización cerrada" });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al cerrar la cotización" });
        }
    };

    const cancelQuotation = async (id: number) => {
        try {
            await quotationService.cancelProvider(id);
            await loadQuotations();
            setAlert({ type: "success", message: "Cotización cancelada" });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Error al cancelar la cotización" });
        }
    };

    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 2000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Cotización</h2>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* FORMULARIO ITEM */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">Agregar Ítem</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <InputText
                        label="Nombre"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <InputText
                        label="Descripción"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <InputText
                        label="Cantidad"
                        type="number"
                        value={form.quantity}
                        onChange={(e) =>
                            setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
                        }
                    />
                </div>

                {/* PROVEEDORES */}
                <h3 className="font-semibold text-lg">Seleccionar Proveedores</h3>
                <select
                    className="border p-2 rounded w-full md:w-1/3"
                    onChange={(e) => addProvider(Number(e.target.value))}
                >
                    <option value="">-- Seleccionar proveedor --</option>
                    {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* Lista de proveedores seleccionados */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProviders.map((id) => {
                        const prov = providers.find((p) => p.id === id);
                        return (
                            <span
                                key={id}
                                className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                            >
                                {prov?.name || `Proveedor ${id}`}
                                <button
                                    onClick={() => removeProvider(id)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                >
                                    <FiXCircle />
                                </button>
                            </span>
                        );
                    })}
                </div>

                <Button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    <FaPlus /> Agregar Ítem
                </Button>


            </div>

            {/* TABLA DE ÍTEMS */}
            {items.length > 0 && (
                <div className="bg-white p-4 rounded shadow mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Descripción</th>
                                <th className="px-4 py-2 text-left">Cantidad</th>
                                <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{item.description}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => removeItem(idx)}
                                            className="p-1 rounded hover:bg-red-200 text-red-600"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedProviders.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium">Proveedores seleccionados:</h4>
                            <ul className="list-disc pl-5">
                                {selectedProviders.map((id) => {
                                    const prov = providers.find((p) => p.id === id);
                                    return <li key={id}>{prov?.name || `Proveedor ${id}`}</li>;
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* ACCIONES */}
            <div className="flex gap-2 mb-10">
                <Button
                    onClick={saveQuotation}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                >
                    <FaSave /> Guardar Cotización
                </Button>
            </div>

            {/* TABLA DE COTIZACIONES EXISTENTES */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg mb-4">Cotizaciones existentes</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Ítems</th>
                            <th className="px-4 py-2 text-left">Proveedores</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((q) => (
                            <tr key={q.id} className="border-b">
                                <td className="px-4 py-2">{q.id}</td>
                                <td className="px-4 py-2">
                                    <ul className="list-disc pl-4">
                                        {q.items.map((item, i) => (
                                            <li key={i}>
                                                {item.name} - {item.description} ({item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-2">
                                    {q.providers.length > 0 ? (
                                        <ul className="list-disc pl-4">
                                            {q.providers.map((p) => (
                                                <li key={p.id}>
                                                    {p.name} ({p.email})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-gray-500 italic">Sin proveedores</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <Button
                                        onClick={() => closeQuotation(q.id)}
                                        disabled={q.status === "CLOSED" || q.status === "CANCELLED"}
                                        className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                    >
                                        <FiCheckCircle size={16} /> Cerrar
                                    </Button>
                                    <Button
                                        onClick={() => cancelQuotation(q.id)}
                                        disabled={q.status === "CANCELLED"}
                                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                    >
                                        <FiXCircle size={16} /> Cancelar
                                    </Button>
                                </td>

                            </tr>
                        ))}
                        {quotations.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center p-4">
                                    No hay cotizaciones registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
