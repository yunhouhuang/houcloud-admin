<template>
  <header class="login-header">
    <div style="font-size: 12px">V{{ pgk.version }}</div>
    <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
        <t-icon name="bulletpoint" class="icon" />
      </t-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import pgk from '../../../../package.json';
import { useSettingStore } from '@/store';

const themeMode = ref('light');

const router = useRouter();

const settingStore = useSettingStore();
const toggleSettingPanel = () => {
  settingStore.updateConfig({
    showSettingPanel: true,
  });
};
watch(
  () => settingStore.mode,
  () => {
    themeMode.value = settingStore.displayMode;
  },
);
onMounted(() => {
  themeMode.value = settingStore.displayMode;
});
</script>

<style lang="less" scoped>
@import '@/style/variables.less';
.login-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: var(--tdvns-text-color-primary);

  .logo {
    width: 200px;
    height: 80px;
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
