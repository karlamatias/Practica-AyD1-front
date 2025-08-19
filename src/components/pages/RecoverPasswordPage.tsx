import AuthLayout from "../templates/AuthLayout";
import AuthCard from "../molecules/AuthCard";
import RecoverForm from "../organisms/RecoverForm";

export default function RecoverPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 max-h-screen overflow-auto">

          <h2 className="text-2xl font-bold text-center">Recuperar Contraseña</h2>

          <RecoverForm />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
