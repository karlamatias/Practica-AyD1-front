import { useState } from "react";
import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import FormGroup from "../molecules/FormGroup";
import LinkText from "../atoms/LinkText";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login, verifyCode } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "verify">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (step === "login") {
        const res = await login(username, password);

        if (username === "admin") {
          setStep("verify");
        } else {
          localStorage.setItem("token", res.token);
          navigate("/dashboard");
        }
      } else if (step === "verify") {
        const res = await verifyCode(code);
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 max-h-screen overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Bienvenido
      </h1>
      <p className="text-sm text-gray-500 text-center mb-4">
        Ingresa tus credenciales para continuar
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup>
          {step === "login" && (
            <>
              <InputText
                label="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <InputText
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </>
          )}

          {step === "verify" && (
            <InputText
              label="Código de Verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </FormGroup>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-200"
        >
          {step === "login" ? "Iniciar Sesión" : "Verificar Código"}
        </Button>

        {step === "login" && (
          <div className="flex justify-center mt-3">
            <LinkText to="/recuperar">
              ¿Olvidaste tu contraseña?
            </LinkText>
          </div>
        )}
      </form>
    </div>

  );
}
