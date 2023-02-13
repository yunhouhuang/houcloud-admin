import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import { NavigationGuardNext } from 'vue-router';
import { getPermissionStore, getUserStore, usePermissionStore } from '@/store';
import router from '@/router';
import { APP_NAME } from '@/config/global';

const permissionStore = getPermissionStore();
const userStore = getUserStore();

NProgress.configure({ showSpinner: false });

const addRouters = async () => {
  await permissionStore.initAsyncRouter();
  const { asyncRouters } = permissionStore;
  asyncRouters.forEach((asyncRouter) => {
    router.addRoute(asyncRouter);
  });
};

router.beforeEach(async (to, from, next: NavigationGuardNext) => {
  NProgress.start();
  to.meta.matched = [...to.matched];
  document.title = `${to.meta?.title || '后台管理'} - ${APP_NAME}`;
  const { token } = userStore;
  if (token) {
    if (to.path === '/login') {
      next(`/`);
    } else {
      const { asyncRouters } = permissionStore;
      if (!asyncRouters || !asyncRouters.length) {
        try {
          await addRouters();
        } catch (e) {
          await userStore.logout();
          next(`/login`);
        }
      }
      if (!to.matched || !to.matched.length) {
        // 重新触发
        next({ path: to.fullPath, replace: true, query: to.query });
      } else {
        next();
      }
    }
  } else {
    /* 忽略白名单 */
    if (to.meta?.white) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
