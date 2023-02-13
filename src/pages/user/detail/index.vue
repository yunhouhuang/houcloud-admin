<template>
  <t-card title="用户资料" :subtitle="user.nickname">
    <template #actions>
      <t-button theme="default">选项</t-button>
    </template>
    <div class="dpr-center-start">
      <t-avatar :image="user.avatar" size="48px" />
      <div class="px-2">
        <div style="font-weight: bold; font-size: 24px">{{ user.nickname }}</div>
        <div class="tip-text mt-1">手机号码: {{ user.mobile || '暂未授权' }}</div>
      </div>
    </div>
    <div class="mt-6">
      钱包余额: <money style="font-weight: bold; font-size: 24px" class="px-1" :value="user.wallet || 0" />元
    </div>
    <div class="mt-2">用户ID: {{ user.id }}</div>
    <div class="mt-2">注册日期: {{ formatTime(user.createdAt) }}</div>
    <div class="mt-2">最后活跃: {{ formatTime(user.lastLiveAt) }}</div>
    <t-divider />
    <h3>
      达人
      <span style="color: var(--td-text-color-placeholder)"
        >({{ (user.douyinUsers && user.douyinUsers.length) || '暂无达人' }})</span
      >
    </h3>
    <div class="mt-2">
      <div
        v-for="stage in user.douyinUsers"
        :key="stage.id"
        class="dpr-center-start my-2 user-stage-item"
        @click="$router.push(`/user/douyin/detail/${stage.id}`)"
      >
        <t-avatar :image="stage.avatar" size="30px" />
        <div class="px-2">
          <div style="font-weight: bold; font-size: 18px">{{ stage.nickname }}</div>
        </div>
      </div>
    </div>
  </t-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getUserDetailApi, UserType } from '@/api/user';
import { formatTime } from '@/utils/time';
import Money from '@/components/money/index.vue';

const user = ref<UserType>({
  avatar: '',
  birthday: undefined,
  blacklist: false,
  createdAt: undefined,
  douyinUsers: [],
  email: '',
  id: 0,
  idCardNo: '',
  inviteId: 0,
  lastLiveAt: undefined,
  locked: false,
  mobile: '',
  nickname: '',
  realName: '',
  sex: '',
  updatedAt: undefined,
  username: '',
  wallet: 0,
  walletMark: false,
  wechatOpenid: '',
});
const getUserDetail = (id) => {
  getUserDetailApi({ id }).then((res) => {
    user.value = res.result;
  });
};
onMounted(() => {
  const { id } = useRoute().params;
  if (!id) {
    return;
  }
  getUserDetail(id);
});
</script>

<style lang="less" scoped>
.user-stage-item {
  cursor: pointer;
  border-radius: 12px;
  padding: 5px 10px;
  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }
}
</style>
