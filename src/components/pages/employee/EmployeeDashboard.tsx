import { useState } from "react";
import WorkHistory from "../../organisms/WorkHistory";
import WorkProgressForm from "../../organisms/WorkProgressForm";
import WorkList from "../../organisms/WorkList";
import EmployeeLayout from "../../templates/EmployeeLayout";

interface Work {
  id: number;
  vehicle: string;
  type: string;
  status: "Asignado" | "En curso" | "Finalizado";
  estimatedTime: string;
  observations?: string;
}


export default function EmployeeDashboard() {
    const employeeName = "Juan Pérez";

    const [works, setWorks] = useState<Work[]>([
        { id: 1, vehicle: "Toyota Corolla", type: "Preventivo", status: "Asignado", estimatedTime: "2h" },
        { id: 2, vehicle: "Honda Civic", type: "Correctivo", status: "Finalizado", estimatedTime: "3h", observations: "Cambio de bujías"},
    ]);

    const [currentWork, setCurrentWork] = useState<Work | null>(null);

    const handleStart = (id: number) => setWorks(works.map(w => w.id === id ? { ...w, status: "En curso" } : w));
    const handleFinish = (id: number) => setWorks(works.map(w => w.id === id ? { ...w, status: "Finalizado" } : w));
    const handleSaveProgress = (updatedWork: Work) => {
        setWorks(works.map(w => w.id === updatedWork.id ? updatedWork : w));
        setCurrentWork(null);
    };

    const assignedWorks = works.filter(w =>  w.status !== "Finalizado");
    const historyWorks = works.filter(w =>  w.status === "Finalizado");

    return (
        <EmployeeLayout>
            <h2 className="text-2xl font-bold mb-6">Mis Trabajos</h2>
            <WorkList
                works={assignedWorks}
                onStart={handleStart}
                onRegister={setCurrentWork}
                onFinish={handleFinish}
              
            />
            {currentWork && <WorkProgressForm work={currentWork} onSave={handleSaveProgress} onCancel={() => setCurrentWork(null)} />}
            <WorkHistory works={historyWorks} />
        </EmployeeLayout>
    );
}
