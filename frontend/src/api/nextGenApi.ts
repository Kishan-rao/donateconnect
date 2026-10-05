import { apiClient } from './client';
import { ApiResponse, BlockchainBlock, NgoResourceTrade, SmartLocker, SosStatus } from '../types';

export const getSmartLockers = async (): Promise<SmartLocker[]> => {
  const response = await apiClient.get<ApiResponse<SmartLocker[]>>('/lockers');
  // Backend may return null for data when no lockers are seeded; guard at the boundary.
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const getBlockchainLedger = async (): Promise<BlockchainBlock[]> => {
  const response = await apiClient.get<ApiResponse<BlockchainBlock[]>>('/blockchain');
  // Backend may return null for data when no blocks exist; guard at the boundary.
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const getActiveResourceTrades = async (): Promise<NgoResourceTrade[]> => {
  const response = await apiClient.get<ApiResponse<NgoResourceTrade[]>>('/trades');
  // Backend may return null for data when no trades exist; guard at the boundary.
  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const getSosStatus = async (): Promise<SosStatus> => {
  const response = await apiClient.get<ApiResponse<SosStatus>>('/sos');
  return response.data.data;
};

