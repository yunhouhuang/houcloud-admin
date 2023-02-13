import request, { ApiResult } from '@/utils/request';
/** 个人中心 */
export const personalInfoApi = (): Promise<ApiResult<any>> => request.get('/api/admin/personal');
export const currentMerchantInfoApi = () => request.get('/api/admin/personal/merchant');
export const updatePersonalInfoApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/personal', data);
export const updateSingleInfoApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/personal/edit', data);
export const postLiveStatus = (data): Promise<ApiResult<any>> => request.post('/api/admin/live', data);

/**
 * 消息通知
 * @param params
 */
export const getNoticesApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/notice/list', { params });
export const getUnreadNoticeNumApi = (params): Promise<ApiResult<any>> =>
  request.get('/api/admin/notice/num', { params });
export const readNoticeApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/notice/read', data);
export const getNoticeApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/notice', { params });
export const delNoticeApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/notice', data);

export interface AdminNoticeType {
  id: number;
  adminId: number;
  title: string;
  content: string;
  link: string;
  status: string;
  type: string;
  refType: string;
  refId: number;
  createdAt: string;
  updatedAt: string;
}
