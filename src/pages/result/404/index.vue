<template>
  <result title="404 Not Found" tip="抱歉，您访问的页面不存在" type="404">
    <div class="dpr-center-center">
      <t-button class="mx-2" @click="() => router.back()">返回前页</t-button>
      <t-button variant="outline" class="mx-2" @click="() => router.push('/')">去往首页</t-button>
    </div>
  </result>
</template>

<script lang="ts">
export default {
  name: 'Result404',
};
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Result from '@/components/result/index.vue';

const router = useRouter();
</script>
