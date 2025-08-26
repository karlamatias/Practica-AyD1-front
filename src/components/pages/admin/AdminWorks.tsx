import { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import InputText from "../../atoms/InputText";
import AdminLayout from "../../templates/AdminLayout";
import ConfirmModal from "../../molecules/ConfirmModal";
import type { Vehicle, CreateVehicleDTO } from "../../../types/vehicle";
import { vehicleService } from "../../../services/vehicleService";
import { UserService } from "../../../services/userService";
import type { Employee, User } from "../../../types/user";
import { UserRoleId } from "../../../constants/roles";
import Select from "react-select";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSave } from "react-icons/fa";
import Alert from "../../atoms/Alert";
import type { CreateJobDTO, Job, JobForm } from "../../../types/jobs";
import { jobsService } from "../../../services/jobsService";

export default function AdminVehicles() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [employees, setEmployed] = useState<Employee[]>([]);
    const [form, setForm] = useState<Omit<JobForm, "id">>({
        vehicleId: 0,
        employeeAssignedId: 0,
        description: "",
        startDate: "",
        endDate: "",
        jobType: "CORRECTIVE"
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const toBackendDate = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');

        const offsetHours = -6; // Guatemala UTC-6
        const offsetSign = offsetHours >= 0 ? "+" : "-";
        const offsetStr = `${offsetSign}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;

        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offsetStr}`;
    };

    const formatForInput = (isoStr: string) => {
        if (!isoStr) return "";
        const d = new Date(isoStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };



    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const allUsers: Employee[] = await UserService.getEmployee();

                setEmployed(allUsers);
            } catch (error: any) {
                console.error("Error al cargar empleados:", error.message || error);
            }
        };
        fetchEmployee();
    }, []);

    // Cargar vehículos
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const allVehicles = await vehicleService.getAllVehicle();
                setVehicles(allVehicles);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los vehículos." });
            }
        };
        fetchVehicles();
    }, []);

    // Cargar trabajos
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const alljobs = await jobsService.getAllJobs();
                setJobs(alljobs);
            } catch (error: any) {
                setAlert({ type: "error", message: error.message || "No se pudieron cargar los trabajos." });
            }
        };
        fetchJobs();
    }, []);


    // Detectar cambios al editar
    useEffect(() => {
        if (editingId !== null) {
            const original = jobs.find(v => v.id === editingId);
            setHasChanges(original ? JSON.stringify(original) !== JSON.stringify(form) : false);
        }
    }, [form, editingId, jobs]);

    // Validación
    const validateForm = (form: Omit<JobForm, "id">, isEditing: boolean): string | null => {
        if (!form.vehicleId) return "Debes seleccionar un vehiculo.";
        if (!form.employeeAssignedId) return "Debes seleccionar un empleado.";
        if (!form.description) return "El campo Descripción es obligatorio.";
        if (!form.startDate) return "El campo Fecha de inicio es obligatorio.";
        if (!form.endDate) return "El campo Fecha de finalizacion es obligatorio.";
        if (!form.jobType) return "El campo Tipo de trabajo es obligatorio.";
        return null;
    };

    // Crear o actualizar trabajo
    const handleAddOrUpdateJob = async () => {
        const errorMsg = validateForm(form, editingId !== null);
        if (errorMsg) {
            setAlert({ type: "error", message: errorMsg });
            return;
        }

        try {
            // Convertir fechas a formato ISO
            const payload: CreateJobDTO = {
                vehicleId: form.vehicleId,
                employeeAssignedId: form.employeeAssignedId,
                description: form.description,
                jobType: form.jobType,
                startDate: toBackendDate(form.startDate),
                endDate: toBackendDate(form.endDate)
            };

            let job: Job;

            if (editingId !== null) {
                job = await jobsService.updateJobs(editingId, payload);
                setJobs(jobs.map(v => v.id === editingId ? job : v));
                setAlert({ type: "success", message: `Trabajo "${job.id}" actualizado correctamente.` });
                setEditingId(null);
            } else {
                job = await jobsService.createJobs(payload);
                setJobs([...jobs, job]);
                setAlert({ type: "success", message: `Trabajo "${job.id}" creado correctamente.` });
            }
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error." });
        } finally {
            setForm({ vehicleId: 0, employeeAssignedId: 0, description: "", startDate: "", endDate: "", jobType: "CORRECTIVE" });
            setHasChanges(false);
        }
    };


    // Eliminar vehículo
    const handleDeleteJob = async () => {
        if (confirmDeleteId === null) return;
        try {
            await jobsService.deleteJobs(confirmDeleteId);
            setJobs(jobs.filter(v => v.id !== confirmDeleteId));
            setAlert({ type: "success", message: "Trabajo eliminado correctamente." });
        } catch (error: any) {
            setAlert({ type: "error", message: error.message || "Ocurrió un error al eliminar el trabajo." });
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // Editar vehículo
    const handleEditClick = (job: Job) => {
        setEditingId(job.id);
        setForm({
            vehicleId: job.vehicle.id,
            employeeAssignedId: job.employeeAssigned.id,
            description: job.description,
            startDate: formatForInput(job.startDate),
            endDate: formatForInput(job.endDate),
            jobType: job.jobType
        });
    };


    // Función para limpiar formulario
    const resetForm = () => {
        setForm({ vehicleId: 0, employeeAssignedId: 0, description: "", startDate: "", endDate: "", jobType: "" });
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
            <h2 className="text-2xl font-bold mb-4">Trabajos</h2>

            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            {/* FORMULARIO */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-2">
                <h3 className="font-semibold text-lg">{editingId ? "Editar trabajo" : "Agregar nuevo trabajo"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Select Vehículo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
                        <Select
                            options={vehicles.map(v => ({ value: v.id, label: `${v.brand} ${v.model} - ${v.licensePlate}` }))}
                            value={
                                vehicles.find(v => v.id === form.vehicleId)
                                    ? {
                                        value: form.vehicleId,
                                        label: `${vehicles.find(v => v.id === form.vehicleId)?.brand} ${vehicles.find(v => v.id === form.vehicleId)?.model} - ${vehicles.find(v => v.id === form.vehicleId)?.licensePlate}`
                                    }
                                    : null
                            }
                            onChange={selected => setForm({ ...form, vehicleId: selected?.value || 0 })}
                            placeholder="Selecciona un vehículo"
                        />

                    </div>

                    {/* Select Empleado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                        <Select
                            options={employees.map(e => ({
                                value: e.id,
                                label: `${e.user.firstname} ${e.user.lastname} - ${e.specialization?.name || "Sin especialización"}`
                            }))}
                            value={
                                (() => {
                                    const emp = employees.find(e => e.id === form.employeeAssignedId);
                                    if (!emp) return null;
                                    return {
                                        value: emp.id,
                                        label: `${emp.user.firstname} ${emp.user.lastname} - ${emp.specialization?.name || "Sin especialización"}`
                                    };
                                })()
                            }
                            onChange={selected => setForm({ ...form, employeeAssignedId: selected?.value || 0 })}
                            placeholder="Selecciona un empleado"
                        />
                    </div>

                    {/* Select Tipo de trabajo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de trabajo</label>
                        <Select
                            options={[
                                { value: "CORRECTIVE", label: "Correctivo" },
                                { value: "PREVENTIVE", label: "Preventivo" }
                            ]}
                            value={{ value: form.jobType, label: form.jobType === "CORRECTIVE" ? "Correctivo" : "Preventivo" }}
                            onChange={selected => setForm({ ...form, jobType: selected?.value || "CORRECTIVE" })}
                        />
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    {/* Fechas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                        <InputText
                            type="datetime-local"
                            label="Fecha de inicio"
                            value={form.startDate}
                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                        <InputText
                            type="datetime-local"
                            label="Fecha de finalización"
                            value={form.endDate}
                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                        />
                    </div>
                </div>

                <Button
                    onClick={handleAddOrUpdateJob}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {editingId ? <FaSave /> : <FaPlus />}
                    {editingId ? "Actualizar" : "Agregar"}
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

            {/* TABLA DE TRABAJOS */}
            <div className="bg-white p-4 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Vehículo</th>
                            <th className="px-4 py-2 text-left">Empleado</th>
                            <th className="px-4 py-2 text-left">Tipo</th>
                            <th className="px-4 py-2 text-left">Descripción</th>
                            <th className="px-4 py-2 text-left">Inicio</th>
                            <th className="px-4 py-2 text-left">Fin</th>
                            <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td className="px-4 py-2">
                                    {job.vehicle.brand} {job.vehicle.model} - {job.vehicle.licensePlate}
                                </td>
                                <td className="px-4 py-2">
                                    {job.employeeAssigned.user.firstname} {job.employeeAssigned.user.lastname} - {job.employeeAssigned.specialization?.name || "Sin especialización"}
                                </td>
                                <td className="px-4 py-2">{job.jobType}</td>
                                <td className="px-4 py-2">{job.description}</td>
                                <td className="px-4 py-2">{job.startDate}</td>
                                <td className="px-4 py-2">{job.endDate}</td>
                                <td className="px-4 py-2 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditClick(job)}
                                        className="p-1 rounded hover:bg-yellow-200 text-yellow-600"
                                        title="Editar"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(job.id)}
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
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {confirmDeleteId !== null && (
                <ConfirmModal
                    title="Eliminar trabajo"
                    subtitle="Esta acción no se puede deshacer"
                    message="¿Estás seguro que deseas eliminar este trabajo?"
                    onConfirm={handleDeleteJob}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </AdminLayout>
    );
}