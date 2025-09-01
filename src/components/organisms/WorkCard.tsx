"use client";
import { useState } from "react";
import WorkInfo from "../molecules/WorkInfo";
import Button from "../atoms/Button";
import UseSparePartModal from "../molecules/UseSparePartModal";
import RequestSupportModal from "../molecules/RequestSupportModal";
import Alert from "../atoms/Alert";
import type { Work } from "../../types/works";
import {
    FiPlay,
    FiCheck,
    FiAlertTriangle,
    FiUsers,
    FiTool,
    FiSettings,
} from "react-icons/fi";

interface WorkCardProps extends Work {
    onStart?: (id: number) => void;
    onFinish?: (id: number) => void;
    onReportDamage?: (id: number) => void;
    onRequestSupport?: (id: number) => void;
    onNotifyMaintenance?: (id: number) => void;
    onRegister?: (work: Work) => void;
}

export default function WorkCard({
    id,
    vehicle,
    type,
    status,
    estimatedTime,
    observations,
    onStart,
    onFinish,
    onReportDamage,
    onRequestSupport,
    onNotifyMaintenance,
    onRegister,
}: WorkCardProps) {
    const [showSpareModal, setShowSpareModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error">("success");

    const isAssigned = status === "Asignado";
    const isInProgress = status === "En curso";
    const isFinished = status === "Finalizado";

    const handleShowAlert = (message: string, type: "success" | "error" = "success") => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => setAlertMessage(null), 5000);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between p-4 mb-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 gap-4 md:gap-0">

            {/* Alerta */}
            {alertMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
                    <Alert type={alertType} message={alertMessage} onClose={() => setAlertMessage(null)} />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <WorkInfo
                    vehicle={vehicle}
                    type={type}
                    status={status}
                    estimatedTime={estimatedTime}
                />
                {observations && (
                    <p className="text-gray-600 italic text-sm mt-2 truncate">
                        {observations}
                    </p>
                )}
            </div>

            <div className="flex flex-col justify-center md:items-end gap-2">
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => onStart?.(id)}
                        color="primary"
                        icon={<FiPlay className="w-4 h-4" />}
                        className="px-3 py-1 text-sm"
                        disabled={!isAssigned}
                    >
                        {isAssigned ? "Iniciar" : status}
                    </Button>
                    <Button
                        onClick={() => onFinish?.(id)}
                        color="success"
                        icon={<FiCheck className="w-4 h-4" />}
                        className="px-3 py-1 text-sm"
                        disabled={!isInProgress}
                    >
                        Finalizar
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    {onReportDamage && (
                        <Button
                            onClick={() => onReportDamage(id)}
                            color="yellow"
                            icon={<FiAlertTriangle className="w-5 h-5" />}
                            className="p-2 rounded-full"
                            title="Reportar daños"
                            disabled={isFinished}
                        />
                    )}
                    {onRequestSupport && (
                        <Button
                            onClick={() => setShowSupportModal(true)}
                            color="purple"
                            icon={<FiUsers className="w-5 h-5" />}
                            className="p-2 rounded-full"
                            title="Solicitar apoyo"
                            disabled={isFinished}
                        />
                    )}
                    <Button
                        onClick={() => setShowSpareModal(true)}
                        color="indigo"
                        icon={<FiTool className="w-5 h-5" />}
                        className="p-2 rounded-full"
                        title="Usar repuesto"
                        disabled={isFinished}
                    />
                    {onNotifyMaintenance && (
                        <Button
                            onClick={() => onNotifyMaintenance(id)}
                            color="orange"
                            icon={<FiSettings className="w-5 h-5" />}
                            className="p-2 rounded-full"
                            title="Notificar mantenimiento"
                            disabled={isFinished}
                        />
                    )}
                    {onRegister && (
                        <Button
                            onClick={() => onRegister({ id, vehicle, type, status, estimatedTime, observations })}
                            color="secondary"
                            icon={<FiCheck className="w-5 h-5" />}
                            className="p-2 rounded-full"
                            title="Registrar progreso"
                            disabled={isFinished}
                        />
                    )}
                </div>
            </div>

            {/* Modales */}
            <UseSparePartModal
                isOpen={showSpareModal}
                onClose={() => setShowSpareModal(false)}
                maintenanceJobId={id}
                onSuccess={(message) => handleShowAlert(message, "success")}
            />
            <RequestSupportModal
                isOpen={showSupportModal}
                onClose={() => setShowSupportModal(false)}
                maintenanceJobId={id}
                onSuccess={(message) => handleShowAlert(message, "success")}
            />
        </div>
    );
}
