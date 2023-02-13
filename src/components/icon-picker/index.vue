<template>
  <div>
    <t-button
      v-for="(icon, index) in iconfontProject.glyphs"
      :key="index"
      variant="text"
      shape="circle"
      class="ma-1"
      @click="handleIconPicker(icon)"
    >
      <icon size="20" url="/iconfont/iconfont.js" :name="`icon-${icon.font_class}`"></icon>
    </t-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { Icon } from 'tdesign-icons-vue-next';
import axios, { AxiosResponse } from 'axios';
import copyText from 'tdesign-vue-next/es/utils/clipboard';
import { MessagePlugin } from 'tdesign-vue-next';

const props = defineProps({
  size: {
    type: String as PropType<string>,
    default: '16',
  },
});
interface GlyphsItem {
  icon_id: string;
  name: string;
  font_class: string;
  unicode: string;
  unicode_decimal: number;
}

interface IconfontType {
  id: string;
  name: string;
  font_family: string;
  css_prefix_text: string;
  description: string;
  glyphs: GlyphsItem[];
}

const iconfontProject = ref<IconfontType>({
  css_prefix_text: '',
  description: '',
  font_family: '',
  glyphs: [],
  id: '',
  name: '',
});
const emits = defineEmits(['select']);
const handleIconPicker = (item) => {
  emits('select', `${iconfontProject.value.css_prefix_text}${item.font_class}`);
};
const handleCopyIcon = (item) => {
  copyText(`${iconfontProject.value.css_prefix_text}${item.font_class}`);
  MessagePlugin.success('代码复制成功');
};
onMounted(() => {
  axios.get<IconfontType>('/iconfont/iconfont.json').then((res) => {
    iconfontProject.value = res.data;
  });
});
</script>
<script lang="ts">
export default {
  name: 'IconPicker',
};
</script>

<style lang="less" scoped>
.la-rate {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
}
.score-text {
  margin-left: 6px;
}
</style>
