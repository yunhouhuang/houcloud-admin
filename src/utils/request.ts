import axios from 'axios';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import NotificationPlugin from 'tdesign-vue-next/es/notification/plugin';
import router from '@/router';
import { useUserStore } from '@/store';

const host = '';

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: 1,
};
let logoutLoading = false;
export const toLogin = () => {
  if (logoutLoading) {
    return;
  }
  MessagePlugin.error('授权凭证已过期').then(() => {});
  logoutLoading = true;
  const userStore = useUserStore();
  const { fullPath } = router.currentRoute.value;
  userStore
    .logout()
    .then(() => {
      router.push(`/login?redirect=${fullPath}`);
    })
    .finally(() => {
      setTimeout(() => {
        logoutLoading = false;
      }, 1000);
    });
};

export interface ApiResult<T> {
  code: number;
  success: boolean;
  message: string;
  type?: string;
  result: T;
}

export const refreshPage = () => {
  router.go(0);
};
export const toHome = () => {
  return router.push('/').then();
};
export const result403 = (message) => {
  console.log('无权访问');
  NotificationPlugin.error({ title: '无此权限', content: message || '您未获得该权限，无法继续' });
  // router.push(`/403?redirect=${router.currentRoute.value.fullPath}`).then();
};
export const result500 = () => {
  console.log('服务器错误');
  router.push(`/500?redirect=${router.currentRoute.value.fullPath}`).then();
};

const instance = axios.create({
  baseURL: host,
  timeout: 12000,
  withCredentials: true,
  responseType: 'json',
});

instance.interceptors.request.use((config) => {
  return config;
});

instance.interceptors.request.use((request) => {
  const userStore = useUserStore();
  const { token } = userStore;
  /**
   * 全局拦截请求发送前提交的参数
   * 以下代码为示例，在请求头里带上 token 信息
   */
  if (token) {
    console.log('已登录');
    request.headers.Authorization = `Bearer ${token}`;
  }
  // 是否将 POST 请求参数进行字符串化处理
  if (request.method === 'post') {
    // request.data = qs.stringify(request.data, {
    //     arrayFormat: 'brackets'
    // })
  }
  return request;
});

instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    const message = data?.message || '未知错误';
    // 成功
    if (response.status === 200) {
      if (data.code === CODE.REQUEST_SUCCESS) {
        return data;
      }
    }
    // 未授权
    if (response.data.code === 401 || response.status === 401) {
      toLogin();
      return data;
    }
    // 其他错误
    MessagePlugin.error(message).then(() => {});
    return data;
  },
  (err) => {
    const { response } = err;
    const { config } = err;
    console.log('请求错误:', err);
    if (err.code === 'ECONNABORTED') {
      NotificationPlugin.error({ title: '服务无响应', content: '当前网络较差，请稍后再试。' }).then((r) => {});
      return Promise.reject(err);
    }
    if (err.code === 'ERR_NETWORK') {
      const networkErrorDialog = DialogPlugin.alert({
        header: '网络繁忙',
        body: '很抱歉！当前访问人数较多，稍后再刷新试试看吧。',
        confirmBtn: {
          content: '刷新重试',
          variant: 'base',
          theme: 'danger',
        },
        onConfirm: ({ e }) => {
          networkErrorDialog.destroy();
          refreshPage();
        },
        onClose: ({ e, trigger }) => {
          networkErrorDialog.destroy();
        },
      });
      return Promise.reject(err);
    }
    if (!response) {
      MessagePlugin.error('请求无响应').then(() => {});
      return Promise.reject(err);
    }
    if (response.status === 404) {
      MessagePlugin.error('资源未找到').then(() => {});
      return Promise.reject(err);
    }
    // 请求或参数异常
    if (response.status === 400 && response.data.code !== 1) {
      const message = response.data.message || '请求异常';
      MessagePlugin.error(message).then(() => {});
    }
    // 未授权
    if (response.data.code === 401 || response.status === 401) {
      MessagePlugin.error('授权凭证已过期').then(() => {});
      toLogin();
    }
    // 无权访问
    if (response.data.code === 403 || response.status === 403) {
      result403(response.data.message);
    }
    if (response.data.code === 500 || response.status === 500) {
      NotificationPlugin.error({
        title: '服务器繁忙',
        content: '服务器出现意外，故障信息已自动上报至技术团队，请稍后再试.',
      });
      // result500();
    }
    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }
    config.retryCount += 1;

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);

export default instance;
