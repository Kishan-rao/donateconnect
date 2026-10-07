import { apiClient } from './client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, User, VerifyOtpRequest } from '../types';

export const registerDonorApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
    role: data.role || 'DONOR',
    ...data,
  });
  const payload = (response.data && 'data' in response.data && response.data.data) 
    ? response.data.data 
    : (response.data as unknown as AuthResponse);
  return payload;
};

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  const payload = (response.data && 'data' in response.data && response.data.data) 
    ? response.data.data 
    : (response.data as unknown as AuthResponse);
  return payload;
};

export const verifyOtpApi = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', data);
  const payload = (response.data && 'data' in response.data && response.data.data) 
    ? response.data.data 
    : (response.data as unknown as AuthResponse);
  return payload;
};

export const getCurrentUserApi = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  const payload = (response.data && 'data' in response.data && response.data.data) 
    ? response.data.data 
    : (response.data as unknown as User);
  return payload;
};
