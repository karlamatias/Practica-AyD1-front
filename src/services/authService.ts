import type { ChangePasswordDTO } from "../types/changePages";
import apiClient from "../utils/apiClient";

const API_URL = import.meta.env.VITE_API_URL;

// Servicio de autenticación
export const authService = {
  // Paso 1: login (solo valida credenciales)
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    const data = await res.json();
    return data;
  },

  // Paso 2: verificar código 2FA y guardar token
  verifyCode: async (email: string, code: string) => {
    const res = await fetch(`${API_URL}/auth/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      throw new Error("Código inválido o expirado");
    }

    // Captura token desde header Authorization
    const authHeader = res.headers.get("Authorization");
    if (!authHeader) throw new Error("No se recibió token del backend");

    const token = authHeader.replace("Bearer ", "");
    localStorage.setItem("token", token);

    const userData = await res.json();
    return userData;
  },

  recoverPassword: async (email: string) => {
    const res = await fetch(`${API_URL}/auth/recover-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error("No se pudo enviar el correo de recuperación");

    return true;
  },
  changePassword: async (data: ChangePasswordDTO) => {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "No se pudo cambiar la contraseña");
    }

    return responseData;
  }
};
