import request, { ApiResult } from '@/utils/request';

export const getPermissionsApi = (params?): Promise<ApiResult<any>> =>
  request.get('/api/admin/permission/all', { params });
export const addPermissionApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/permission', data);
export const updatePermissionApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/permission', data);
export const deletePermissionApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/permission', { data });

export interface GinRouterType {
  id: number;
  name: string;
  path: string;
  method: string;
  handler: string;
}

export interface PermissionType {
  id: number;
  permissionId: number;
  name: string;
  path: string;
  uri: string;
  method: string;
  route_name: string;
  label?: string;
  value?: number;
  handler: string;
}

export interface PersonType {
  id: number;
  avatar: string;
  nickname: string;
  lastLoginAt: Date;
  lastLiveAt: Date;
  createdAt: Date;
  real_name: string;
}
