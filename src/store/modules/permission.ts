import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from '@/store';
import { getMenuTreeApi } from '@/api/menu';
import { asyncRouterHandle } from '@/utils/router-util';

const routerListArr = [];
const nameMap = {};

/**
 * 格式化动态路由
 * @param routes
 * @param routeMap
 */
const formatRouter = (routes, routeMap) => {
  routes.forEach((item) => {
    if ((!item.children || item.children.every((ch) => ch.hidden)) && item.name !== '404' && !item.hidden) {
      routerListArr.push({ label: item.title, value: item.name });
    }
    item.meta = {};
    item.meta.icon = item.icon;
    item.meta.weight = item.weight;
    item.meta.single = item.single;
    item.meta.hidden = item.hidden;
    item.meta.keepAlive = item.keepAlive;
    item.meta.permission = item.permission;
    item.meta.title = item.title;
    routeMap[item.name] = item;
    if (item.children && item.children.length > 0) {
      formatRouter(item.children, routeMap);
    }
  });
};

/**
 * 筛选持久路由
 * @param routes
 * @param keepAliveRouters
 * @constructor
 */
const keepAliveFilter = (routes, keepAliveRouters: string[]) => {
  routes.forEach((item) => {
    if ((item.children && item.children.some((ch) => ch.meta.keepAlive)) || item.meta.keepAlive) {
      if (item.component) {
        item.component().then((val) => {
          if (val.default.name) {
            keepAliveRouters.push(val.default.name);
          }
          nameMap[item.name] = val.default.name;
        });
      }
    }
    if (item.children && item.children.length > 0) {
      keepAliveFilter(item.children, keepAliveRouters);
    }
  });
};

export const usePermissionStore = defineStore('permission', () => {
  const keepAliveRouters = ref([]);
  const asyncRouterFlag = ref(0);
  const asyncRouters = ref([]);
  const routerList = ref(routerListArr);
  const routeMap = {};
  // 从后台获取动态路由
  const initAsyncRouter = async () => {
    asyncRouterFlag.value++;
    asyncRouters.value = [];
    const res = await getMenuTreeApi();
    const asyncRouter = res.result || [];
    if (!asyncRouter || !asyncRouter.length) {
      console.log('后端返回的路由为空');
    }
    formatRouter(asyncRouter, routeMap);
    asyncRouterHandle(asyncRouter);
    keepAliveFilter(asyncRouter, keepAliveRouters.value);
    asyncRouters.value.push(...asyncRouter);
    asyncRouters.value.push({
      path: '/:catchAll(.*)',
      name: '404Page',
      redirect: '/404',
    });
    routerList.value = routerListArr;
  };

  /**
   * 重置路由
   */
  const restore = async () => {};

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    asyncRouterFlag,
    initAsyncRouter,
    restore,
    routeMap,
  };
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
