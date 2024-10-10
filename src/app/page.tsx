import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            CRCL Admin Login
          </CardTitle>
          <CardDescription className="text-center text-zinc-700">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </main>
  );
}
