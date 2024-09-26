import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center ~px-4/10 ~py-8/14 gap-6 justify-center">
      <div className=" flex flex-col items-center justify-center gap-12 px-4 py-16 shadow-2xl rounded-lg md:p-8 drop-shadow-2xl max-sm:w-full shadow-primary/80">
        <div className="flex flex-col gap-8 items-center ">
          <h1 className="~text-3xl/4xl tracking-wide font-bold text-center text-balance">
            CRCL <span className="font-thin">Admin Portal</span>
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
