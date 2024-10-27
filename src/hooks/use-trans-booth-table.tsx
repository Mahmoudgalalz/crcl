import { useState } from "react";
import { format } from "date-fns";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "./use-booth-trans";
import { User } from "@/lib/types";
import { withdrawBoothMoney } from "@/lib/api/users";
import { useToast } from "./use-toast";

export function useBoothTransactionsTable({
  transactions,
  totalPages,
  id,
}: {
  transactions: Transaction[];
  totalPages: number;
  id: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);

  const { mutate: handleWithdraw, isPending: isWithdrawLoading } = useMutation({
    mutationKey: ["withdraw"],
    mutationFn: () => withdrawBoothMoney(id, withdrawAmount ?? 0),
    onSuccess(data) {
      toast({
        title: "Success",
        description: "Money withdraw completed successfully",
      });
      queryClient.setQueryData(
        ["booth"],
        (oldData: { booths: User[] } | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            booths: oldData.booths.map((booth) =>
              booth.id === data.userId
                ? {
                    ...booth,
                    wallet: { ...booth.wallet, balance: data.balance },
                  }
                : booth
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["booth"] });

      setWithdrawAmount(null);
    },
    onError() {
      toast({
        title: "Error",
        description: "Something went wrong, Try again",
        variant: "destructive",
      });
    },
  });

  const columnHelper = createColumnHelper<Transaction>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => format(new Date(info.getValue()), "PPp"),
    }),
    columnHelper.accessor("from", {
      header: "From",
      cell: (info) => {
        const [username, domain] = info.getValue().split("@");
        return (
          <span className="font-medium">
            {username}@<span className="text-zinc-500">{domain}</span>
          </span>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge variant={info.getValue() === "PAID" ? "default" : "secondary"}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="font-medium">
          {info.getValue()} <span className="text-zinc-500 text-xs">EGP</span>
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return {
    table,
    columns,
    handleWithdraw,
    setWithdrawAmount,
    withdrawAmount,
    isWithdrawLoading,
  };
}
