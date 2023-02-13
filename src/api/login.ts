import request, { ApiResult } from '@/utils/request';

/** 密码登录 */
export const passwordLoginApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/login', data);
/** 手机短信验证码登录 */
export const loginBySmsCodeApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/login/mobile', data);
/** 登录状态 */
export const loginStateApi = (): Promise<ApiResult<any>> => request.get('/api/admin/login/state');
/**
 * 退出登录
 */
export const logoutApi = (): Promise<ApiResult<any>> => request.delete('/api/admin/logout');
