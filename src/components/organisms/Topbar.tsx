import { HiLogout } from "react-icons/hi";

export default function Topbar() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Panel de Administrador</h1>
      <button
        className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        <HiLogout className="mr-2" size={20} />
      </button>
    </header>
  );
}
