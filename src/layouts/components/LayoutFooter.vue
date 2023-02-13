<template>
  <div :class="prefix + '-footer'">© {{ new Date().getFullYear() }} HOUCLOUD</div>
</template>

<script setup lang="ts">
import { prefix } from '@/config/global';
</script>

<style lang="less" scoped>
.@{prefix}-footer {
  color: var(--tdvns-text-color-placeholder);
  line-height: 20px;
  text-align: center;
}
</style>
