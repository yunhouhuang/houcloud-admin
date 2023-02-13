<template>
  <div class="image-selection">
    <t-image v-if="src" :src="src" fit="cover" overlay-trigger="hover" class="image-selection-pic">
      <template #overlay-content>
        <div
          class="dpc-center-center full-width"
          style="height: 100%; border-radius: 12px; background-color: rgba(51, 51, 51, 0.56)"
        >
          <div class="dpr-center-center" style="color: white">
            <delete-icon style="font-size: 18px" @click="src = ''" />
            <t-divider layout="vertical" style="border-color: white" />
            <upload-icon style="font-size: 18px" @click="showFileManege = true" />
          </div>
        </div>
      </template>
    </t-image>
    <div v-else class="selection-box dpr-center-center" @click="showFileManege = true">
      <add-icon />
    </div>
    <t-drawer v-model:visible="showFileManege" size="40%" :footer="false" :header="false">
      <file-manager select-mode @complete-select="handleSelect" />
    </t-drawer>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { DeleteIcon, SearchIcon, AddIcon, UploadIcon } from 'tdesign-icons-vue-next';
import FileManager from '@/pages/file/components/file-manager/index.vue';

const props = defineProps({
  image: {
    type: String as PropType<string>,
    default: '',
  },
});

const showFileManege = ref(false);
const src = ref('');
const emits = defineEmits(['change']);
const handleSelect = (files) => {
  showFileManege.value = false;
  emits('change', files[0].url);
};
watch(
  () => props.image,
  (nv) => {
    src.value = nv;
  },
);
</script>
<script lang="ts">
export default {
  name: 'ImageSelection',
};
</script>

<style lang="less" scoped>
.image-selection {
  border-radius: 12px;
  height: 120px;
  width: 120px;
  &-pic {
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
}
.selection-box {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border-width: 2px;
  border-style: dashed;
  border-color: var(--td-border-level-1-color);
}
</style>
