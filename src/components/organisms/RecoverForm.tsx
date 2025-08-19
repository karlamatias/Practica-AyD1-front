import { useState } from "react";
import InputText from "../atoms/InputText";
import Button from "../atoms/Button";
import FormGroup from "../molecules/FormGroup";
import { authService } from "../../services/authService";


export default function RecoverForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.recoverPassword(email);
    setSuccess(true);
  };

  return success ? (
    <p className="text-green-600">Si el correo existe, recibirás instrucciones.</p>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormGroup>
        <InputText
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <Button type="submit" variant="primary" className="w-full">
        Recuperar contraseña
      </Button>
    </form>
  );
}
