import { apiRequest } from "./queryClient";

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
}
// export interface notification response
export interface NotificationResponse {
  id: number;
  userId: string;
  type: "email" | "sms" | "in-app";
  title: string;
  status: "pending" | "delivered" | "failed";
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface NotificationItem {
  id: number;
  userId: string;
  type: "email" | "sms" | "in-app";
  title: string;
  message: string;
  status: "pending" | "delivered" | "failed";
  priority: boolean;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
}

export interface StatsResponse {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  deliveryRate: number;
}

// Notification request payload
export interface SendNotificationPayload {
  userId: string;
  type: "email" | "sms" | "in-app";
  title: string;
  message: string;
  priority?: boolean;
}

// API functions
export const sendNotification = async (notification: SendNotificationPayload): Promise<NotificationResponse> => {
  const response = await apiRequest("POST", "/api/notifications", notification);
  return response.json();
};

export const getUserNotifications = async (
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
  }
): Promise<NotificationListResponse> => {
  let url = `/api/users/${userId}/notifications`;
  
  if (options) {
    const params = new URLSearchParams();
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.offset) params.append("offset", options.offset.toString());
    if (options.status) params.append("status", options.status);
    if (options.type) params.append("type", options.type);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  const response = await fetch(url, { credentials: "include" });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }
  
  return response.json();
};

export const getNotificationStats = async (): Promise<StatsResponse> => {
  const response = await fetch("/api/notifications/stats", { credentials: "include" });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch notification stats: ${response.statusText}`);
  }
  
  return response.json();
};

export const retryNotification = async (id: number): Promise<void> => {
  await apiRequest("POST", `/api/notifications/${id}/retry`, {});
};
