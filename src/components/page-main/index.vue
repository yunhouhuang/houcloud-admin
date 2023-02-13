<template>
  <div
    :class="{
      'page-main': true,
      'is-collaspe': collaspeData,
    }"
    :style="{
      height: collaspeData ? height : '',
    }"
  >
    <div v-if="title" class="title-container">{{ title }}</div>
    <slot />
    <div v-if="collaspeData" class="collaspe" title="展开" @click="unCollaspe">
      <arrow-down-icon />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'PageMain',
};
</script>
<script setup lang="ts">
import { ArrowDownIcon } from 'tdesign-icons-vue-next';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  collaspe: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '',
  },
});

const collaspeData = ref(props.collaspe);

function unCollaspe() {
  collaspeData.value = false;
}
</script>

<style lang="less" scoped>
.page-main {
  position: relative;
  padding: 20px;
  background-color: var(--td-bg-color-container);
  &.is-collaspe {
    overflow: hidden;
    .collaspe {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 40px 0 10px;
      text-align: center;
      font-size: 24px;
      color: var(--td-text-color-secondary);
      text-shadow: 0 0 1px var(--td-bg-color-container);
      background: linear-gradient(to bottom, transparent, var(--td-bg-color-container));
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: #333;
      }
    }
  }
  .title-container {
    width: calc(100% + 40px);
    padding: 14px 20px;
    margin-left: -20px;
    margin-top: -20px;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--td-border-level-2-color);
  }
}
</style>
