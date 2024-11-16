import {
  PushNotificationToAll,
  PushNotificationToGroup,
  PushNotificationToMultipleUsers,
} from "@/lib/api/notification";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function usePushNotifications() {
  const { toast } = useToast();

  const {
    mutate: pushToMultilpleUsers,
    isPending,
    isSuccess: isPushToMultipleUsersSuccess,
  } = useMutation({
    mutationKey: ["pushToMultipleUsers"],

    mutationFn: async (params: {
      users: string[];
      title: string;
      message: string;
    }) =>
      await PushNotificationToMultipleUsers(
        params.users,
        params.title,
        params.message
      ),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent to multiple users",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notification to multiple users",
      });
    },
  });

  const {
    mutate: pushToAllUsers,
    isPending: isPushToAllUsersPending,
    isSuccess: isPushToAllUsersSuccess,
  } = useMutation({
    mutationKey: ["pushToAllUsers"],

    mutationFn: async (params: { title: string; message: string }) =>
      await PushNotificationToAll(params.title, params.message),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent to all users",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notification to all users",
      });
    },
  });

  const {
    mutate: pushToGroup,
    isPending: isPushToGroupPending,
    isSuccess: isPushToGroupSuccess,
  } = useMutation({
    mutationKey: ["pushToGroup"],

    mutationFn: async (params: {
      groupId: string;
      title: string;
      message: string;
    }) =>
      await PushNotificationToGroup(
        params.title,
        params.message,
        params.groupId
      ),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification sent to the group",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send notification to the group",
      });
    },
  });

  return {
    isLoading: isPending || isPushToAllUsersPending || isPushToGroupPending,
    isSuccess:
      isPushToMultipleUsersSuccess ||
      isPushToAllUsersSuccess ||
      isPushToGroupSuccess,
    pushToMultilpleUsers,
    pushToAllUsers,
    pushToGroup,
  };
}
