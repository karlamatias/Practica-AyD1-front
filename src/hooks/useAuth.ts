import { useState } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Login inicial: usuario + contraseña
  const login = async (username: string, password: string) => {
    const res = await authService.login(username, password);
    return res;
  };

  // Verificación del código
  const verifyCode = async (email: string, code: string) => {
    setLoading(true);
    try {
      const userData = await authService.verifyCode(email, code);

      // Guardar token y user en localStorage para sesiones
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se guardó el token correctamente");
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
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
