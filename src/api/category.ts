import request, { ApiResult } from '@/utils/request';

export interface CategoryType {
  id: number;
  name: string;
  image: string;
  type: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export const getCategoryListApi = (params): Promise<ApiResult<any>> =>
  request.get('/api/admin/category/list', { params });

export const getCategoryDetailApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/category', { params });

export const updateCategoryApi = (data): Promise<ApiResult<CategoryType>> => request.put('/api/admin/category', data);

export const deleteCategoryApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/category', { data });

export const addCategoryApi = (data): Promise<ApiResult<CategoryType>> => request.post('/api/admin/category', data);
