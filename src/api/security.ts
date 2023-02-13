import request, { ApiResult } from '@/utils/request';

export const getSysLogsApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/log/list', { params });

export interface SysLogType {
  id: bigint;
  title: string;
  uri: string;
  ip: string;
}
