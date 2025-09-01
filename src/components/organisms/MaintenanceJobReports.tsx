import Modal from "../molecules/Modal.tsx";
import {useEffect, useMemo, useState} from "react";
import type {Vehicle} from "../../types/vehicle.ts";
import {vehicleService} from "../../services/vehicleService.ts";
import Select from "react-select";
import InputText from "../atoms/InputText.tsx";
import Button from "../atoms/Button.tsx";
import {FaDownload} from "react-icons/fa";
import Alert from "../atoms/Alert.tsx";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
    onClose: () => void,
}

type JobForm = {
    vehicleId: number;
    startDate: string;
    endDate: string;
    status: string;
}

type Status = {
    label: string;
    value: string;
}
const MaintenanceJobReports = ({onClose}: Props) => {

    const toBackendDate = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        const offsetHours = -6;
        const offsetSign = offsetHours >= 0 ? "+" : "-";
        const offsetStr = `${offsetSign}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offsetStr}`;
    };

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [form, setForm] = useState<Omit<JobForm, "id">>({
        vehicleId: 0,
        startDate: "",
        endDate: "",
        status: "",
    });

    const [alert, setAlert] = useState<string>();

    const statuses: Status[] = useMemo(() => {
        return [
            {value: "PENDING", label: "Pendiente"},
            {value: "INPROGRESS", label: "En progreso"},
            {value: "COMPLETED", label: "Completado"},
            {value: "CANCELLED", label: "Cancelado"},
            {value: "PAID", label: "Pagado"},
            {value: "DELAYED", label: "Regtrasado"},
        ];
    }, []);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const allVehicles = await vehicleService.getAllVehicle();
                setVehicles(allVehicles);
            } catch (error: any) {

            }
        };
        fetchVehicles();
    }, []);

    const handleExport = async () => {
        const params: Record<string, any> = {};
        if (form.status) {
            params["status"] = form.status;
        }

        if (form.vehicleId) {
            params["vehicleId"] = form.vehicleId;
        }

        if (form.startDate) {
            params["startDate"] = toBackendDate(form.startDate);
        }

        if (form.endDate) {
            params["endDate"] = toBackendDate(form.endDate);
        }

        await downloadFile(`${API_URL}/jobs/export`, params, "ReporteJobs");
    }

    async function downloadFile(
        url: string,
        params: Record<string, any>,
        filename: string
    ): Promise<void> {
        // Construir query string con los params no nulos
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                queryParams.append(key, String(value));
            }
        });

        // Armar URL final
        const finalUrl = queryParams.toString() ? `${url}?${queryParams}` : url;

        try {
            const response = await fetch(finalUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la descarga: ${response.statusText}`);
            }

            // Recibir blob
            const blob = await response.blob();

            // Crear link para descarga
            const link = document.createElement("a");
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = filename;

            // Simular click para descargar
            document.body.appendChild(link);
            link.click();

            // Limpieza
            link.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            setAlert("No hay elementos para exportar");
            console.error("Error descargando archivo:", err);
        }
    }


    return (
        <Modal onClose={onClose}>
            <div className="">
                {alert && <Alert type={"error"} message={alert} onClose={() => setAlert("")} />}
                <h2 className="mb-3">Reportes de trabajos</h2>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
                    <Select
                        options={vehicles.map(v => ({value: v.id, label: `${v.brand} ${v.model} - ${v.licensePlate}`}))}
                        isClearable={true}
                        value={
                            vehicles.find(v => v.id === form.vehicleId)
                                ? {
                                    value: form.vehicleId,
                                    label: `${vehicles.find(v => v.id === form.vehicleId)?.brand} ${vehicles.find(v => v.id === form.vehicleId)?.model} - ${vehicles.find(v => v.id === form.vehicleId)?.licensePlate}`
                                }
                                : null
                        }
                        onChange={selected => setForm({...form, vehicleId: selected?.value || 0})}
                        placeholder="Selecciona un vehículo"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <Select
                        className="mb-3"
                        options={statuses.map(v => ({value: v.value, label: v.label}))}
                        isClearable={true}
                        value={
                            statuses.find(v => v.value === form.status)
                                ? {
                                    value: form.status,
                                    label: statuses.find(v => v.value === form.status)?.label
                                }
                                : null
                        }
                        onChange={selected => setForm({...form, status: selected?.value || ""})}
                        placeholder="Selecciona un estado"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                    <InputText
                        type="datetime-local"
                        value={form.startDate}
                        onChange={e => setForm({ ...form, startDate: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                    <InputText
                        type="datetime-local"
                        value={form.endDate}
                        onChange={e => setForm({ ...form, endDate: e.target.value })}
                    />
                </div>
                <div className="mb-3 flex items-center justify-center">
                    <Button
                        onClick={handleExport}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 bg-green-500 hover:bg-green-600`}
                    >
                        <FaDownload />
                        Exportar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default MaintenanceJobReports;