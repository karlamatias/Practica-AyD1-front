import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import { useState } from "react";

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
    onSave: (updatedWork: Work) => void;
    onCancel: () => void;
}

export default function WorkProgressForm({ work, onSave, onCancel }: Props) {

    const [observations, setObservations] = useState(work.observations || "");


    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">Registrar Avance - {work.vehicle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">

                <InputText label="Observaciones" value={observations} onChange={e => setObservations(e.target.value)} />
                <div className="col-span-1 mt-2 flex gap-2">
                    <Button onClick={() => onSave({ ...work, observations })}>Guardar</Button>
                    <Button onClick={onCancel} variant="secondary">Cancelar</Button>
                </div>
            </div>
        </div>
    );
}
