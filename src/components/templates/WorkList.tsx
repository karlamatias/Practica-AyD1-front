import type { Work } from "../../types/works";
import WorkCard from "../organisms/WorkCard";

interface WorkListProps {
    works: Work[];
    onStart?: (id: number) => void;
    onFinish?: (id: number) => void;
    onReportDamage?: (id: number) => void;
    onRequestSupport?: (id: number) => void;
    onUseSparePart?: (id: number) => void;
    onNotifyMaintenance?: (id: number) => void;
    onRegister?: (work: Work) => void;
}

export default function WorkList({
    works,
    onStart,
    onFinish,
    onReportDamage,
    onRequestSupport,
    onUseSparePart,
    onNotifyMaintenance,
    onRegister,
}: WorkListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {works.map((work) => (
                <WorkCard
                    key={work.id}
                    {...work}
                    onStart={onStart}
                    onFinish={onFinish}
                    onReportDamage={onReportDamage}
                    onRequestSupport={onRequestSupport}
                    onUseSparePart={onUseSparePart}
                    onNotifyMaintenance={onNotifyMaintenance}
                    onRegister={() => onRegister?.(work)}
                />
            ))}
        </div>
    );
}
