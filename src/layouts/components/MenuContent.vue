<template>
  <div>
    <template v-for="item in list" :key="item.name">
      <template v-if="!item.children || !item.children.length || item.meta?.single">
        <t-menu-item v-if="getHref(item)" :name="item.name" :value="item.name" @click="handleHref(getHref(item)[0])">
          <template v-if="item.icon" #icon>
            <icon v-if="beIcon(item)" url="/iconfont/iconfont.js" :name="item.icon" />
            <icon v-else :name="item.icon" />
          </template>
          {{ item.title }}
        </t-menu-item>
        <t-menu-item v-else :name="item.name" :value="item.name" :to="{ name: item.name }">
          <template v-if="item.icon" #icon>
            <icon v-if="beIcon(item)" url="/iconfont/iconfont.js" :name="item.icon" />
            <icon v-else :name="item.icon" />
          </template>
          {{ item.title }}
        </t-menu-item>
      </template>
      <t-submenu v-else :name="item.name" :value="item.name" :title="item.title">
        <template #icon>
          <icon v-if="beIcon(item)" url="/iconfont/iconfont.js" :name="item.icon" />
          <icon v-else :name="item.icon" />
        </template>
        <menu-content v-if="item.children" :nav-data="item.children" />
      </t-submenu>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Icon } from 'tdesign-icons-vue-next';
import isObject from 'lodash/isObject';
import { MenuRoute } from '@/types/interface';

const props = defineProps({
  navData: {
    type: Array as PropType<MenuRoute[]>,
    default: () => [],
  },
});
const handleHref = (url: string) => {
  window.open(url);
};
const getMenuList = (list: MenuRoute[]): MenuRoute[] => {
  if (!list) {
    return [];
  }
  // 如果meta中有weight则按照从大到小排序
  list.sort((a, b) => {
    return (b.meta?.weight || 0) - (a.meta?.weight || 0);
  });
  return list
    .map((item) => {
      const icon = item.meta?.icon || '';
      return {
        name: item.name,
        path: item.path,
        title: item.meta?.title,
        icon,
        children: getMenuList(item.children),
        meta: item.meta,
        redirect: item.redirect,
      };
    })
    .filter((item) => item.meta && item.meta.hidden !== true);
};
const list = computed(() => {
  const { navData } = props;
  return getMenuList(navData);
});

const getHref = (item: MenuRoute) => {
  return item.path.match(/(http|https):\/\/([\w.]+\/?)\S*/);
};
const beIcon = (item: MenuRoute) => {
  // 是否为第三方图标
  return item.icon && typeof item.icon === 'string' && item.icon.indexOf('icon-') !== -1;
};

const beRender = (item: MenuRoute) => {
  if (isObject(item.icon) && typeof item.icon.render === 'function') {
    return {
      can: true,
      render: item.icon.render,
    };
  }
  return {
    can: false,
    render: null,
  };
};
</script>

<style lang="less" scoped></style>
