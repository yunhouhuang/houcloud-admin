<template>
  <result title="403 Forbidden" tip="抱歉，您无权限访问此页面">
    <div class="dpr-center-center">
      <t-button class="mx-2" @click="() => router.back()">返回前页</t-button>
      <t-button class="mx-2" @click="() => router.push('/')">去往首页</t-button>
    </div>
  </result>
</template>
<script lang="ts">
export default {
  name: 'Result403',
};
</script>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import Result from '@/components/result/index.vue';

const router = useRouter();
</script>
