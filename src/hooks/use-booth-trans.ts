"use client";

import { getBoothTrans } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";

export type Transaction = {
  id: string;
  createdAt: string;
  from: string;
  to: string;
  status: string;
  amount: number;
  tokenPrice: number;
  walletId: string;
};

export type TransactionsResponse = {
  status: string;
  message: string;
  data: {
    boothTransactions: {
      transactions: Transaction[];
      totalPages: number;
      currentPage: number;
      totalTransactions: number;
      transactionsCount: number;
    };
    tokenPrice: {
      tokenPrice: number;
    };
  };
};

export function useBoothTransactions(boothId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ["boothTransactions", boothId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (typeof id === "string") {
        return await getBoothTrans(id);
      }
      return undefined;
    },
    enabled: !!boothId,
  });
  return {
    data,
    isLoading,
  };
}
