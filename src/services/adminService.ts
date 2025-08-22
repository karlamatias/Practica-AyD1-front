const API_URL = import.meta.env.VITE_API_URL;

export const adminService = {


  // Clientes
  getClients: async () => {
    const res = await fetch(`${API_URL}/clients`);
    return res.json();
  },
  createClient: async (data: any) => {
    const res = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Empleados / especialistas
  getEmployees: async () => {
    const res = await fetch(`${API_URL}/employees`);
    return res.json();
  },
  createEmployee: async (data: any) => {
    const res = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Proveedores
  getProviders: async () => {
    const res = await fetch(`${API_URL}/providers`);
    return res.json();
  },
  createProvider: async (data: any) => {
    const res = await fetch(`${API_URL}/providers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Trabajos mecánicos
  getWorks: async () => {
    const res = await fetch(`${API_URL}/works`);
    return res.json();
  },
  createWork: async (data: any) => {
    const res = await fetch(`${API_URL}/works`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Inventario
  getInventory: async () => {
    const res = await fetch(`${API_URL}/inventory`);
    return res.json();
  },
  addInventory: async (data: any) => {
    const res = await fetch(`${API_URL}/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Facturación / pagos / reportes
  getBilling: async () => {
    const res = await fetch(`${API_URL}/billing`);
    return res.json();
  },
  getReports: async () => {
    const res = await fetch(`${API_URL}/reports`);
    return res.json();
  },
};
