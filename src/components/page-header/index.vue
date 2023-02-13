<template>
  <div class="page-header">
    <div class="dpr-center-start">
      <div class="page-header-back" @click="handleBack">
        <chevron-left-icon size="30" />
      </div>
      <div class="page-header-title text-line1">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div class="page-header-sub-title">{{ subTitle }}</div>
    </div>
    <div class="dpr-center-end">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PageHeader',
};
</script>
<script lang="ts" setup>
import { ArrowLeftIcon, ChevronLeftIcon } from 'tdesign-icons-vue-next';
import { PropType } from 'vue';

const props = defineProps({
  title: {
    type: String as PropType<string>,
    default: '',
  },
  subTitle: {
    type: String as PropType<string>,
    default: '',
  },
  backBtn: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});
const emit = defineEmits(['onBack']);

const handleBack = () => {
  emit('onBack');
};
</script>
<style lang="less" scoped>
.page-header {
  padding-right: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  min-height: 60px;
  margin-bottom: 20px;
  box-shadow: var(--td-bg-color-page) 1px 2px 2px 2px;
  background-color: var(--td-bg-color-container);
  &-back {
    color: var(--td-text-color-secondary);
    padding: 4px 16px;
    cursor: pointer;
    &:hover {
      color: var(--td-text-color-primary);
    }
  }
  &-title {
    font-size: 22px;
    font-weight: bold;
  }
  &-sub-title {
    padding-left: 12px;
    font-size: 14px;
    color: var(--td-text-color-placeholder);
  }
}
</style>
