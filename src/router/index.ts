import { useRoute, createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import uniq from 'lodash/uniq';
import resultRoutes from './modules/result';
import personalRoutes from './modules/personal';

// 关于单层路由，meta 中设置 { single: true } 即可为单层路由，{ hidden: true } 即可在侧边栏隐藏该路由

// 存放固定的路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      white: true,
    },
    component: () => import('@/pages/login/index.vue'),
  },
  ...resultRoutes,
  ...personalRoutes,
];

export const allRoutes = [...defaultRouterList];

export const getRoutesExpanded = () => {
  const expandedRoutes = [];
  allRoutes.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        // @ts-ignore
        .filter((child) => child.meta?.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push({ name: item.name });
          expandedRoutes.push({ name: child.name });
        });
    }
  });
  return uniq(expandedRoutes);
};

export const getActive = (maxLevel = 3): string => {
  const route = useRoute();
  // @ts-ignore
  if (route.meta?.hidden && route.meta?.matched && route.meta?.matched.length) {
    return route.meta.matched[0].name;
  }
  if (!route.name || typeof route.name !== 'string') {
    return '';
  }
  return route.name;
};

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;
