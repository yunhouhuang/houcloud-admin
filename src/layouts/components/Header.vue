<template>
  <div :class="layoutCls">
    <t-head-menu :class="menuCls" :theme="theme" expand-type="normal" :value="active">
      <template #logo>
        <span v-if="showLogo" class="header-logo-container" @click="handleNav('/')">
          <logo-full class="t-logo" />
        </span>
        <div v-else class="header-operate-left">
          <t-button theme="default" shape="square" variant="text" @click="changeCollapsed">
            <t-icon class="collapsed-icon" name="view-list" />
          </t-button>
          <search :layout="layout" />
        </div>
      </template>
      <menu-content v-show="layout !== 'side'" class="header-menu" :nav-data="menu" />
      <template #operations>
        <div class="operations-container">
          <!-- 搜索框 -->
          <search v-if="layout !== 'side'" :layout="layout" />
          <div v-show="showMenu" class="mx-2 dpr-center-center">
            <t-radio-group v-model="sysConfig.mode" variant="default-filled" size="medium" @change="setTheme">
              <t-radio-button value="light">
                <light-theme-icon class="theme-btn" height="12" width="12" />
              </t-radio-button>
              <t-radio-button value="dark">
                <dark-theme-icon class="theme-btn" height="12" width="12" />
              </t-radio-button>
              <t-radio-button class="theme-btn" value="auto"> <sys-theme-icon height="12" width="12" /></t-radio-button>
            </t-radio-group>
          </div>
          <div class="dpr-center-start">
            <!-- 全局通知 -->
            <div v-if="userInfo.id" class="dpr-center-start">
              <notice />
              <t-dropdown :min-column-width="135" trigger="click">
                <template #dropdown>
                  <t-dropdown-menu>
                    <t-dropdown-item class="operations-dropdown-container-item" @click="handleNav('/personal/index')">
                      <t-icon name="user-circle"></t-icon>
                      个人中心
                    </t-dropdown-item>
                    <t-dropdown-item class="operations-dropdown-container-item" @click="handleLogout">
                      <t-icon name="poweroff"></t-icon>
                      退出登录
                    </t-dropdown-item>
                  </t-dropdown-menu>
                </template>
                <div>
                  <t-button class="header-user-btn" theme="default" variant="text">
                    <template #icon>
                      <t-avatar size="22px" class="header-user-avatar" :image="userInfo.avatar" />
                    </template>
                    <div v-if="showMenu" class="header-user-account ml-2">
                      {{ userInfo.nickname }}
                      <t-icon name="chevron-down" />
                    </div>
                  </t-button>
                </div>
              </t-dropdown>
            </div>
          </div>
          <t-tooltip placement="bottom" content="系统设置">
            <t-button theme="default" shape="square" variant="text">
              <t-icon name="setting" @click="toggleSettingPanel" />
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-head-menu>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, onMounted, onUnmounted, watchEffect, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingStore, useUserStore } from '@/store';
import DarkThemeIcon from '@/assets/svg/dark-theme.svg';
import LightThemeIcon from '@/assets/svg/light-theme.svg';
import SysThemeIcon from '@/assets/svg/sys-theme.svg';
import { getActive } from '@/router';
import { prefix } from '@/config/global';
import LogoFull from '@/assets/logo-full.svg?component';
import { MenuRoute } from '@/types/interface';
import STYLE_CONFIG from '@/config/style';
import Notice from './Notice.vue';
import Search from './Search.vue';
import MenuContent from './MenuContent.vue';

