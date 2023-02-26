import request, { ApiResult } from '@/utils/request';

export const adminListApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/admin/list', { params });

export const getAdminDetailApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/admin', { params });

export const updateAdminApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/admin', data);

export const deleteAdminApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/admin', { data });

export const lockAdminApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/admin/lock', data);

export const addAdminApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/admin', data);

export const resetPasswordApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/admin/pwd', data);

export interface AdminRole {
  id: number;
  name: string;
  code: string;
}

export interface AdminType {
  id?: number;
  avatar?: string;
  mobile?: string;
  locked?: boolean;
  nickname?: string;
  username?: string;
  password?: string;
  roleIds?: number[];
  isCreator?: boolean;
  lastLoginAt?: Date;
  lastLiveAt?: Date;
  createdAt?: Date;
  roles?: AdminRole[];
}
