import EmployeeLayout from "../../templates/EmployeeLayout";

export default function AdminDashboard() {
  return (
    <EmployeeLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Vista general: trabajos y mi perfil.</p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">Trabajos activos</div>
      </div>
    </EmployeeLayout>
  );
}