const props = defineProps({
  theme: {
    type: String,
    default: '',
  },
  layout: {
    type: String,
    default: 'top',
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
  menu: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
  isCompact: {
    type: Boolean,
    default: false,
  },
  maxLevel: {
    type: Number,
    default: 3,
  },
});

const userStore = useUserStore();
const router = useRouter();
const settingStore = useSettingStore();
const displayMode = ref(settingStore.displayMode);
const userInfo = computed(() => {
  return userStore.userInfo;
});
const sysConfig = ref({ ...STYLE_CONFIG });
const setTheme = (mode: string) => {
  let theme = mode;
  if (mode === 'auto') {
    const media = window.matchMedia('(prefers-color-scheme:dark)');
    if (media.matches) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
  }
  displayMode.value = theme;
  if (mode === 'auto' || mode === 'dark' || mode === 'light') {
    settingStore.changeMode(mode);
  }
  document.documentElement.setAttribute('theme-mode', theme);
};

const toggleSettingPanel = () => {
  settingStore.updateConfig({
    showSettingPanel: true,
  });
};
const showMenu = ref(false);
const showLogin = () => {
  userStore.showLoginDialog();
};
const showMenuFun = () => {
  showMenu.value = window.innerWidth >= 780;
};

const active = computed(() => getActive());

const layoutCls = computed(() => [`${prefix}-header-layout`]);

const menuCls = computed(() => {
  const { isFixed, layout, isCompact } = props;
  return [
    {
      [`${prefix}-header-menu`]: !isFixed,
      [`${prefix}-header-menu-fixed`]: isFixed,
      [`${prefix}-header-menu-fixed-side`]: layout === 'side' && isFixed,
      [`${prefix}-header-menu-fixed-side-compact`]: layout === 'side' && isFixed && isCompact,
    },
  ];
});

const changeCollapsed = () => {
  settingStore.updateConfig({
    isSidebarCompact: !settingStore.isSidebarCompact,
  });
};

const handleNav = (url) => {
  router.push(url);
};

const handleLogout = () => {
  userStore.logout().then(() => {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
  });
};
const windowScreen = () => {
  showMenuFun();
};
onUnmounted(() => {
  // 页面销毁的时候移除监听 屏幕的变化  调用方法
  window.removeEventListener('resize', windowScreen);
});
onMounted(() => {
  showMenuFun();
  window.addEventListener('resize', windowScreen);
  displayMode.value = settingStore.displayMode;
});
watch(
  () => settingStore.mode,
  () => {
    displayMode.value = settingStore.displayMode;
  },
);

watchEffect(() => {
  settingStore.updateConfig(sysConfig.value);
});
</script>
<style lang="less" scoped>
@import '@/style/variables.less';
.@{starter-prefix}-header {
  &-layout {
    height: 64px;
  }

  &-menu-fixed {
    position: fixed;
    top: 0;
    z-index: 1001;

    &-side {
      left: 232px;
      right: 0;
      z-index: 10;
      width: auto;
      transition: all 0.3s;
      &-compact {
        left: 64px;
      }
    }
  }

  &-logo-container {
    cursor: pointer;
    display: inline-flex;
    height: 64px;
  }
}
.theme-btn {
  fill: var(--td-text-color-primary);
}
.header-menu {
  flex: 1 1 1;
  display: inline-flex;

  :deep(.t-menu__item) {
    min-width: unset;
    padding: 0px 16px;
  }
}

.operations-container {
  display: flex;
  align-items: center;
  margin-right: 12px;
  .t-popup__reference {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .t-button {
    margin: 0 8px;
    &.header-user-btn {
      margin: 0;
    }
  }

  .t-icon {
    font-size: 20px;
    &.general {
      margin-right: 16px;
    }
  }
}

.header-operate-left {
  display: flex;
  margin-left: 20px;
  align-items: normal;
  line-height: 0;

  .collapsed-icon {
    font-size: 20px;
  }
}

.header-logo-container {
  width: 184px;
  height: 50px;
  display: flex;
  margin-left: 24px;
  color: var(--td-text-color-primary);

  .t-logo {
    width: 100%;
    height: 100%;
    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

.header-user-account {
  display: inline-flex;
  align-items: center;
  color: var(--td-text-color-primary);
  .t-icon {
    margin-left: 4px;
    font-size: 16px;
  }
}

:deep(.t-head-menu__inner) {
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.t-menu--light {
  .header-user-account {
    color: var(--td-text-color-primary);
  }
}
.t-menu--dark {
  .t-head-menu__inner {
    border-bottom: 1px solid var(--td-gray-color-10);
  }
  .header-user-account {
    color: rgba(255, 255, 255, 0.55);
  }
  .t-button {
    --ripple-color: var(--td-gray-color-10) !important;
    &:hover {
      background: var(--td-gray-color-12) !important;
    }
  }
}

.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;

  .t-icon {
    margin-right: 8px;
  }

  :deep(.t-dropdown__item) {
    .t-dropdown__item_Content {
      display: flex;
      justify-content: center;
    }
    .t-dropdown__item_Content__text {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  :deep(.t-dropdown__item) {
    width: 100%;
    margin-bottom: 0;
  }
  &:last-child {
    :deep(.t-dropdown__item) {
      margin-bottom: 8px;
    }
  }
}
</style>
