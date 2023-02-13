<template>
  <div :class="prefix + '-footer'">&copy; {{ new Date().getFullYear() }} HOUCLOUD ｜ Yunhou·Huang</div>
</template>

<script setup lang="ts">
import { prefix } from '@/config/global';
</script>

<style lang="less" scoped>
.@{starter-prefix}-footer {
  color: var(--td-text-color-placeholder);
  line-height: 20px;
  text-align: center;
}
</style>
