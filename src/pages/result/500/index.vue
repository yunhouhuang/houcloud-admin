<template>
  <result title="500 Internal Server Error" type="500" tip="抱歉，服务器出错啦">
    <div class="dpr-center-center">
      <t-button class="mx-2" @click="() => router.back()">返回前页</t-button>
      <t-button variant="outline" class="mx-2" @click="() => router.push('/')">去往首页</t-button>
    </div>
  </result>
</template>
<script lang="ts">
export default {
  name: 'Result500',
};
</script>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import Result from '@/components/result/index.vue';

const router = useRouter();
</script>
