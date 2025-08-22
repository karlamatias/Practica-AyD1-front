import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../components/pages/LoginPage";
import RecoverPasswordPage from "../components/pages/RecoverPasswordPage";
import AdminDashboard from "../components/pages/admin/AdminDashboard";
import AdminInventory from "../components/pages/admin/AdminInventory";
import AdminReports from "../components/pages/admin/AdminReports";
import AdminUsers from "../components/pages/admin/AdminUsers";
import AdminVehicles from "../components/pages/admin/AdminVehicles";
import AdminWorks from "../components/pages/admin/AdminWorks";
import EmployeeDashboard from "../components/pages/employee/EmployeeDashboard";
import AdminProvider from "../components/pages/admin/AdminProvider";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar" element={<RecoverPasswordPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/vehicles" element={<AdminVehicles />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/inventory" element={<AdminInventory />} />
        <Route path="/dashboard/admin/providers" element={<AdminProvider />} />
        <Route path="/dashboard/admin/works" element={<AdminWorks />} />
        <Route path="/dashboard/admin/reports" element={<AdminReports />} />

        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />

      </Routes>
    </Router>
  );
}
