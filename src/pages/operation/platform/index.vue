<template>
  <div>
    <t-card title="基础设置" subtitle="平台基本设置">
      <t-form
        ref="form"
        :data="formData"
        reset-type="initial"
        :disabled="formDisabled"
        colon
        @reset="onReset"
        @submit="onSubmit"
      >
        <t-form-item name="logo" label="Logo">
          <div>
            <t-button v-if="!formData.logo" variant="outline" @click="showFileManegeOfLogo = true"> 设置Logo </t-button>
            <t-image
              v-else
              shape="circle"
              style="width: 100px; height: 100px"
              :src="formData.logo"
              @click="showFileManegeOfLogo = true"
            ></t-image>
          </div>
        </t-form-item>
        <t-form-item label="系统版本" name="name">
          <t-input v-model="formData.sysVersion"></t-input>
        </t-form-item>
        <t-form-item label="平台名称" name="name">
          <t-input v-model="formData.name"></t-input>
        </t-form-item>
        <t-form-item label="平台标语" name="subtitle">
          <t-input v-model="formData.subtitle"></t-input>
        </t-form-item>
        <t-form-item label="官网地址" name="icp">
          <t-input v-model="formData.officialUrl"></t-input>
        </t-form-item>
        <t-form-item label="ICP备案号" name="icp">
          <t-input v-model="formData.icp"></t-input>
        </t-form-item>
        <t-form-item label="客服电话" name="phone">
          <t-input v-model="formData.phone"></t-input>
        </t-form-item>
        <t-form-item label="简介" name="intro">
          <t-textarea v-model="formData.intro"></t-textarea>
        </t-form-item>
        <t-form-item name="businessLicense" label="营业执照">
          <div>
            <t-button v-if="!formData.businessLicense" variant="outline" @click="showFileManegeOfBl = true">
              添加营业执照
            </t-button>
            <t-image
              v-else
              style="width: 200px; height: 150px"
              :src="formData.businessLicense"
              @click="showFileManegeOfBl = true"
            ></t-image>
          </div>
        </t-form-item>
        <t-form-item>
          <t-space size="small">
            <t-button theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
    <t-drawer v-model:visible="showFileManegeOfLogo" size="60%" :footer="null" :header="null">
      <file-manager select-mode :multi="false" @complete-select="handleLogoFileSelect" />
    </t-drawer>
    <t-drawer v-model:visible="showFileManegeOfBl" size="60%" :footer="null" :header="null">
      <file-manager select-mode :multi="false" @complete-select="handleBlFileSelect" />
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { uploadFileApi } from '@/api/file';
import { getPlatformInfoApi, setPlatformInfo } from '@/api/platform';
import FileManager from '@/pages/file/components/file-manager/index.vue';

const showFileManegeOfLogo = ref(false);
const showFileManegeOfBl = ref(false);
const formDisabled = ref(false);
const formData = ref({
  name: '',
  uscCode: '',
  businessLicense: '',
  intro: '',
  subtitle: '',
  officialUrl: '',
  icp: '',
  sysVersion: '',
  phone: '',
  logo: '',
});
const handleBlFileSelect = (files) => {
  formData.value.businessLicense = files[0].url;
  showFileManegeOfBl.value = false;
};
const handleLogoFileSelect = (files) => {
  formData.value.logo = files[0].url;
  showFileManegeOfLogo.value = false;
};
const requestMethod = (file) => {
  return new Promise((resolve) => {
    // file.percent 用于控制上传进度，如果不希望显示上传进度，则不对 file.percent 设置值即可。
    // 如果代码规范不能设置 file.percent，也可以设置 files
    file.percent = 0;
    const uploadData = new FormData();
    uploadData.append('file', file.raw);
    uploadFileApi(uploadData, (e) => {
      file.percent = (e.loaded / e.total) * 100;
      console.log('进度', file.percent);
    })
      .then((res) => {
        if (res.data.success) {
          resolve({ status: 'success', response: { url: res.data.result.url } });
        } else {
          resolve({ status: 'fail', error: '上传失败' });
        }
      })
      .catch((e) => {
        console.log(e);
        resolve({ status: 'fail', error: '上传失败' });
      })
      .finally(() => {
        file.percent = 100;
      });
  });
};

const getPlatformInfo = () => {
  getPlatformInfoApi().then((res) => {
    if (res.result) {
      formData.value = res.result;
    }
  });
};
const onReset = () => {
  MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    setPlatformInfo(formData.value).then((res) => {
      if (res.success) {
        MessagePlugin.success('提交成功');
        getPlatformInfo();
      }
    });
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};
onMounted(() => {
  getPlatformInfo();
});
</script>

<style lang="less" scoped></style>
