<template>
  <div class="upload-container dpr-center-start-wrap">
    <div v-for="(item, index) in images" :key="index" class="images-box">
      <div v-if="index + 1 <= max" class="images dpc-center-center">
        <img :src="item" :style="`width:${width}px;height:${height}px;`" alt="" />
        <div class="mask dpc-center-center">
          <div class="actions">
            <span title="预览" @click="preview(index)">
              <search-icon size="24" />
            </span>
            <span title="移除" @click="remove(index)">
              <delete-icon size="24" />
            </span>
            <span
              v-show="images.length > 1"
              title="左移"
              :class="{ disabled: index === 0 }"
              @click="move(index, 'left')"
            >
              <arrow-left-icon size="24" />
            </span>
            <span
              v-show="images.length > 1"
              title="右移"
              :class="{ disabled: index === images.length - 1 }"
              @click="move(index, 'right')"
            >
              <arrow-right-icon size="24" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="images">
      <div class="add-img-btn" :style="`width:${width}px;height:${height}px;`" @click="onAdd">
        <add-icon size="24" />
      </div>
    </div>
    <t-image-viewer
      v-model:visible="showViewer"
      :images="images"
      :index="imageIndex"
      @close="previewClose"
      @index-change="onIndexChange"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ImagesViewer',
};
</script>
<script setup lang="ts">
import { getCurrentInstance, PropType, ref } from 'vue';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon, SearchIcon } from 'tdesign-icons-vue-next';

const { proxy } = getCurrentInstance();

const props = defineProps({
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  max: {
    type: Number || String,
    default: 3,
  },
  size: {
    type: Number || String,
    default: 2,
  },
  width: {
    type: Number || String,
    default: 150,
  },
  height: {
    type: Number || String,
    default: 150,
  },
  placeholder: {
    type: String,
    default: '',
  },
  ext: {
    type: Array,
    default: () => ['jpg', 'png', 'gif', 'bmp'],
  },
});
const emit = defineEmits(['update:url', 'add']);

const imageIndex = ref<number>(0);
const showViewer = ref<boolean>(false);
const uploadData = ref({
  progress: {
    preview: '',
    percent: 0,
  },
});
const onIndexChange = (index) => {
  imageIndex.value = index;
};
// 预览
function preview(index) {
  imageIndex.value = index;
  showViewer.value = true;
}

// 关闭预览
function previewClose() {
  showViewer.value = false;
}

// 移除
function remove(index) {
  const { images } = props;
  images.splice(index, 1);
  emit('update:url', images);
}

// 移动
function move(index: number, type) {
  console.log('移动');
  const url = props.images;
  if (type === 'left' && index !== 0) {
    url[index] = url.splice(index - 1, 1, url[index])[0];
  }
  if (type === 'right' && index !== url.length - 1) {
    url[index] = url.splice(index + 1, 1, url[index])[0];
  }
  emit('update:url', url);
}

function onAdd(res) {
  uploadData.value.progress.preview = '';
  uploadData.value.progress.percent = 0;
  emit('add', res);
}
</script>

<style lang="less" scoped>
.upload-container {
  line-height: initial;
}
.images-box {
  position: relative;
  display: inline-block;
  overflow: hidden;
}
.images {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  img {
    display: block;
  }

  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
    transition: all 0.3s;
    .actions {
      width: 100px;
      height: 100px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      span {
        width: 50%;
        text-align: center;
        color: #fff;
        cursor: pointer;
        transition: all 0.1s;

        &.disabled {
          color: #999;
          cursor: not-allowed;
        }

        &:hover:not(.disabled) {
          transform: scale(1.5);
        }

        .el-icon {
          font-size: 24px;
        }
      }
    }
  }

  &:hover .mask {
    opacity: 1;
  }
}

.add-img-btn {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: transparent;
  border-radius: 6px;

  i {
    font-size: 30px;
  }
}
</style>
