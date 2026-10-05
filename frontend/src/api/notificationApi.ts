import { apiClient } from './client';
import { ApiResponse, NotificationItem, PageResponse } from '../types';

export const getMyNotifications = async (): Promise<NotificationItem[]> => {
  const response = await apiClient.get<ApiResponse<PageResponse<NotificationItem>>>('/notifications/mine?page=0&size=100');
  // Guard both the page wrapper and its content array against null responses.
  return Array.isArray(response.data.data?.content) ? response.data.data.content : [];
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};
