<template>
  <t-card title="用户管理">
    <t-row :gutter="[12, 12]">
      <t-col :xs="12" :md="6" :xl="4">
        <t-radio-group v-model="query.orderBy" @change="getUserList">
          <t-radio-button value="">默认</t-radio-button>
          <t-radio-button value="lastLiveAt%20desc">最近活跃</t-radio-button>
          <t-radio-button value="createdAt%20desc">最近注册</t-radio-button>
        </t-radio-group>
      </t-col>
      <t-col :xs="12" :md="6" :xl="4">
        <t-input v-model="query.nickname" placeholder="用户昵称">
          <template #suffix-icon>
            <search-icon @click="getUserList" />
          </template>
        </t-input>
      </t-col>
    </t-row>
    <t-table
      :data="users"
      :columns="COLUMNS"
      :row-key="rowKey"
      vertical-align="middle"
      :hover="true"
      :pagination="pagination"
      :loading="dataLoading"
      :header-affixed-top="{ offsetTop, container: getContainer }"
      @page-change="rehandlePageChange"
      @change="rehandleChange"
    >
      <template #base="{ row }">
        <div class="dpr-center-start-wrap">
          <t-avatar :image="row.avatar" />
          <span class="ma-1">{{ row.nickname }}</span>
        </div>
      </template>
      <template #douyinUser="{ row }">
        <t-popup v-if="row.douyinUsers && row.douyinUsers.length" min-column-width="200" max-column-width="400">
          <template #content>
            <div
              v-for="douyinUser in row.douyinUsers"
              :key="douyinUser.id"
              class="dpr-center-start py-2 px-4 is-link"
              @click="$router.push(`/user/douyin/detail/${douyinUser.id}`)"
            >
              <t-avatar :image="douyinUser.avatar"></t-avatar>
              <span class="ma-1" v-text="douyinUser.nickname" />
            </div>
          </template>
          <t-button variant="outline" shape="round" size="small">
            <span>已绑定 {{ row.douyinUsers.length }}个</span>
          </t-button>
        </t-popup>
        <t-button v-else variant="outline" shape="round" size="small" disabled>
          <span>未绑定</span>
        </t-button>
      </template>
      <template #lastLiveAt="{ row }">
        <span>{{ diffDate(row.lastLiveAt) }}</span>
      </template>
      <template #createdAt="{ row }">
        <span>{{ diffDate(row.createdAt) }}</span>
      </template>
      <template #status="{ row }">
        <p v-if="row.locked || row.blacklist" class="status unhealth">异常</p>
        <p v-else class="status">正常</p>
      </template>
      <template #op="slotProps">
        <t-button size="small" @click="handleClickDetail(slotProps.row.id)">详情</t-button>
        <t-dropdown min-column-width="140">
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item @click="toBlacklist(slotProps.row)">
                <view-list-icon />
                <span class="tip-text mx-2">加入黑名单</span>
              </t-dropdown-item>
            </t-dropdown-menu>
          </template>
          <t-button size="small" theme="default" variant="outline">更多</t-button>
        </t-dropdown>
      </template>
    </t-table>
  </t-card>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { CloseIcon, ViewListIcon, SearchIcon } from 'tdesign-icons-vue-next';
import { COLUMNS } from './constants';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { diffDate } from '@/utils/time';
import { getUserListApi, DouyinUserType, toBlacklistApi, UserType } from '@/api/user';

const { proxy } = getCurrentInstance();

const settingStore = useSettingStore();

const rowKey = 'id';
const query = ref({
  nickname: '',
  orderBy: '',
  page: 1,
  limit: 20,
});
const users = ref<UserType[]>([]);

const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
});
const dataLoading = ref(false);
const getUserList = () => {
  if (dataLoading.value) {
    return;
  }
  dataLoading.value = true;
  getUserListApi(query.value)
    .then((res) => {
      if (res.success) {
        users.value = res.result.records || [];
        pagination.value.total = res.result.total;
      }
    })
    .finally(() => {
      dataLoading.value = false;
    });
};

const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getUserList();
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = (id) => {
  proxy.$router.push(`/user/detail/${id}`);
};

const offsetTop = computed(() => {
  return settingStore.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
const toBlacklist = (user: UserType) => {
  const dialog = DialogPlugin.confirm({
    header: '黑名单提示',
    body: `将"${user.nickname}"加入平台黑名单，用户行为将受到限制，是否继续？`,
    onConfirm: () => {
      toBlacklistApi({ id: user.id }).then((res) => {
        if (res.success) {
          MessagePlugin.success('操作成功');
          dialog.destroy();
        }
      });
    },
  });
  console.log('拉黑', user);
};

onMounted(() => {
  getUserList();
});
</script>

<style lang="less" scoped>
.status {
  position: relative;
  color: var(--td-success-color);
  margin-left: 10px;
  &::before {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translateY(-50%);
    content: '';
    background-color: var(--td-success-color);
    width: 6px;
    height: 6px;
    margin-left: -10px;
    border-radius: 50%;
  }
}
.status.unhealth {
  color: var(--td-error-color);
  &::before {
    background-color: var(--td-error-color);
  }
}
</style>
