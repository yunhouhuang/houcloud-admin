import { createApp } from 'vue';

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import { store, useUserStore } from './store';
import router from './router';
import '@/style/index.less';
import './permission';
import App from './App.vue';

const app = createApp(App);

app.directive('permission', {
  mounted(el, binding) {
    // console.log(binding.value);
    const permissions = useUserStore().userInfo?.permissions;
    // console.log(permissions);
    if (!permissions || !permissions.length) {
      el.style.display = 'none';
      return;
    }
    if (permissions.indexOf(binding.value) === -1) {
      el.style.display = 'none';
    }
  },
});

app.use(TDesign);
app.use(store);
app.use(router);

app.mount('#app');
