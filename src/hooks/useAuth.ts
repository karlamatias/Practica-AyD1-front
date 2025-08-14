import { authService } from "../services/authService";

export const useAuth = () => {
  // Login inicial: usuario + contraseña
  const login = async (username: string, password: string) => {
    const res = await authService.login(username, password);

    // De momento no hay backend OTP, solo devolvemos el token
    return res; // { token, role }
  };

  // Verificación del código OTP (simulada)
  const verifyCode = async (code: string) => {
    // Aquí solo simulamos que OTP siempre es correcto
    if (code !== "0000") {
      throw new Error("Código inválido");
    }
    // Devolver token fake
    return { token: "fake-jwt", role: "admin" };
  };

  // Recuperación de contraseña
  const recoverPassword = async (email: string) => {
    return await authService.recoverPassword(email);
  };

  return { login, verifyCode, recoverPassword };
};
