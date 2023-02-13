<template>
  <t-card :bordered="false" title="文件管理">
    <template #actions>
      <div class="dpr-center-start-wrap">
        <t-popconfirm
          v-if="selectMode"
          content="离开会导致本页内容丢失"
          confirm-btn="离开此页"
          cancel-btn="等会再去"
          theme="warning"
          @confirm="toFilePage"
        >
          <a class="tip-text px-4">文件管理</a>
        </t-popconfirm>
        <t-button v-if="selectMode" theme="primary" :disabled="!selectedFiles.length" @click="handelCompleteSelect">
          <template #icon>
            <check-icon />
          </template>
          完成选择
        </t-button>
        <t-button v-permission="'file:upload'" theme="danger" @click="handleUpload">
          <template #icon>
            <cloud-upload-icon />
          </template>
          上传文件
        </t-button>
      </div>
    </template>
    <div>
      <t-tabs :value="tab" @change="handleTabChange">
        <t-tab-panel value="all" label="全部">
          <div>
            <div class="dpr-start-start-wrap">
              <div v-if="loadingFiles" class="dpr-center-center full-width" style="min-height: 500px">
                <t-loading />
              </div>
              <empty-tip v-if="!totalFiles" style="min-height: 500px" />
              <div v-for="(file, index) in files" :key="file.id" class="ma-2 file-item" @click="onSelect(file)">
                <t-image
                  v-if="isImg(file.suffix)"
                  :src="file.url"
                  style="height: 140px; width: 140px; border-radius: 12px 12px 0 0"
                  fit="cover"
                  shape="round"
                  overlay-trigger="hover"
                >
                  <template v-if="!selectMode" #overlay-content>
                    <div
                      class="dpr-center-center"
                      style="
                        height: 100%;
                        color: white;
                        background-color: rgba(22, 22, 22, 0.66);
                        border-radius: 12px 12px 0 0;
                      "
                    >
                      <t-popconfirm
                        v-permission="'file:delete'"
                        content="即将删除是否继续？"
                        @confirm="handleDel(file, index)"
                      >
                        <div>
                          <delete-icon />
                          <span class="pl-1">删除</span>
                        </div>
                      </t-popconfirm>
                      <t-divider v-permission="'file:delete'" layout="vertical" />
                      <div @click="handleShowImageViewer(file)">
                        <browse-icon />
                        <span class="pl-1">浏览</span>
                      </div>
                    </div>
                  </template>
                </t-image>
                <div v-else class="file-cover dpc-center-center">
                  <span style="font-size: 48px; text-align: center; font-weight: bold" v-text="file.suffix" />
                </div>
                <div class="tip-text px-1 mt-1">
                  {{ formatTime(file.createdAt) }}
                </div>
                <div class="dpr-center-sb" style="height: 24px; position: relative">
                  <div class="tip-text px-1 dpr-center-sb">
                    <span>大小:{{ (file.size / 1024).toFixed(2) }}KB</span>
                  </div>
                  <t-button
                    v-if="!selectMode"
                    size="small"
                    shape="circle"
                    variant="text"
                    class="mr-1"
                    @click="handleCopyUrl(file)"
                    ><file-copy-icon
                  /></t-button>
                  <check-icon
                    v-if="isChecked(file)"
                    style="position: absolute; border-bottom: 10px; right: 4px"
                    :color="'#0ab215'"
                  />
                </div>
              </div>
            </div>
            <t-pagination
              class="mt-4"
              :total="totalFiles"
              :default-current="query.page"
              :default-page-size="query.limit"
              show-first-and-last-page-btn
              @current-change="onCurrentChange"
              @page-size-change="onPageSizeChange"
              @change="onChange"
            />
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
    <t-image-viewer v-model:visible="showImageViewer" :images="[currentImage]" />
    <t-dialog
      class="upload-file-dialog"
      :cancel-btn="null"
      :confirm-btn="null"
      width="auto"
      title="上传文件"
      :visible="showUploadDialog"
      @close="showUploadDialog = false"
    >
      <upload-file @upload-success="uploadSuccess" />
    </t-dialog>
  </t-card>
