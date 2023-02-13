<template>
  <result title="系统维护中" tip="系统维护中，请稍后再试" type="maintenance">
    <div class="dpr-center-center">
      <t-button class="mx-2" @click="() => router.back()">返回前页</t-button>
      <t-button variant="outline" class="mx-2" @click="() => router.push('/')">去往首页</t-button>
    </div>
  </result>
</template>

<script lang="ts">
export default {
  name: 'ResultMaintenance',
};
</script>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import Result from '@/components/result/index.vue';

const router = useRouter();
</script>
