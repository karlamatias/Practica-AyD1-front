interface BadgeProps {
  children: React.ReactNode;
  color: "Asignado" | "En curso" | "Finalizado";
}

export default function Badge({ children, color }: BadgeProps) {
  const colorClasses = {
    Asignado: "bg-yellow-100 text-yellow-800",
    "En curso": "bg-blue-100 text-blue-800",
    Finalizado: "bg-green-100 text-green-800",
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}>{children}</span>;
}
