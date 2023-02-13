import request, { ApiResult } from '@/utils/request';

export const getAgreementApi = (params): Promise<ApiResult<any>> => {
  return request.get('/api/admin/platform/agreement', { params });
};

export const setAgreementApi = (data): Promise<ApiResult<any>> => {
  return request.put('/api/admin/platform/agreement', data);
};

export const getPlatformInfoApi = (params?): Promise<ApiResult<any>> => {
  return request.get('/api/admin/platform', { params });
};

export const setPlatformInfo = (data): Promise<ApiResult<any>> => {
  return request.put('/api/admin/platform', data);
};
