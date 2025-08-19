import { Link } from "react-router-dom";

interface LinkTextProps {
  to: string;
  children: React.ReactNode;
}

export default function LinkText({ to, children }: LinkTextProps) {
  return (
    <Link to={to} className="text-blue-600 hover:underline text-sm">
      {children}
    </Link>
  );
}
