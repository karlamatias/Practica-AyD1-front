import AuthLayout from "../templates/AuthLayout";
import AuthCard from "../molecules/AuthCard";
import LoginForm from "../organisms/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
