import request, { ApiResult } from '@/utils/request';
/**
 * MenuType，菜单
 */
export interface MenuType {
  /**
   * 前端组件地址
   */
  component?: string;
  /**
   * 行创建时间
   */
  createdAt?: Date;
  /**
   * 是否隐藏
   */
  hidden?: boolean;
  /**
   * 菜单图标
   */
  icon?: string;
  id?: number;
  /**
   * 是否持久页
   */
  keepAlive?: boolean;
  /**
   * 前端路由Name
   */
  name?: string;
  /**
   * 上级ID
   */
  parentId?: number;
  /**
   * 前端跳转路径
   */
  path?: string;
  /**
   * 权限编码
   */
  permission?: string;
  /**
   * 重定向
   */
  redirect?: string;
  /**
   * 是否隐藏子菜单
   */
  single?: boolean;
  /**
   * 菜单名称
   */
  title?: string;
  /**
   * 类型（1按钮 0菜单）
   */
  type?: string;
  /**
   * 行更新时间
   */
  updatedAt?: Date;
  /**
   * 排序权重（越大越优先）
   */
  weight?: number;
  /**
   * 是否白名单
   */
  white?: boolean;
}

/**
 * 获取树形结构菜单
 * @param params
 */
export const getMenuTreeApi = (params?): Promise<ApiResult<MenuType[]>> =>
  request.get('/api/admin/menu/tree', { params });

/**
 * 获取菜单分页
 * @param params
 */
export const getMenuListApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/menu/list', { params });
/**
 * 获取菜单详情
 * @param params
 */
export const getMenuApi = (params): Promise<ApiResult<any>> => request.get('/api/admin/menu', { params });
/**
 * 新增菜单
 * @param data
 */
export const addMenuApi = (data): Promise<ApiResult<any>> => request.post('/api/admin/menu', data);
/**
 * 更新菜单
 * @param data
 */
export const updateMenuApi = (data): Promise<ApiResult<any>> => request.put('/api/admin/menu', data);
/**
 * 删除菜单
 * @param data
 */
export const deleteMenuApi = (data): Promise<ApiResult<any>> => request.delete('/api/admin/menu', { data });
