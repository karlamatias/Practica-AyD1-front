import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";
import { useState } from "react";
import MaintenanceJobReports from "../../organisms/MaintenanceJobReports.tsx";
import Modal from "../../molecules/Modal.tsx";
const API_URL = import.meta.env.VITE_API_URL;
type Report = {
  name: string;
  action: () => void;
};

export default function AdminReports() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showModalClient, setShowModalClient] = useState(false);
  const [clientId, setClientId] = useState(0);
  const onJobsReport = () => {
    setShowJobModal(true);
  };

  const onRatingClient = async () => {
    await downloadFile(
      `${API_URL}/client/export-ratings`,
      "Ratings por cliente.xlsx"
    );
  };

  const onServiceClient = async () => {
    await downloadFile(
      `${API_URL}/client/export-services`,
      "Servicios por cliente"
    );
  };
  const reports: Report[] = [
    { name: "Reportes de trabajos", action: onJobsReport },
    { name: "Reporte de rating de clientes", action: onRatingClient },
    { name: "Reporte de servicios por cliente", action: onServiceClient },
    // "Ingresos por semana",
    // "Mantenimientos preventivos del mes",
    // "Uso de repuestos por marca",
    // "Historial de trabajos por cliente",
  ];

  async function downloadFile(url: string, filename: string): Promise<void> {
    // Construir query string con los params no nulos

    // Armar URL final
    const finalUrl = url;

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
      alert("No hay elementos para exportar");
      console.error("Error descargando archivo:", err);
    }
  }
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Reportes</h2>
      <div className="bg-white p-4 rounded shadow space-y-2">
        {reports.map((r) => (
          <div
            key={r.name}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>{r.name}</span>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={r.action}
            >
              Exportar
            </Button>
          </div>
        ))}
      </div>

      {showJobModal ? (
        <MaintenanceJobReports
          onClose={() => {
            setShowJobModal(false);
          }}
        />
      ) : null}
    </AdminLayout>
  );
}
