import {
  PushNotificationToAll,
  PushNotificationToGroup,
  PushNotificationToMultipleUsers,
} from "@/lib/api/notification";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useState, useCallback } from "react";

export function usePushNotifications() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const resetSuccess = useCallback(() => {
    setIsSuccess(false);
  }, []);

  const handleSuccess = useCallback(
    (message: string) => {
      setIsSuccess(true);
      toast({
        title: "Success",
        description: message,
      });
    },
    [toast]
  );

  const handleError = useCallback(
    (message: string) => {
      setIsSuccess(false);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    [toast]
  );

  const {
    mutateAsync: pushToMultipleUsers,
    isPending: isMultipleUsersPending,
  } = useMutation({
    mutationKey: ["pushToMultipleUsers"],
    mutationFn: async (params: {
      users: string[];
      title: string;
      message: string;
    }) => {
      await PushNotificationToMultipleUsers(
        params.users,
        params.title,
        params.message
      );
      handleSuccess("Notification sent to multiple users");
    },
    onError: () => handleError("Failed to send notification to multiple users"),
  });

  const { mutateAsync: pushToAllUsers, isPending: isPushToAllUsersPending } =
    useMutation({
      mutationKey: ["pushToAllUsers"],
      mutationFn: async (params: { title: string; message: string }) => {
        await PushNotificationToAll(params.title, params.message);
        handleSuccess("Notification sent to all users");
      },
      onError: () => handleError("Failed to send notification to all users"),
    });

  const { mutateAsync: pushToGroup, isPending: isPushToGroupPending } =
    useMutation({
      mutationKey: ["pushToGroup"],
      mutationFn: async (params: {
        groupId: string;
        title: string;
        message: string;
      }) => {
        await PushNotificationToGroup(
          params.title,
          params.message,
          params.groupId
        );
        handleSuccess("Notification sent to the group");
      },
      onError: () => handleError("Failed to send notification to the group"),
    });

  return {
    isLoading:
      isMultipleUsersPending || isPushToAllUsersPending || isPushToGroupPending,
    isSuccess,
    resetSuccess,
    pushToMultipleUsers,
    pushToAllUsers,
    pushToGroup,
  };
}
