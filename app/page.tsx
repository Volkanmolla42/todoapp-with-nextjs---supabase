import LoginForm from "@/app/components/LoginForm";
import RegisterForm from "@/app/components/RegisterForm";

export default function Home() {
  return (
    <div className="flex gap-5 p-5 w-screen items-center justify-center h-screen ">
      <RegisterForm />
      <LoginForm />
    </div>
  );
}
