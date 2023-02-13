import axios, { AxiosResponse } from 'axios';
import request, { ApiResult } from '@/utils/request';
import { useUserStore } from '@/store';

export const getFileListApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/file/list', { params });
export const uploadFileApi = (data, onUploadProgress): Promise<AxiosResponse<any>> => {
  const { token } = useUserStore();
  return axios.post('/api/admin/file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });
};

export const deleteFileApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/file', { data });
export const updateFileApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/file', data);
export const getDownloadUuidApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/file/uuid', { params });
export const downloadApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/file', { params });

export interface FileType {
  id: number;
  name: string;
  url: string;
  suffix: string;
  size: number;
  userId: number;
  copied: boolean;
  createdAt: Date;
  updatedAt: Date;
}
