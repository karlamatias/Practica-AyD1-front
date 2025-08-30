import { useState } from "react";
import { authService } from "../../services/authService";
import FormGroup from "../molecules/FormGroup";
import InputText from "../atoms/InputText";
import Button from "../atoms/Button";

interface VerifyCodeFormProps {
    email: string;
    onSuccess: () => void;
}

export default function VerifyCodeForm({ email, onSuccess }: VerifyCodeFormProps) {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!code || !newPassword) {
            setError("Debes completar todos los campos.");
            return;
        }

        setLoading(true);
        try {
            const res = await authService.changePassword({ email, code, newPassword });

            onSuccess();
        } catch (err: any) {
            if (err?.message) {
                setError(err.message);
            } else if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Código inválido o expirado.");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleResendCode = async () => {
        setResendLoading(true);
        setResendMessage(null);
        try {
            await authService.recoverPassword(email);
            setResendMessage("Código reenviado correctamente a tu correo.");
        } catch (err: any) {
            setResendMessage(err.message || "Error al reenviar el código.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {resendMessage && <p className="text-green-600 text-sm">{resendMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600">{error}</p>}

                <FormGroup>
                    <InputText
                        label="Código de verificación"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <InputText
                        label="Nueva contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </FormGroup>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
                    disabled={loading}
                >
                    {loading ? "Cambiando..." : "Cambiar contraseña"}
                </Button>

                {/* Botón de reenvío */}
                <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendLoading}
                    className="text-indigo-600 underline text-sm hover:text-indigo-700"
                >
                    {resendLoading ? "Reenviando..." : "Reenviar código de verificación"}
                </button>
            </form>
        </div>
    );
}
