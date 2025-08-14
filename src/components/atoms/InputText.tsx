interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function InputText({ label, ...props }: InputTextProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
}
