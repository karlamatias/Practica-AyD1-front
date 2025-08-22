import Button from "../atoms/Button";

interface Work {
    id: number;
    vehicle: string;
    type: string;
    status: "Asignado" | "En curso" | "Finalizado";
    estimatedTime: string;
    observations?: string;
}


interface Props {
    work: Work;
    onStart: () => void;
    onRegisterProgress: () => void;
    onFinish: () => void;
    onReportIssue: (type: string) => void;
}

export default function WorkCard({ work, onStart, onRegisterProgress, onFinish, onReportIssue }: Props) {
    const statusColor = {
        "Asignado": "bg-yellow-200 text-yellow-800",
        "En curso": "bg-blue-200 text-blue-800",
        "Finalizado": "bg-green-200 text-green-800",
    };

    return (
        <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold">{work.vehicle}</h3>
                <p><strong>Tipo:</strong> {work.type}</p>
                <p className={`inline-block px-2 py-1 rounded ${statusColor[work.status]}`}>{work.status}</p>
                <p><strong>Tiempo estimado:</strong> {work.estimatedTime}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {work.status === "Asignado" && <Button onClick={onStart}>Iniciar</Button>}
                <Button onClick={onRegisterProgress}>Registrar Avance</Button>
                {work.status !== "Finalizado" && <Button onClick={onFinish} variant="secondary">Finalizar</Button>}

                {/* Acciones adicionales */}
                {work.status !== "Finalizado" && (
                    <>
                        <Button onClick={() => onReportIssue("daño adicional")}>Reportar daño</Button>
                        <Button onClick={() => onReportIssue("apoyo especialista")}>Solicitar apoyo</Button>
                        <Button onClick={() => onReportIssue("repuesto usado")}>Registrar repuesto</Button>
                        <Button onClick={() => onReportIssue("mantenimiento adicional")}>Notificar mantenimiento</Button>
                    </>
                )}
            </div>
        </div>
    );
}
