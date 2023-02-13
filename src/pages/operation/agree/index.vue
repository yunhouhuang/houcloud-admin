<template>
  <t-card title="协议管理" subtitle="平台用户协议和隐私协议">
    <t-tabs v-model="tab">
      <t-tab-panel value="user-agreement" label="用户协议">
        <editor v-model="userAgree" />
        <div class="dpr-center-end mt-6">
          <t-button @click="saveUA">保存</t-button>
        </div>
      </t-tab-panel>
      <t-tab-panel value="privacy-agreement" label="隐私协议">
        <editor v-model="privacyAgree" />
        <div class="dpr-center-end mt-6">
          <t-button @click="savePA">保存</t-button>
        </div>
      </t-tab-panel>
    </t-tabs>
  </t-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Editor from '@/components/editor/index.vue';
import { setSysConfigApi } from '@/api/system';
import { getAgreementApi, setAgreementApi } from '@/api/platform';

const userAgree = ref('');
const privacyAgree = ref('');
const tab = ref('user-agreement');

const getUA = () => {
  getAgreementApi({ key: 'user-agreement' }).then((res) => {
    userAgree.value = res.result;
  });
};
const getPA = () => {
  getAgreementApi({ key: 'privacy-agreement' }).then((res) => {
    privacyAgree.value = res.result;
  });
};
const saveUA = () => {
  setAgreementApi({ key: 'user-agreement', value: userAgree.value }).then((res) => {
    if (res.success) {
      MessagePlugin.success('保存成功');
      getUA();
    }
  });
};
const savePA = () => {
  setAgreementApi({ key: 'privacy-agreement', value: privacyAgree.value }).then((res) => {
    if (res.success) {
      MessagePlugin.success('保存成功');
      getPA();
    }
  });
};

onMounted(() => {
  getUA();
  getPA();
});
</script>

<style lang="less" scoped></style>
