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
import AdminQuotation from "../components/pages/admin/AdminQuotation";
import AdminPayment from "../components/pages/admin/AdminPayment";
import ProviderDashboard from "../components/pages/provider/ProviderDashboard";
import ProviderQuotation from "../components/pages/provider/ProviderQuotation";
import AdminOrders from "../components/pages/admin/AdminOrders";
import ProviderOrders from "../components/pages/provider/ProviderOrders";
import { SocketProvider } from "../hooks/useJobsSocket";
import AdminSpecialist from "../components/pages/admin/AdminSpecialist";
import CustomerDashboard from "../components/pages/customer/CustomerDashboard";
import AdminPayments from "../components/pages/admin/AdminPayments";

const token = localStorage.getItem("token") || "";

export default function AppRouter() {
  return (
    <SocketProvider token={token}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/recuperar" element={<RecoverPasswordPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/vehicles" element={<AdminVehicles />} />
          <Route path="/dashboard/admin/users" element={<AdminUsers />} />
          <Route path="/dashboard/admin/specialist" element={<AdminSpecialist />} />
          <Route path="/dashboard/admin/inventory" element={<AdminInventory />} />
          <Route path="/dashboard/admin/providers" element={<AdminProvider />} />
          <Route path="/dashboard/admin/quotation" element={<AdminQuotation />} />
          <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
          <Route path="/dashboard/admin/payment" element={<AdminPayment />} />
          <Route path="/dashboard/admin/payments" element={<AdminPayments />} />
          <Route path="/dashboard/admin/works" element={<AdminWorks />} />
          <Route path="/dashboard/admin/reports" element={<AdminReports />} />
          <Route path="/dashboard/supplier" element={<ProviderDashboard />} />
          <Route path="/dashboard/supplier/quotation" element={<ProviderQuotation />} />
          <Route path="/dashboard/supplier/orders" element={<ProviderOrders />} />
          <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />

        </Routes>
      </Router>
    </SocketProvider>
  );
}
