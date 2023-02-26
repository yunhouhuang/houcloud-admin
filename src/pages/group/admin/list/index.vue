<template>
  <t-card>
    <t-row class="mb-2">
      <t-col>
        <t-button @click="handleShowAddAdmin">
          <template #icon><add-icon /></template>
          添加人员</t-button
        >
      </t-col>
    </t-row>
    <t-base-table
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
        </div>
      </template>
      <template #nickname="{ row }">
        <span>{{ row.nickname }}</span>
        <t-tag v-if="row.isCreator" theme="default" shape="mark" size="small" class="ml-1">创始人</t-tag>
      </template>
      <template #role="{ row }">
        <div v-if="row.roles && row.roles.length">
          <template v-for="(role, index) in row.roles" :key="role.id">
            <t-tag v-if="index < 3" class="mb-1">
              {{ role.name }}
            </t-tag>
          </template>
        </div>
        <span v-if="row.roles && row.roles.length > 3">...</span>
      </template>
      <template #mobile="{ row }">
        <span>{{ row.mobile || '-' }}</span>
      </template>
      <template #email="{ row }">
        <a :href="`mailto:${row.email}`">{{ row.email }}</a>
      </template>
      <template #createdAt="{ row }">
        <span>{{ formatTime(row.createdAt) }}</span>
      </template>
      <template #lastLiveAt="{ row }">
        <span>{{ formatTime(row.lastLiveAt) }}</span>
      </template>

      <template #status="{ row }">
        <p v-if="row.locked || row.blacklist" class="status unhealth">禁用</p>
        <p v-else class="status">正常</p>
      </template>
      <template #op="slotProps">
        <t-button size="small" @click="handleClickDetail(slotProps.row)">查看</t-button>
        <t-dropdown v-if="slotProps.row.id !== myInfo.id && !slotProps.row.isCreator" min-column-width="140">
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item @click="handleLockClick(slotProps.row)">
                <span class="mx-2">{{ slotProps.row.locked ? '解除禁用' : '禁用' }}</span>
              </t-dropdown-item>
              <t-dropdown-item @click="deleteAdmin(slotProps.row)">
                <span class="mx-2">删除</span>
              </t-dropdown-item>
            </t-dropdown-menu>
          </template>
          <t-button size="small" theme="default" variant="outline">更多</t-button>
        </t-dropdown>
      </template>
    </t-base-table>

    <t-dialog
      v-model:visible="showAddDialog"
      :close-on-overlay-click="false"
      destroy-on-close
      :header="adminForm.id ? '修改人员' : '添加人员'"
      :footer="null"
    >
      <div>
        <t-form :rules="rules" :data="adminForm" :disabled="adminForm.isCreator" @submit="onSubmit">
          <t-form-item name="avatar" label="头像">
            <t-button v-if="!adminForm.avatar" shape="circle" variant="outline" @click="showFileManege = true">
              <user-icon />
            </t-button>
            <t-avatar v-else size="30px" :image="adminForm.avatar" @click="showFileManege = true"></t-avatar>
          </t-form-item>
          <t-form-item name="nickname" label="姓名">
            <t-input v-model="adminForm.nickname"></t-input>
          </t-form-item>
          <t-form-item name="username" label="账号">
            <t-input
              v-model="adminForm.username"
              :disabled="adminForm.id"
              placeholder="4 ~ 20个字符组合以字母开头"
            ></t-input>
          </t-form-item>
          <t-form-item
            v-if="myInfo.id === 1"
            name="password"
            label="密码"
            help="提示: 请勿设置简单密码，以防系统被入侵。"
            :rules="[{ required: !adminForm.id, type: 'error', message: '请填写账号密码' }]"
          >
            <t-input v-model="adminForm.password"></t-input>
          </t-form-item>
          <t-form-item name="roleIds" label="角色">
            <t-select v-model="adminForm.roleIds" filterable :multiple="true">
              <t-option v-for="role in roleList" :key="role.id" :value="role.id" :label="role.name">
                <span>{{ role.name }}</span>
              </t-option>
            </t-select>
            <template #help>
              <div>
                如果没有适合的角色可以前往<a class="px-2" @click="$router.push('/group/role/list')">添加角色</a>
              </div>
            </template>
          </t-form-item>
          <t-form-item name="mobile" label="手机">
            <t-input
              v-model="adminForm.mobile"
              :disabled="adminForm.id"
              type="mobile"
              placeholder="（选填）以便紧急联系"
            ></t-input>
          </t-form-item>
          <t-form-item class="dpr-center-end">
            <t-button theme="default" @click="showAddDialog = false"> 取消 </t-button>
            <t-button :disabled="addLoading" :loading="addLoading" type="submit"> 保存 </t-button>
          </t-form-item>
        </t-form>
      </div>
      <t-drawer v-model:visible="showFileManege" size="60%" :footer="null" :header="null">
        <file-manager v-if="showFileManege" select-mode :multi="false" @complete-select="handleFileSelect" />
      </t-drawer>
    </t-dialog>
  </t-card>
