<template>
  <span>
    <slot name="prefix">{{ prefix }}</slot>
    <span>{{ (value / 100).toFixed(2) }}</span>
    <slot name="suffix">
      {{ suffix }}
    </slot>
  </span>
</template>

<script lang="ts">
export default {
  name: 'Money',
};
</script>
<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  value: {
    type: Number as PropType<number>,
    default: 0,
  },
  prefix: {
    type: String as PropType<string>,
    default: '',
  },
  suffix: {
    type: String as PropType<string>,
    default: '',
  },
});
</script>

<style lang="less" scoped></style>
