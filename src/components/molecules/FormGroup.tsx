import type { ReactNode } from "react";

interface FormGroupProps {
  children: ReactNode;
}

export default function FormGroup({ children }: FormGroupProps) {
  return <div className="space-y-4">{children}</div>;
}
