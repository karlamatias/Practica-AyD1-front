export const authService = {
  login: async (username: string, password: string) => {
    return new Promise<{ token: string; role: string }>((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "1234") {
          resolve({ token: "fake-jwt", role: "admin" });
        } else {
          reject(new Error("Credenciales inválidas"));
        }
      }, 500);
    });
  },
  recoverPassword: async (email: string) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  },
};
