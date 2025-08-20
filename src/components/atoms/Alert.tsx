interface AlertProps {
  type?: "success" | "error";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type = "success", message, onClose }: AlertProps) {
  return (
    <div className={`p-4 mb-4 rounded ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold">X</button>
      )}
    </div>
  );
}
