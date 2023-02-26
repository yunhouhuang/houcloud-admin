<template>
  <router-view :class="[mode]" />
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import config from '@/config/style';
import { useSettingStore, useUserStore } from '@/store';

const store = useSettingStore();

const mode = computed(() => {
  return store.displayMode;
});
const router = useRouter();
const userStore = useUserStore();
onMounted(() => {
  if (userStore.token) {
    userStore.getUserInfo();
  }
  store.updateConfig({ ...config });
});
watch(
  () => userStore.loginExpired,
  () => {},
);
</script>
<style lang="less" scoped>
@import '@/style/variables.less';
#nprogress .bar {
  background: var(--td-brand-color) !important;
}
</style>
