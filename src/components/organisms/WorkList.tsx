import WorkCard from "../molecules/WorkCard";
interface Work {
  id: number;
  vehicle: string;
  type: string;
  status: "Asignado" | "En curso" | "Finalizado";
  estimatedTime: string;
  observations?: string;
}


interface Props {
    works: Work[];
    onStart: (id: number) => void;
    onRegister: (work: Work) => void;
    onFinish: (id: number) => void;
}

export default function WorkList({ works, onStart, onRegister, onFinish }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map(work => (
                <WorkCard
                    key={work.id}
                    work={work}
                    onStart={() => onStart(work.id)}
                    onRegisterProgress={() => onRegister(work)}
                    onFinish={() => onFinish(work.id)} onReportIssue={function (type: string): void {
                        throw new Error("Function not implemented.");
                    } }                />
            ))}
        </div>
    );
}
