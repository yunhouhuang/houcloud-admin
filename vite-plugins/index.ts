import svgLoader from 'vite-svg-loader';
import createVuePlugin from '@vitejs/plugin-vue';
import createCompression from './compression';
import createJsx from './tsx';

export default function createVitePlugins(viteEnv: any, isBuild = false) {
  const vitePlugins = [createVuePlugin()];
  vitePlugins.push(createJsx());
  if (isBuild) {
    vitePlugins.push(...createCompression(viteEnv));
  }
  vitePlugins.push(svgLoader());
  return vitePlugins;
}
