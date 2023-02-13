import { defineStore } from 'pinia';
import { TRouterInfo, TTabRouterType } from '@/types/interface';
import { store } from '@/store';

const homeRoute: Array<TRouterInfo> = [
  {
    path: '/',
    routeIdx: 0,
    title: '控制台',
    name: 'Dashboard',
    isHome: true,
  },
];
interface TabsRouterState {
  tabRouterList: any[];
  isRefreshing: boolean;
}
const state: TabsRouterState = {
  tabRouterList: homeRoute,
  isRefreshing: false,
};

// 不需要做多标签tabs页缓存的列表 值为每个页面对应的name 如 DashboardDetail
// const ignoreCacheRoutes = ['DashboardDetail'];
const ignoreCacheRoutes = ['login'];

export const useTabsRouterStore = defineStore('tabsRouter', {
  state: () => state,
  persist: true,
  getters: {
    tabRouters: (state: TTabRouterType) => state.tabRouterList,
    refreshing: (state: TTabRouterType) => state.isRefreshing,
  },
  actions: {
    // 处理刷新
    toggleTabRouterAlive(routeIdx: number) {
      this.isRefreshing = !this.isRefreshing;
      this.tabRouters[routeIdx].isAlive = !this.tabRouters[routeIdx].isAlive;
    },
    // 处理新增
    appendTabRouterList(newRoute: TRouterInfo) {
      const needAlive = !ignoreCacheRoutes.includes(newRoute.name as string);
      if (!this.tabRouters.find((route: TRouterInfo) => route.path === newRoute.path)) {
        this.tabRouterList.push({ ...newRoute, isAlive: needAlive });
        // 最大存放
        if (this.tabRouterList.length > 10) {
          this.tabRouterList.splice(1, 1);
        }
      }
    },
    // 处理关闭当前
    subtractCurrentTabRouter(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      this.tabRouterList = this.tabRouterList.slice(0, routeIdx).concat(this.tabRouterList.slice(routeIdx + 1));
    },
    // 处理关闭右侧
    subtractTabRouterBehind(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      this.tabRouterList = this.tabRouterList.slice(0, routeIdx + 1);
    },
    // 处理关闭左侧
    subtractTabRouterAhead(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      this.tabRouterList = homeRoute.concat(this.tabRouterList.slice(routeIdx));
    },
    // 处理关闭其他
    subtractTabRouterOther(newRoute: TRouterInfo) {
      const { routeIdx } = newRoute;
      this.tabRouterList = routeIdx === 0 ? homeRoute : homeRoute.concat([this.tabRouterList?.[routeIdx]]);
    },
    removeTabRouterList() {
      this.tabRouterList = [];
    },
    initTabRouterList(newRoutes: TRouterInfo[]) {
      newRoutes?.forEach((route: TRouterInfo) => this.appendTabRouterList(route));
    },
  },
});

export function getTabsRouterStore() {
  return useTabsRouterStore(store);
}
