import ProviderLayout from "../../templates/ProviderLayout";

export default function ProviderDashboard() {
  return (
    <ProviderLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard Provider</h2>
      <p>Vista general: vehículos, trabajos activos, inventario, usuarios, etc.</p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">Vehículos ingresados</div>
        <div className="bg-white p-4 rounded shadow">Trabajos activos</div>
        <div className="bg-white p-4 rounded shadow">Inventario</div>
      </div>
    </ProviderLayout>
  );
}
