import { apiClient } from './client';
import { ApiResponse, Donation, PageResponse, VolunteerTask } from '../types';

export const getMyVolunteerTasks = async (): Promise<VolunteerTask[]> => {
  const response = await apiClient.get<ApiResponse<VolunteerTask[]>>('/volunteer/pickups');
  // The backend wraps the list in ApiResponse.data; if no tasks exist some
  // implementations return null for the data field instead of an empty list.
  // Always return an array so callers can safely access .length without checks.
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const getAvailablePickups = async (page = 0, size = 20): Promise<PageResponse<Donation>> => {
  const response = await apiClient.get<ApiResponse<PageResponse<Donation>>>(
    `/volunteer/pickups/available?page=${page}&size=${size}`
  );
  return response.data.data;
};

export const claimVolunteerPickup = async (donationId: string): Promise<VolunteerTask> => {
  const response = await apiClient.post<ApiResponse<VolunteerTask>>(`/volunteer/pickups/${donationId}/claim`);
  return response.data.data;
};

export const updateVolunteerTaskStatus = async (
  taskId: string,
  status: 'CLAIMED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
): Promise<VolunteerTask> => {
  const response = await apiClient.patch<ApiResponse<VolunteerTask>>(
    `/volunteer/pickups/${taskId}/status?status=${status}`
  );
  return response.data.data;
};
