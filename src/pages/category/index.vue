<template>
  <t-card>
    <t-row class="mb-2">
      <t-col>
        <t-button @click="handleShowAddCategory">
          <template #icon><add-icon /></template>
          添加分类</t-button
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
      <template #image="{ row }">
        <t-avatar v-if="row.image" shape="round" :image="row.image" />
        <p v-else class="tip-color">无</p>
      </template>
      <template #type="{ row }">
        <span>{{ typeList.find((r) => r.value === row.type)?.label || '未知' }}</span>
      </template>
      <template #createdAt="{ row }">
        <span>{{ formatTime(row.createdAt) }}</span>
      </template>
      <template #updatedAt="{ row }">
        <span>{{ formatTime(row.updatedAt) }}</span>
      </template>
      <template #op="slotProps">
        <t-button size="small" @click="handleClickDetail(slotProps.row)">查看</t-button>
        <t-dropdown min-column-width="140">
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item @click="deleteCategory(slotProps.row)">
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
      :header="categoryForm.id ? '修改分类' : '添加分类'"
      :footer="null"
    >
      <div>
        <t-form :rules="rules" :data="categoryForm" @submit="onSubmit">
          <t-form-item name="image" label="图标">
            <t-button
              v-if="!categoryForm.image"
              variant="outline"
              style="width: 40px; height: 40px"
              @click="showFileManege = true"
            >
              <image-icon />
            </t-button>
            <t-image
              v-else
              style="width: 40px; height: 40px; border-radius: 5px"
              :src="categoryForm.image"
              @click="showFileManege = true"
            ></t-image>
          </t-form-item>
          <t-form-item name="name" label="名称">
            <t-input v-model="categoryForm.name"></t-input>
          </t-form-item>
          <t-form-item name="type" label="类型">
            <t-select v-model="categoryForm.type" filterable :multiple="false">
              <t-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label" />
            </t-select>
          </t-form-item>
          <t-form-item name="weight" label="权重" help="从大到小排序">
            <t-input-number v-model="categoryForm.weight" />
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
  name: 'CategoryList',
};
</script>
<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue';
import { AddIcon, ImageIcon } from 'tdesign-icons-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { COLUMNS } from './constants';
import { prefix } from '@/config/global';
import { useSettingStore, useUserStore } from '@/store';
import { formatTime } from '@/utils/time';
import {
  addCategoryApi,
  getCategoryListApi,
  deleteCategoryApi,
  getCategoryDetailApi,
  updateCategoryApi,
  CategoryType,
} from '@/api/category';
import FileManager from '@/pages/file/components/file-manager/index.vue';

const settingStore = useSettingStore();
const rules = {
  image: [{ required: true, type: 'error', message: '请设置图标' }],
  name: [{ required: true, type: 'error', message: '请填写分类名称' }],
  type: [{ required: true, type: 'error', message: '请选择类型' }],
};
const rowKey = 'id';
const query = ref({
  page: 1,
  limit: 20,
});
const typeList = [
  { label: '文件分类', value: '0' },
  { label: '小程序导航分类', value: '1' },
];

const users = ref<CategoryType[]>([]);

const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
});
const showFileManege = ref(false);
const showAddDialog = ref(false);
const handleShowAddCategory = () => {
  showAddDialog.value = true;
};
const dataLoading = ref(false);
const getCategoryList = () => {
  if (dataLoading.value) {
    return;
  }
  dataLoading.value = true;
  getCategoryListApi(query.value)
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

const categoryForm = ref({
  id: null,
  image: '',
  type: '',
  name: '',
  weight: 999,
});
const addLoading = ref(false);
const handleAddCategory = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  addCategoryApi(categoryForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('新增成功');
        showAddDialog.value = false;
        getCategoryList();
        categoryForm.value = {
          id: null,
          image: '',
          type: '',
          name: '',
          weight: 999,
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleUpdateCategory = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  updateCategoryApi(categoryForm.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('修改成功');
        showAddDialog.value = false;
        getCategoryList();
        categoryForm.value = {
          id: null,
          image: '',
          type: '',
          name: '',
          weight: 999,
        };
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleFileSelect = (files) => {
  categoryForm.value.image = files[0].url;
  showFileManege.value = false;
};
const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    if (!categoryForm.value.id) {
      handleAddCategory();
    } else {
      handleUpdateCategory();
    }
  }
};
const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getCategoryList();
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = (row) => {
  categoryForm.value = row;
  showAddDialog.value = true;
  getCategoryDetailApi({ id: row.id }).then((res) => {
    categoryForm.value = res.result;
  });
};

const offsetTop = computed(() => {
  return settingStore.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
const deleteCategory = (row) => {
  const dialog = DialogPlugin.confirm({
    header: '删除分类',
    body: `将"${row.name}"账号删除，是否继续？`,
    onConfirm: () => {
      deleteCategoryApi({ id: row.id }).then((res) => {
        if (res.success) {
          dialog.destroy();
          MessagePlugin.success('删除成功');
          getCategoryList();
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
  getCategoryList();
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
