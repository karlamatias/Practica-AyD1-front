import Button from "../../atoms/Button";
import AdminLayout from "../../templates/AdminLayout";

export default function AdminReports() {
  const reports = [
    "Ingresos por semana",
    "Mantenimientos preventivos del mes",
    "Uso de repuestos por marca",
    "Historial de trabajos por cliente",
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Reportes</h2>
      <div className="bg-white p-4 rounded shadow space-y-2">
        {reports.map((r, i) => (
          <div key={i} className="flex justify-between items-center p-2 border-b">
            <span>{r}</span>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Exportar</Button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
