<template>
  <div class="t-upload__file-flow-demo">
    <t-upload
      v-model="files"
      accept="image/png, image/jpeg, image/jpg, application/zip"
      :request-method="requestMethod"
      placeholder="上传图片或文件(支持 jpg、jpeg、png、zip)"
      theme="file-flow"
      :size-limit="{ size: maxSize, unit: 'MB', message: '图片大小不超过 {sizeLimit} MB' }"
      multiple
      is-batch-upload
      show-upload-progress
      :auto-upload="false"
      :max="10"
      @success="handleUploadSuccess"
      @fail="handleUploadFail"
      @validate="handleValidFile"
    ></t-upload>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useUserStore } from '@/store';
import { uploadFileApi } from '@/api/file';

const userStore = useUserStore();
const { token } = userStore;
const files = ref([]);
const emit = defineEmits(['upload-success', 'upload-fail']);

// file 为等待上传的文件信息，用于提供给上传接口。file.raw 表示原始文件
const requestMethod = (files) => {
  return new Promise((resolve) => {
    console.log(files);
    // file.percent 用于控制上传进度，如果不希望显示上传进度，则不对 file.percent 设置值即可。
    // 如果代码规范不能设置 file.percent，也可以设置 files
    if (files.length) {
      files.percent = 0;
      const formData = new FormData();
      formData.append('file', files[0].raw);
      uploadFileApi(formData, (e) => {
        files.percent = (e.loaded / e.total) * 100;
        // console.log('进度', files.percent);
      })
        .then((res) => {
          if (res.data.success) {
            resolve({ status: 'success', response: res.data.result });
            files.percent = 100;
          } else {
            resolve({ status: 'fail', error: '上传失败' });
          }
        })
        .catch((e) => {
          console.log(e);
          resolve({ status: 'fail', error: '上传失败' });
        });
    }
  });
};
const handleUploadSuccess = (e) => {
  emit('upload-success', e);
};
const handleUploadFail = (e) => {
  console.log('upload fail', e);
  emit('upload-fail', e);
};
const errTip = ref('');
const maxSize = ref(10);
const handleValidFile = (e, f) => {
  // console.log('upload fail', e, f);
  if (e.type === 'FILE_OVER_SIZE_LIMIT') {
    errTip.value = `文件过大，请选择${maxSize.value}以内的文件。`;
  }
  MessagePlugin.error(errTip.value);
};
</script>