</template>
<script lang="ts">
export default {
  name: 'FileManager',
};
</script>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { FileCopyIcon, BrowseIcon, CheckIcon, DeleteIcon, CloudUploadIcon } from 'tdesign-icons-vue-next';

import { MessagePlugin } from 'tdesign-vue-next';
import copyText from 'tdesign-vue-next/es/utils/clipboard';
import UploadFile from '@/components/upload-file/index.vue';
import { deleteFileApi, getFileListApi, FileType } from '@/api/file';
import { isImg } from '@/utils/file-util';
import { formatTime } from '@/utils/time';
import EmptyTip from '@/components/empty-tip/index.vue';
import router from '@/router';

const props = defineProps({
  selectMode: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  multi: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  pageSize: {
    type: Number as PropType<number>,
    default: 20,
  },
});
const loadingFiles = ref(false);
const tab = ref('all');
const files = ref<FileType[]>([]);
const totalFiles = ref(0);
const query = ref({
  page: 1,
  type: null,
  limit: props.pageSize,
  orderBy: 'created_at desc',
});
const toFilePage = () => {
  router.push('/file/list');
};
const getFiles = () => {
  if (loadingFiles.value) {
    return;
  }
  loadingFiles.value = true;
  getFileListApi(query.value)
    .then((res) => {
      if (res.success) {
        files.value = res.result.records;
        totalFiles.value = res.result.total;
      }
    })
    .finally(() => {
      loadingFiles.value = false;
    });
};
const onPageSizeChange = (size) => {
  query.value = size;
  getFiles();
};

const onCurrentChange = (page, pageInfo) => {
  console.log(page, pageInfo);
  query.value.page = page;
  getFiles();
};
const currentImage = ref('');
const showImageViewer = ref(false);
const handleShowImageViewer = (file) => {
  if (props.selectMode) {
    return;
  }
  currentImage.value = file.url;
  showImageViewer.value = true;
};
const handleCopyUrl = (file) => {
  copyText(file.url);
  MessagePlugin.success('URL复制成功');
};
const onChange = (pageInfo) => {
  console.log(pageInfo);
};
const showUploadDialog = ref(false);

const uploadSuccess = (e) => {
  console.log(e);
  if (e.results && e.results.length) {
    for (let i = 0; i < e.results.length; i++) {
      files.value.unshift(e.results[i].response);
    }
  }
};
const delLoading = ref(false);
const delFile = (file) => {
  delLoading.value = true;
  deleteFileApi({ id: file.id })
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('删除成功');
        const number = files.value.indexOf(file);
        if (number > -1) {
          files.value.splice(number, 1);
        }
      }
    })
    .finally(() => {
      delLoading.value = false;
    });
};

const selectedFiles = ref([]);
const isChecked = (file) => {
  return selectedFiles.value.indexOf(file) !== -1;
};

const emit = defineEmits(['complete-select']);
const handelCompleteSelect = () => {
  emit('complete-select', selectedFiles.value);
  selectedFiles.value = [];
};

const handleDel = (file, index) => {
  delFile(file);
};

const onSelect = (file) => {
  if (!props.selectMode) {
    return;
  }
  console.log(file.id);
  const indexOf = selectedFiles.value.indexOf(file);
  if (indexOf !== -1) {
    selectedFiles.value.splice(indexOf, 1);
  } else {
    if (!props.multi) {
      selectedFiles.value = [];
    }
    selectedFiles.value.push(file);
  }
};
const handleTabChange = (newValue) => {
  tab.value = newValue;
  query.value.type = newValue;
};
const handleUpload = () => {
  showUploadDialog.value = true;
};
onMounted(() => {
  getFiles();
});
</script>

<style lang="less" scoped>
.upload-file-dialog {
  width: auto;
}
.file-item {
  border-color: var(--td-border-level-1-color);
  border-style: solid;
  border-width: 1px;
  border-radius: 12px;
}
.file-cover {
  position: relative;
  height: 140px;
  width: 140px;
}
</style>
