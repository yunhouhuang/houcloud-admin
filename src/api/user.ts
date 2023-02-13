import request, { ApiResult } from '@/utils/request';

export const getUserListApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/user/list', { params });

export const getUserDetailApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/user', { params });

export const toBlacklistApi = (params): Promise<ApiResult<any>> =>
  request.post('/api/admin/user/blacklist', { params });

export const lockUserApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/user/lock', data);

export interface UserType {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 是否黑名单
   */
  blacklist?: boolean;
  /**
   * 行创建时间
   */
  createdAt?: Date;

  /**
   * 电子邮箱
   */
  email?: string;
  id?: number;
  /**
   * 身份证号（实名信息）
   */
  idCardNo?: string;
  /**
   * 邀请人ID
   */
  inviteId?: number;
  /**
   * 最近活跃时间
   */
  lastLiveAt?: Date;
  /**
   * 是否已锁定
   */
  locked?: boolean;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 真实姓名（实名信息）
   */
  realName?: string;
  /**
   * 1男2女
   */
  sex?: string;
  /**
   * 行更新时间
   */
  updatedAt?: Date;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 钱包余额 CNY（分）
   */
  wallet?: number;
}