</template>

<script lang="ts">
export default {
  name: 'AdminList',
};
</script>
<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { UserIcon, AddIcon } from 'tdesign-icons-vue-next';
import { COLUMNS } from './constants';
import { prefix } from '@/config/global';
import { useSettingStore, useUserStore } from '@/store';
import { formatTime } from '@/utils/time';
import {
  addAdminApi,
  adminListApi,
  AdminType,
  deleteAdminApi,
  getAdminDetailApi,
  lockAdminApi,
  updateAdminApi,
} from '@/api/admin';
import FileManager from '@/pages/file/components/file-manager/index.vue';
import { getRoleListApi, RoleType } from '@/api/role';

const myInfo = ref(useUserStore().userInfo);
const settingStore = useSettingStore();
const rules = {
  avatar: [{ required: true, type: 'error', message: '请设置头像' }],
  nickname: [{ required: true, type: 'error', message: '请填写人员姓名' }],
  username: [
    { required: true, type: 'error', message: '请填写登录账号' },
    { minLength: 4, message: '最少4个字符' },
  ],
  roleIds: [{ required: true, type: 'error', message: '请设置角色' }],
};
const rowKey = 'id';
const query = ref({
  page: 1,
  limit: 20,
});
const roleList = ref<RoleType[]>([]);

const getRoleList = () => {
  getRoleListApi({ page: 1, limit: 999 }).then((res) => {
    roleList.value = res.result.records || [];
  });
};
const users = ref<AdminType[]>([]);

const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
});
const showFileManege = ref(false);
const showAddDialog = ref(false);
const handleShowAddAdmin = () => {
  showAddDialog.value = true;
};
const dataLoading = ref(false);
const getAdminList = () => {
  if (dataLoading.value) {
    return;
  }
  dataLoading.value = true;
  adminListApi(query.value)
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

const adminForm = ref<AdminType>({
  id: null,
  avatar: '',
  isCreator: false,
  username: '',
  roleIds: [],
  nickname: '',
  password: '',
  mobile: '',
});
const addLoading = ref(false);
const handleAddAdmin = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  addAdminApi(adminForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('新增成功');
        showAddDialog.value = false;
        getAdminList();
        adminForm.value = {
          id: null,
          avatar: '',
          username: '',
          nickname: '',
          roleIds: [],
          password: '',
          mobile: '',
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleUpdateAdmin = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  updateAdminApi(adminForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('修改成功');
        showAddDialog.value = false;
        getAdminList();
        adminForm.value = {
          id: null,
          avatar: '',
          username: '',
          nickname: '',
          roleIds: [],
          password: '',
          mobile: '',
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleFileSelect = (files) => {
  adminForm.value.avatar = files[0].url;
  showFileManege.value = false;
};
const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    if (!adminForm.value.id) {
      handleAddAdmin();
    } else {
      handleUpdateAdmin();
    }
  }
};
const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getAdminList();
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = (row) => {
  adminForm.value = row;
  showAddDialog.value = true;
  getAdminDetailApi({ id: row.id }).then((res) => {
    adminForm.value = res.result;
    adminForm.value.roleIds = res.result.roles.map((r) => r.id);
  });
};

const offsetTop = computed(() => {
  return settingStore.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
const lockAdmin = (row) => {
  const dialog = DialogPlugin.confirm({
    header: '锁定账号',
    body: `将"${row.nickname}"账号锁定，该账号将无法登录，是否继续？`,
    onConfirm: () => {
      lockAdminApi({ id: row.id, locked: true }).then((res) => {
        if (res.success) {
          dialog.destroy();
          MessagePlugin.success('操作成功');
          getAdminList();
        }
      });
    },
  });
};
const unlockAdmin = (row) => {
  lockAdminApi({ id: row.id, locked: false }).then((res) => {
    if (res.success) {
      MessagePlugin.success('操作成功');
      getAdminList();
    }
  });
};
const handleLockClick = (row) => {
  if (row.locked) {
    unlockAdmin(row);
  } else {
    lockAdmin(row);
  }
};
const deleteAdmin = (row) => {
  const dialog = DialogPlugin.confirm({
    header: '删除人员',
    body: `将"${row.nickname}"账号删除，是否继续？`,
    onConfirm: () => {
      deleteAdminApi({ id: row.id }).then((res) => {
        if (res.success) {
          dialog.destroy();
          MessagePlugin.success('删除成功');
          getAdminList();
        }
      });
    },
  });
};

onActivated(() => {
  console.log('onActivated');
});
onMounted(() => {
  console.log('onMounted');
  getAdminList();
  getRoleList();
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
