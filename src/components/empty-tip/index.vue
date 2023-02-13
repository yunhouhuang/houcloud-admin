<template>
  <div class="empty-tip-content">{{ tip }}</div>
</template>

<script lang="ts">
export default {
  name: 'EmptyTip',
};
</script>
<script lang="ts" setup>
const props = defineProps({
  tip: {
    type: String,
    default: '暂无数据',
  },
});
</script>

<style lang="less" scoped>
.empty-tip-content {
  color: var(--td-text-color-placeholder);
  width: 100%;
  text-align: center;
}
</style>
