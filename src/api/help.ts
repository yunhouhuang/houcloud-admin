import api, { ApiResult } from '@/utils/request';

export const getFeedbackListApi = (params): Promise<ApiResult<any>> => {
  return api.get('/api/admin/feedback/list', { params });
};

export const getFeedbackDetailApi = (params): Promise<ApiResult<any>> => {
  return api.get('/api/admin/feedback', { params });
};

export const handleFeedbackApi = (data): Promise<ApiResult<any>> => {
  return api.put('/api/admin/feedback', data);
};
export const deleteFeedbackApi = (data): Promise<ApiResult<any>> => {
  return api.delete('/api/admin/feedback', { data });
};

export const getIssueListApi = (params): Promise<ApiResult<any>> => {
  return api.get('/api/admin/issue/list', { params });
};

export const saveIssueApi = (data): Promise<ApiResult<any>> => {
  return api.put('/api/admin/issue', data);
};

export const addIssueApi = (data): Promise<ApiResult<any>> => {
  return api.post('/api/admin/issue', data);
};

export const delIssueApi = (data): Promise<ApiResult<any>> => {
  return api.delete('/api/admin/issue', { data });
};

interface UserVip {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: number;
}

interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  uuid: number;
  avatar: string;
  bgImage: string;
  username: string;
  nickname: string;
  mobile: string;
  qrcode: string;
  likeArticles: string;
  followers: string;
  adorers: string;
  following: boolean;
  syncInfo: boolean;
  wallet: number;
  sex: string;
  location: string;
  latitude: number;
  longitude: number;
  introduction: string;
  birthday: string;
  lastLoginAt: string;
  lastLiveAt: string;
  inviteId: number;
  vehicleId: number;
  vehicle_name: string;
  locked: boolean;
  userVipId: number;
  userVip: UserVip;
  userVipExpireAt: string;
  blacklist: boolean;
}

export interface FeedbackType {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  images: string;
  imageArr: string;
  type: string;
  userId: number;
  user: User;
  contact: string;
  status: string;
}
