import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../components/pages/LoginPage";
import RecoverPasswordPage from "../components/pages/RecoverPasswordPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar" element={<RecoverPasswordPage />} />
        {/* Rutas privadas se agregan luego */}
      </Routes>
    </Router>
  );
}
