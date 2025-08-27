import Badge from "../atoms/Badge";

interface WorkInfoProps {
  vehicle: string;
  type: string;
  status: "Asignado" | "En curso" | "Finalizado";
  estimatedTime: string;
}

export default function WorkInfo({ vehicle, type, status, estimatedTime }: WorkInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-lg">{vehicle}</span>
      <span className="text-gray-500">{type}</span>
      <div className="flex gap-2 items-center mt-1">
        <Badge color={status}>{status}</Badge>
        <span className="text-gray-400 text-sm">Tiempo estimado: {estimatedTime}</span>
      </div>
    </div>
  );
}
