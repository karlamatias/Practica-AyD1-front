import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: React.ReactNode; // <-- Nueva prop para icono
}

export default function Button({ variant = "primary", children, icon, ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-semibold focus:outline-none inline-flex items-center";
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  return (
    <button className={`${base} ${styles}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
