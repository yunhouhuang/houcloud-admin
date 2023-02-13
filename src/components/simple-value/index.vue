<template>
  <text>{{ convert(value) }}</text>
</template>

<script lang="ts">
export default {
  name: 'SimpleValue',
};
</script>
<script setup lang="ts">
import { PropType } from 'vue';

const convert = (value: number): string => {
  if (!value) {
    return '0';
  }
  const { length } = String(value);
  if (length >= props.len) {
    let text = '';
    let index = length;
    if (length === 4) {
      text = 'K';
    } else {
      text = 'W';
      index = 5;
    }
    const startNum = value / Number(`1${Array(index).join('0').slice(0, index)}`);
    return startNum.toFixed(1) + text;
  }
  return String(value);
};

const props = defineProps({
  value: {
    type: Number as PropType<number>,
    default: 0,
  },
  len: {
    type: Number as PropType<number>,
    default: 4,
  },
});
</script>
