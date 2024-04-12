<template>
  <div :class="sideNavCls">
    <t-menu :class="menuCls" :theme="theme" :value="active" :collapsed="collapsed" :default-expanded="defaultExpanded">
      <template #logo>
        <span v-if="showLogo" class="flex justify-start" @click="goHome">
          <component :is="getLogo()" class="max-h-[35px] max-w-[130px]" />
        </span>
      </template>
      <menu-content :nav-data="menu" />
      <template #operations>
        <span class="version-container"> {{ !collapsed ? 'HOUCLOUD' : '' }} {{ pgk.version }} </span>
      </template>
    </t-menu>
    <div :class="`${prefix}-side-nav-placeholder${collapsed ? '-hidden' : ''}`"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import union from 'lodash/union';

defineComponent({
  name: 'SideNav',
});
import { useSettingStore, useUserStore } from '@/store';
import { prefix } from '@/config/global';
import pgk from '../../../package.json';
import { MenuRoute } from '@/types/interface';
import { getActive, getRoutesExpanded } from '@/router';

import AssetLogo from '@/assets/logo.svg?component';
import DarkFullLogo from '@/assets/logo-full.svg?component';
import LightFullLogo from '@/assets/logo-full.svg?component';
import MenuContent from './MenuContent.vue';

const userStore = useUserStore();
const MIN_POINT = 992 - 1;
const userInfo = ref(userStore.userInfo);
const props = defineProps({
  menu: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
  showLogo: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  isFixed: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  layout: {
    type: String as PropType<string>,
    default: '',
  },
  headerHeight: {
    type: String as PropType<string>,
    default: '64px',
  },
  theme: {
    type: String as PropType<string>,
    default: 'light',
  },
  isCompact: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});
watch(
  () => userStore.userInfo,
  (value) => {
    userInfo.value = value;
  },
);
const collapsed = computed(() => useSettingStore().isSidebarCompact);

const active = computed(() => getActive());

const defaultExpanded = computed(() => {
  const path = getActive();
  const parentPath = path.substring(0, path.lastIndexOf('/'));
  const expanded = getRoutesExpanded();
  return union(expanded, parentPath === '' ? [] : [parentPath]);
});

const sideNavCls = computed(() => {
  const { isCompact } = props;
  return [
    `${prefix}-sidebar-layout`,
    {
      [`${prefix}-sidebar-compact`]: isCompact,
    },
  ];
});

const menuCls = computed(() => {
  const { showLogo, isFixed, layout } = props;
  return [
    `${prefix}-side-nav`,
    {
      [`${prefix}-side-nav-no-logo`]: !showLogo,
      [`${prefix}-side-nav-no-fixed`]: !isFixed,
      [`${prefix}-side-nav-mix-fixed`]: layout === 'mix' && isFixed,
    },
  ];
});

const router = useRouter();
const settingStore = useSettingStore();

const autoCollapsed = () => {
  const isCompact = window.innerWidth <= MIN_POINT;
  settingStore.updateConfig({
    isSidebarCompact: isCompact,
  });
};

onMounted(() => {
  autoCollapsed();
  window.onresize = () => {
    autoCollapsed();
  };
});

const goHome = () => {
  router.push('/');
};

const getLogo = () => {
  if (collapsed.value) return AssetLogo;
  if (props.theme === 'dark') {
    return DarkFullLogo;
  }
  return LightFullLogo;
};
</script>

<style lang="less" scoped></style>
Z=
