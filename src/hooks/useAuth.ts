import { useState } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Login inicial: usuario + contraseña
  const login = async (username: string, password: string) => {
    const res = await authService.login(username, password);
    return res; // { token, role }
  };

  // Verificación del código
  const verifyCode = async (email: string, code: string) => {
    setLoading(true);
    try {
      const res = await authService.verifyCode(email, code);
      return res; // { token }
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Recuperación de contraseña
  const recoverPassword = async (email: string) => {
    return await authService.recoverPassword(email);
  };

  return { login, verifyCode, recoverPassword, loading };
};
