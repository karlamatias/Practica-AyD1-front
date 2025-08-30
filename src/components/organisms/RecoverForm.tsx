import { useState } from "react";
import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import FormGroup from "../molecules/FormGroup";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

interface RecoverFormProps {
  onSuccess: (email: string) => void;
}

export default function RecoverForm({ onSuccess }: RecoverFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Debes ingresar tu correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      await authService.recoverPassword(email);
      onSuccess(email);
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <p className="text-gray-600 text-sm">
        Ingresa tu correo electrónico. Te enviaremos un código de verificación
        que deberás usar en el siguiente formulario para cambiar tu contraseña.
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <FormGroup>
          <InputText
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Recuperar contraseña"}
        </Button>

        {/* Botón para regresar al login */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-indigo-600 underline text-sm hover:text-indigo-700"
        >
          Regresar al login
        </button>

      </form>
    </div>
  );
}
