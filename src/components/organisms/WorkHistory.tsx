interface Work {
  id: number;
  vehicle: string;
  type: string;
  status: "Asignado" | "En curso" | "Finalizado";
  estimatedTime: string;
  observations?: string;
}


export default function WorkHistory({ works }: { works: Work[] }) {
    return (
        <div className="bg-white p-4 rounded shadow mt-6">
            <h3 className="font-semibold mb-2">Historial de trabajos finalizados</h3>
            {works.length === 0 ? (
                <p>No hay trabajos finalizados todavía.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {works.map(w => (
                        <li key={w.id} className="py-2">
                            <strong>{w.vehicle}</strong> - {w.type} | Observaciones: {w.observations} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
