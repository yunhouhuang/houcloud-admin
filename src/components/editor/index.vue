<script lang="ts">
export default {
  name: 'Editor',
};
</script>
<script lang="ts" setup>
import tinymce from 'tinymce/tinymce';
import TinymceEditor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default/icons';
import 'tinymce/models/dom';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
import 'tinymce/plugins/searchreplace';

import { computed, onMounted, ref, watch } from 'vue';
import { useSettingStore } from '@/store';
import { uploadFileApi } from '@/api/file';
import FileManager from '@/pages/file/components/file-manager/index.vue';
import { isFile, isImg, isMedia } from '@/utils/file-util';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  setting: {
    type: Object,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const whiteDomain = ref<string[]>([]);
const settingsStore = useSettingStore();
/**
 * 根据图片url转为png文件对象
 * @param url
 * @param imageName
 * @returns {Promise<unknown>}
 */
const getImageFileFromUrl = (url, imageName) => {
  return new Promise<File>((resolve, reject) => {
    let blob = null;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Accept', 'image/png');
    xhr.responseType = 'blob';
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      blob = xhr.response;
      const imgFile = new File([blob], imageName, { type: 'image/png' });
      // 返回结果
      resolve(imgFile);
    };
    xhr.onerror = (e) => {
      reject(e);
    };
    // 发送
    xhr.send();
  });
};

const myEditor = ref();
const init = ref(true);
const showFileManager = ref(false);
const theme = computed(() => {
  return settingsStore.displayMode;
});
const defaultSetting = ref({
  language_url: '/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  skin_url: theme.value === 'light' ? '/tinymce/skins/ui/oxide' : '/tinymce/skins/ui/oxide-dark',
  content_css:
    theme.value === 'light'
      ? '/tinymce/skins/content/default/content.min.css'
      : '/tinymce/skins/content/dark/content.min.css',
  min_height: 250,
  max_height: 600,
  selector: 'textarea',
  plugins:
    'autolink ' +
    'autoresize ' +
    'fullscreen ' +
    'image ' +
    'link ' +
    'lists ' +
    'media ' +
    'preview ' +
    'table ' +
    'wordcount ' +
    'code ' +
    'searchreplace',
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | link image media assignment  searchreplace | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat |table  | preview code fullscreen',
  branding: false,
  menubar: false,
  toolbar_mode: 'sliding',
  insertdatetime_formats: ['%Y年%m月%d日', '%H点%M分%S秒', '%Y-%m-%d', '%H:%M:%S'],
  // https://www.tiny.cloud/docs/tinymce/6/file-image-upload/#images_upload_handler
  paste_data_images: true,
  // 粘贴图片后，自动上传
  urlconverter_callback: (url, node, on_save, name) => {
    return url;
  },
  images_upload_handler: (blobInfo: any, progress: any) =>
    new Promise((resolve, reject) => {
      console.log('images_upload_handler', progress);
      const file = blobInfo.blob();
      progress = 0;
      const formData = new FormData();
      formData.append('file', file, file.name);
      uploadFileApi(formData, (e) => {
        progress = (e.loaded / e.total) * 100;
        console.log('进度', (e.loaded / e.total) * 100);
      })
        .then((res) => {
          if (res.data.success) {
            resolve(res.data.result.url);
          } else {
            resolve(false);
          }
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        })
        .finally(() => {
          progress = 100;
        });
    }),
  setup: (editor) => {
    myEditor.value = editor;
    editor.ui.registry.addButton('assignment', {
      text: `媒体库`,
      tooltip: '从文件管理中选择文件',
      onAction: () => {
        showFileManager.value = true;
      },
    });
  },
});

const myValue = ref(props.modelValue);

const completeSetting = computed(() => {
  return Object.assign(defaultSetting.value, props.setting);
});

watch(
  () => myValue.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
);

watch(
  () => props.modelValue,
  (newValue) => {
    myValue.value = newValue;
  },
);

const enterFiles = (files) => {
  console.log('选择', files);
  for (let i = 0; i < files.length; i++) {
    let width: number | string = '100%';
    const img = new Image();
    img.src = files[i].url;
    console.log('img.new', img.width);
    if (img.width !== 0 && img.width <= 720) {
      width = img.width;
    }
    if (isImg(files[i].suffix)) {
      console.log('add image');
      myValue.value += `<p><img src="${files[i].url}" alt=""  width="${width}"/> </p>`;
    }
    if (isFile(files[i].suffix)) {
      console.log('文件信息');
    }
    if (isMedia(files[i].suffix)) {
      console.log('媒体信息');
    }
  }
  showFileManager.value = false;
};

onMounted(() => {
  tinymce.init({});
});
</script>

<template>
  <div class="editor">
    <tinymce-editor v-if="init" v-model="myValue" :init="completeSetting" :disabled="disabled" />
    <t-drawer v-model:visible="showFileManager" title="选择文件" size="60%" :footer="false">
      <file-manager select-mode multi @complete-select="enterFiles" />
    </t-drawer>
  </div>
</template>

<style lang="less" scoped>
:deep(.tox-tinymce) {
  border-radius: 4px;
}
</style>
