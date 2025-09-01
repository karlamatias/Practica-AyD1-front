import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";
import {useState} from "react";
import MaintenanceJobReports from "../../organisms/MaintenanceJobReports.tsx";

type Report = {
    name: string;
    action: () => void;
}

export default function AdminReports() {
 const [showJobModal, setShowJobModal] = useState(false);


 const onJobsReport = () => {
     setShowJobModal(true);
 }

  const reports: Report[] = [
      {name: "Reportes de trabajos", action: onJobsReport}
    // "Ingresos por semana",
    // "Mantenimientos preventivos del mes",
    // "Uso de repuestos por marca",
    // "Historial de trabajos por cliente",
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Reportes</h2>
      <div className="bg-white p-4 rounded shadow space-y-2">
        {reports.map((r) => (
          <div key={r.name} className="flex justify-between items-center p-2 border-b">
            <span>{r.name}</span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={r.action}>Exportar</Button>
          </div>
        ))}
      </div>

        {showJobModal ? <MaintenanceJobReports onClose={() => {
            setShowJobModal(false)
        }} /> : null}
    </AdminLayout>
  );
}
