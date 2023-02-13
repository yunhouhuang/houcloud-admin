<template>
  <div class="login-wrapper">
    <login-header />
    <div class="login-container">
      <div class="title-container">
        <logo-full />
      </div>
      <login v-if="type === 'login'" />
      <setting />
    </div>

    <footer class="copyright">
      <p>
        &copy;&nbsp;{{ new Date().getFullYear() }} <span style="font-weight: bold">HOUCLOUD</span> |
        <a href="https://lateotu.com">Yunhou·Huang</a>
        <span class="ml-1"></span>
      </p>
    </footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import LogoFull from '@/assets/logo-full.svg?component';
import Login from './components/Login.vue';
import LoginHeader from './components/Header.vue';
import Setting from '@/layouts/setting.vue';

const type = ref('login');
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
