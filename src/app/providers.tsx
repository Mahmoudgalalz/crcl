"use client";
import { RolesMiddleware } from "@/components/role-middleware";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RolesMiddleware>{children}</RolesMiddleware>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
