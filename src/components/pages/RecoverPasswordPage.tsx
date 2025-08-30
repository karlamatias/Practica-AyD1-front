import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecoverForm from "../organisms/RecoverForm";
import VerifyCodeForm from "../organisms/VerifyCodeForm";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();

  // Redirigir después de 3 segundos cuando la contraseña se cambió
  useEffect(() => {
    if (passwordChanged) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [passwordChanged, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Recuperar contraseña</h2>

        {!email && !passwordChanged && (
          <RecoverForm onSuccess={(userEmail) => setEmail(userEmail)} />
        )}

        {email && !passwordChanged && (
          <VerifyCodeForm
            email={email}
            onSuccess={() => {
              setPasswordChanged(true);
              setEmail(null);
            }}
          />
        )}

        {passwordChanged && (
          <p className="text-green-600 text-center">
            Contraseña cambiada correctamente. Redirigiendo al login...
          </p>
        )}
      </div>
    </div>
  );
}
