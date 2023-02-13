import request, { ApiResult } from '@/utils/request';

export const getRoleListApi = (params?): Promise<ApiResult<any>> => request.get('/api/admin/role/list', { params });
export const getRoleDetailApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/role', { params });
export const addRoleApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/role', data);
export const deleteRoleApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/role', { data });
export const updateRoleApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/role', data);

export interface RoleType {
  id: number;
  name: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}
