<template>
  <span
    class="text-line"
    :style="{
      webkitLineClamp: line,
      mozLineClamp: line,
      fontSize: `${fontSize}px`,
      fontWeight: bold ? 'bold' : '',
      color: color ? color : '',
      textAlign: align ? align : '',
    }"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts" name="TextLine">
const props = defineProps({
  text: {
    type: String,
  },
  line: {
    type: [String, Number],
    default: 1,
  },
  fontSize: {
    type: [String, Number],
    default: 14,
  },
  color: {
    type: String,
  },
  align: {
    type: String,
  },
  bold: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
.text-line {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
</style>
