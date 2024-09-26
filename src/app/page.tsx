import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center ~px-4/10 ~py-8/14 gap-6">
      <div className="flex flex-col gap-8 items-center">
        <h1 className="~text-3xl/4xl tracking-wide font-bold text-center text-balance">
          Welcome to CRCL Admin Portal
        </h1>
        <h2 className="~text-2xl/3xl tracking-wide font-semibold">Login</h2>
      </div>
      <LoginForm />
    </main>
  );
}
