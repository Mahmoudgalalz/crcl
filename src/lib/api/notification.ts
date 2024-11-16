import { ApiSuccessResponse, NotificationGroup } from "../types";
import { axiosInstance } from "./instance";

export async function createNotificationsGroup(
  name: string,
  description: string
) {
  try {
    const response = await axiosInstance.post<
      ApiSuccessResponse<NotificationGroup>
    >("/notifications", {
      name,
      description,
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getNotificationsGroups() {
  try {
    const response = await axiosInstance.get<
      ApiSuccessResponse<NotificationGroup[]>
    >("/notifications");
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteNotificationsGroup(groupId: string) {
  try {
    const response = await axiosInstance.delete(`/notifications/${groupId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateNotificationsGroup(
  groupId: string,
  name: string,
  description: string
) {
  try {
    const response = await axiosInstance.put<
      ApiSuccessResponse<NotificationGroup>
    >(`/notifications/${groupId}`, {
      name,
      description,
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PushNotificationToGroup(
  title: string,
  message: string,
  groupId: string
) {
  try {
    const response = await axiosInstance.post(`/notifications/bulk-push`, {
      title,
      message,
      notificationId: groupId,
    });
    return response.status;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PushNotificationToAll(title: string, message: string) {
  try {
    const response = await axiosInstance.post(`/notifications/bulk-push`, {
      title,
      message,
      all: true,
    });
    return response.status;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function PushNotificationToMultipleUsers(
  userIds: string[],
  title: string,
  message: string
) {
  try {
    const response = await axiosInstance.post(`/notifications/bulk-push`, {
      title,
      message,
      userIds,
    });
    return response.status;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//  notificationId?: string;
