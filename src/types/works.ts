export type WorkStatus = "Asignado" | "En curso" | "Finalizado";
export type WorkType = "Correctivo" | "Preventivo";

export interface Work {
  id: number;
  vehicle: string;
  type: WorkType;
  status: WorkStatus;
  estimatedTime: string;
  observations?: string;
}