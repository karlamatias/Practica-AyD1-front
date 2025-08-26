import { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import AdminLayout from "../../templates/AdminLayout";
import ConfirmModal from "../../molecules/ConfirmModal";
import type { Vehicle, CreateVehicleDTO } from "../../../types/vehicle";
import { vehicleService } from "../../../services/vehicleService";
import Select from "react-select";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSave } from "react-icons/fa";
import Alert from "../../atoms/Alert";
import type { Payment, PaymentDTO } from "../../../types/payment";
import { paymentService } from "../../../services/paymentService";

export default function AdminPayment() {
    const [payments, setPayment] = useState<Payment[]>([]);
    const [form, setForm] = useState<Omit<Payment, "id">>({
        name: "",
        description: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Cargar metodos de pago
    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const allPayment = await paymentService.getAllPayment();
                setPayment(allPayment);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los metodos de pago." });
            }
        };
        fetchPayment();
    }, []);

    // Detectar cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = payments.find(p => p.id === editingId);
            setHasChanges(original ? JSON.stringify(original) !== JSON.stringify(form) : false);
        }
    }, [form, editingId, payments]);

    // Validación
    const validateForm = (form: Omit<Payment, "id">, isEditing: boolean): string | null => {
        if (!form.name) return "El nombre es obligatorio.";
        if (!form.description) return "El campo Descripción es obligatorio.";
        return null;
    };

    // Crear o actualizar metodo de pago
    const handleAddOrUpdatePayment = async () => {
        const errorMsg = validateForm(form, editingId !== null);
        if (errorMsg) {
            setAlert({ type: "error", message: errorMsg });
            return;
        }

        try {
            let payment: Payment;

            if (editingId !== null) {
                payment = await paymentService.updatePayment(editingId, form);
                setPayment(payments.map(p => p.id === editingId ? payment : p));
                setAlert({ type: "success", message: `Metodo de pago "${payment.name}" actualizado correctamente.` });
                setEditingId(null);
            } else {
                payment = await paymentService.createPayment(form as PaymentDTO);
                setPayment([...payments, payment]);
                setAlert({ type: "success", message: `Metodo de pago "${payment.name}" creado correctamente.` });
            }
        } catch (error: any) {
            console.log(payments)
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        } finally {
            setForm({ name: "", description: "" });
            setHasChanges(false);
        }
    };

    // Editar metodo de pago
    const handleEditClick = (payment: Payment) => {
        setEditingId(payment.id);
        setForm({
            name: payment.name,
            description: payment.description
        });
    };

    // Función para limpiar formulario
    const resetForm = () => {
        setForm({ name: "", description: "" });
        setEditingId(null);
        setHasChanges(false);
    };

    // Al mostrar la alerta, la cerramos automáticamente
    useEffect(() => {
        if (!alert) return;
        const timer = setTimeout(() => setAlert(null), 2000);
        return () => clearTimeout(timer);
    }, [alert]);

    return (
        <AdminLayout>
            <h2 className="text-2xl font-bold mb-4">Metodos de pago</h2>

            {/* ALERTA */}
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}


            {/* FORMULARIO */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">
                    {editingId !== null ? "Editar metodo de pago" : "Agregar nuevo metodo de pago"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <InputText label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <InputText label="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <Button
                    onClick={handleAddOrUpdatePayment}
                    disabled={editingId !== null && !hasChanges}
                    className={`
                        flex items-center gap-2 px-5 py-2 rounded-lg
                        text-white font-semibold shadow-md
                        transition-all duration-200
                        ${editingId !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    {editingId !== null ? <FaSave /> : <FaPlus />}
                    {editingId !== null ? "Actualizar" : "Agregar"}
                </Button>

                {editingId !== null && (
                    <Button
                        onClick={resetForm}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black font-semibold shadow-md transition-all duration-200"
                    >
                        Cancelar
                    </Button>
                )}
            </div>

            {/* TABLA DE metodos de pago */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Descripcion</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2">{p.description}</td>
                                <td className="px-4 py-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditClick(p)}
                                        className="p-1 rounded hover:bg-yellow-200 text-yellow-600"
                                        title="Editar"
                                    >
                                        <FiEdit size={18} />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </AdminLayout>
    );
}
