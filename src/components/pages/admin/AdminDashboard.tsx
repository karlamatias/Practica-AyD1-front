import AdminLayout from "../../templates/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Vista general: vehículos, trabajos activos, inventario, usuarios, etc.</p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">Vehículos ingresados</div>
        <div className="bg-white p-4 rounded shadow">Trabajos activos</div>
        <div className="bg-white p-4 rounded shadow">Inventario</div>
      </div>
    </AdminLayout>
  );
}
