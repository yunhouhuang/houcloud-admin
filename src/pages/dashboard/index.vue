<template>
  <div>
    <top-panel />
    <ad-line-chart class="mt-4" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, ref } from 'vue';
import TopPanel from './components/TopPanel.vue';
import AdLineChart from '@/pages/dashboard/components/AdLineChart.vue';

onMounted(() => {});
</script>

<style lang="less" scoped></style>
