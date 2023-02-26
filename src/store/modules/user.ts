import { defineStore } from 'pinia';
import { LOGIN_REDIRECT, PERSONAL_INFO, ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/config/global';
import { store, usePermissionStore } from '@/store';
import { logoutApi, passwordLoginApi } from '@/api/login';
import { personalInfoApi } from '@/api/personal';
import router from '@/router';

const InitUserInfo = {
  id: 0,
  avatar: '',
  username: '',
  mobile: '',
  nickname: '未登录',
  permissions: [],
};

interface UserInfoType {
  id: number;
  avatar: string;
  username: string;
  nickname: string;
  mobile: string;
  intro: string;
  permissions: string[];
}

export const useUserStore = defineStore('user', {
  state: () => ({
    redirect: localStorage.getItem(LOGIN_REDIRECT) || null,
    token: localStorage.getItem(ACCESS_TOKEN_NAME) || null,
    userInfo: localStorage.getItem(PERSONAL_INFO) ? JSON.parse(localStorage.getItem(PERSONAL_INFO)) : InitUserInfo,
    loginExpired: false,
  }),
  getters: {
    permissions: (state) => {
      return state.userInfo?.permissions;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const permissionStore = usePermissionStore();
      const res = await passwordLoginApi(userInfo);
      if (res.success) {
        this.token = res.result.access_token;
        localStorage.setItem(ACCESS_TOKEN_NAME, this.token);
        localStorage.setItem(REFRESH_TOKEN_NAME, res.result.refresh_token);
        await permissionStore.initAsyncRouter();
        const { asyncRouters } = permissionStore;
        asyncRouters.forEach((asyncRouter) => {
          router.addRoute(asyncRouter);
        });
        return res.result;
      }
      throw res;
    },
    async getUserInfo() {
      const res = await personalInfoApi();
      this.userInfo = res.result;
      localStorage.setItem(PERSONAL_INFO, JSON.stringify(res.result || {}));
      return this.userInfo;
    },
    async logout() {
      await logoutApi();
      console.log('退出登录');
      localStorage.removeItem(ACCESS_TOKEN_NAME);
      localStorage.removeItem(REFRESH_TOKEN_NAME);
      localStorage.removeItem(PERSONAL_INFO);
      sessionStorage.clear();
      usePermissionStore().asyncRouterFlag = 0;
      usePermissionStore().asyncRouters = [];
      this.token = '';
      this.userInfo = InitUserInfo;
    },
    async loginExpiredNotice() {
      if (this.loginExpired === true) {
        this.loginExpired = false;
      }
      await this.logout();
      this.loginExpired = true;
    },
    async closeLoginDialog() {
      this.loginExpired = false;
    },
    async removeToken() {
      this.token = '';
      localStorage.removeItem(ACCESS_TOKEN_NAME);
    },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
