<template>
  <t-card title="个人中心">
    <t-space direction="vertical" size="large">
      <t-form
        ref="form"
        :data="formData"
        reset-type="initial"
        :disabled="formDisabled"
        colon
        @reset="onReset"
        @submit="onSubmit"
      >
        <t-form-item name="avatar">
          <div>
            <image-selection :image="formData.avatar" @change="handleAvatarChange" />
          </div>
        </t-form-item>
        <t-form-item label="姓名" name="nickname">
          <t-input v-model="formData.nickname"></t-input>
        </t-form-item>
        <t-form-item>
          <t-space size="small">
            <t-button theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-space>
  </t-card>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useUserStore } from '@/store';
import { updatePersonalInfoApi, personalInfoApi } from '@/api/personal';
import ImageSelection from '@/components/image-selection/index.vue';

const formDisabled = ref(false);
const formData = reactive({
  nickname: '',
  avatar: '',
});

const onReset = () => {
  MessagePlugin.success('重置成功');
};
const handleAvatarChange = (image) => {
  formData.avatar = image;
};
const getPersonalInfo = () => {
  useUserStore()
    .getUserInfo()
    .then((res) => {
      formData.nickname = res.nickname;
      formData.avatar = res.avatar;
    });
};
const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    updatePersonalInfoApi(formData).then((res) => {
      if (res.success) {
        MessagePlugin.success('保存成功');
        getPersonalInfo();
      }
    });
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};
onMounted(() => {
  getPersonalInfo();
});
</script>
