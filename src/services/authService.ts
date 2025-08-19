const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }


      return { token: "fake-jwt", role: "user" }; // temporal o reemplazar con JWT real
    } catch (error: any) {
      throw new Error(error.message || "Error en el login");
    }
  },

  verifyCode: async (email: string, code: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error("Código inválido o expirado");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Error al verificar código");
    }
  },

  recoverPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/recover-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("No se pudo enviar el correo de recuperación");

      return true;
    } catch (error: any) {
      throw new Error(error.message || "Error al recuperar contraseña");
    }
  },
};
