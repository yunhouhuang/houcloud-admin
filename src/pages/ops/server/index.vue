<template>
  <t-card>
    {{ serverInfo }}
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'ServerInfo',
};
</script>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getServerInfoApi } from '@/api/ops';

const serverInfo = ref({});

const getServerInfo = async () => {
  const res = await getServerInfoApi();
  serverInfo.value = res.result;
};
onMounted(() => {
  getServerInfo();
});
</script>

<style lang="less" scoped></style>
