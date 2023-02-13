<template>
  <t-card title="角色管理">
    <t-row class="mb-2">
      <t-col>
        <t-button @click="handleShowAddRole">新增角色</t-button>
      </t-col>
    </t-row>
    <t-base-table
      :data="roleList"
      :columns="COLUMNS"
      row-key="id"
      vertical-align="middle"
      :hover="true"
      :pagination="pagination"
      :loading="dataLoading"
      @page-change="rehandlePageChange"
    >
      <template #updatedAt="{ row }">
        <span>{{ formatTime(row.updatedAt) }}</span>
      </template>
      <template #name="{ row }">
        <span>{{ row.name }}</span>
      </template>
      <template #createdAt="{ row }">
        <span>{{ formatTime(row.createdAt) }}</span>
      </template>
      <template #op="slotProps">
        <t-button size="small" @click="handleClickDetail(slotProps.row)">详情</t-button>
        <t-dropdown min-column-width="140">
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item @click="handleDeleteRole(slotProps.row)">
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
      :header="roleForm.id ? '修改角色' : '添加角色'"
      :footer="null"
    >
      <div>
        <t-form :rules="rules" :data="roleForm" @submit="onSubmit">
          <t-form-item name="name" label="名称">
            <t-input v-model="roleForm.name"></t-input>
          </t-form-item>
          <t-form-item name="code" label="编码">
            <t-input v-model="roleForm.code"></t-input>
          </t-form-item>
          <t-form-item name="menus" label="权限">
            <t-tree-select
              v-model="roleForm.menuIds"
              :data="menuTree"
              value="name"
              multiple
              clearable
              filterable
              placeholder="请选择"
              :min-collapsed-num="3"
              @change="handleSelectParentMenu"
            >
            </t-tree-select>
          </t-form-item>
          <t-form-item name="description" label="描述">
            <t-textarea v-model="roleForm.description"></t-textarea>
          </t-form-item>
          <t-form-item class="dpr-center-end">
            <t-button theme="default" @click="showAddDialog = false"> 取消 </t-button>
            <t-button :disabled="addLoading" :loading="addLoading" type="submit"> 保存 </t-button>
          </t-form-item>
        </t-form>
      </div>
      <t-drawer v-model:visible="showMenus" size="60%" header="分配权限">
        <div>
          <t-tree></t-tree>
        </div>
      </t-drawer>
    </t-dialog>
  </t-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { addRoleApi, deleteRoleApi, getRoleDetailApi, getRoleListApi, RoleType, updateRoleApi } from '@/api/role';
import { formatTime } from '@/utils/time';
import { getMenuTreeApi, MenuType } from '@/api/menu';

const rules = {
  name: [{ required: true, type: 'error', message: '请填写角色名称' }],
  code: [{ required: true, type: 'error', message: '请填写角色编码' }],
};
const roleForm = ref({
  name: '',
  code: '',
  id: null,
  description: '',
  menuIds: [],
});
const showMenus = ref(false);
const addLoading = ref(false);
const showAddDialog = ref(false);
const handleShowAddRole = () => {
  showAddDialog.value = true;
};

const handleClickDetail = (row) => {
  roleForm.value = row;
  showAddDialog.value = true;
  getRoleDetailApi({ id: row.id }).then((res) => {
    if (res.success) {
      roleForm.value = res.result;
    }
  });
};

const query = ref({
  page: 1,
  limit: 20,
});
const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
});

const dataLoading = ref<boolean>(false);
const roleList = ref<RoleType[]>([]);
const getRoleList = () => {
  dataLoading.value = true;
  getRoleListApi(query.value)
    .then((res) => {
      roleList.value = res.result.records || [];
      pagination.value.total = res.result.total;
    })
    .finally(() => {
      dataLoading.value = false;
    });
};
const handleSelectParentMenu = (val, e) => {
  console.log(val, e);
};
const rehandlePageChange = (curr, pageInfo) => {
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getRoleList();
};

const handleAdd = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  addRoleApi(roleForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('新增成功');
        showAddDialog.value = false;
        getRoleList();
        roleForm.value = {
          description: '',
          id: null,
          name: '',
          code: '',
          menuIds: [],
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleUpdate = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  updateRoleApi(roleForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('修改成功');
        showAddDialog.value = false;
        getRoleList();
        roleForm.value = {
          description: '',
          id: null,
          name: '',
          code: '',
          menuIds: [],
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    if (!roleForm.value.id) {
      handleAdd();
    } else {
      handleUpdate();
    }
  }
};
const menuTree = ref<MenuType[]>([]);

const getMenus = () => {
  getMenuTreeApi({ all: true }).then((res) => {
    menuTree.value = res.result;
  });
};
const handleDeleteRole = (row) => {
  const dialog = DialogPlugin.confirm({
    header: '删除角色',
    body: `将"${row.name}"角色删除，将会导致拥有该角色的人员无法正常使用，是否继续？`,
    onConfirm: () => {
      deleteRoleApi({ id: row.id }).then((res) => {
        if (res.success) {
          dialog.destroy();
          MessagePlugin.success('删除成功');
          getRoleList();
        }
      });
    },
  });
};
onMounted(() => {
  getRoleList();
  getMenus();
});
const COLUMNS = [
  { title: 'ID', colKey: 'id', width: 130, cell: { col: 'id' } },
  { title: '名称', colKey: 'name', width: 150, cell: { col: 'name' } },
  { title: '编码', colKey: 'code', minWidth: 200, cell: { col: 'code' } },
  { title: '描述', colKey: 'description', minWidth: 200, cell: { col: 'code' } },
  {
    title: '修改时间',
    width: 190,
    ellipsis: true,
    colKey: 'updatedAt',
  },
  {
    title: '创建时间',
    width: 190,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 140,
    colKey: 'op',
    title: '操作',
  },
];
</script>

<style lang="less" scoped></style>
