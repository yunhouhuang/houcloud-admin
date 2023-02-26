import { ConfigEnv, UserConfig, loadEnv } from 'vite';

import path from 'path';
import createVitePlugins from './vite-plugins/index';
// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv, command: string): UserConfig => {
  console.log('开始构建');
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_URL,
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
    },
    plugins: createVitePlugins(env, command === 'build'),
    server: {
      port: 3333,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:1027',
          changeOrigin: true,
          configure: (proxy, options) => {
            console.log(proxy, options);
            // proxy 是 'http-proxy' 的实例
          },
        },
      },
    },
  };
};
