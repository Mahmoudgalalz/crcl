"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/");
  }

  if (token && window.location.pathname === "/") {
    router.push("/dashboard");
  }
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
