<template>
  <t-card>
    <div>
      <t-button v-permission="'menu:add'" @click="addMenuClick">添加菜单</t-button>
      <t-button theme="default" style="margin-left: 16px" @click="onExpandAllToggle">{{
        expandAll ? '收起全部' : '展开全部'
      }}</t-button>
    </div>
    <br />
    <br />
    <!-- 第一列展开树结点，缩进为 24px，子节点字段 childrenKey 默认为 children -->
    <!-- !!! 树形结构 EnhancedTable 才支持，普通 Table 不支持 !!! -->
    <!-- Ref: this.$refs.table.dataSource 查看树形结构平铺数据，获取属性结构使用 this.$refs.table.getTreeNode() -->
    <!-- 可以使用受控属性 :displayColumns.sync="displayColumns" 完全自由控制显示列 -->
    <t-enhanced-table
      ref="table"
      row-key="id"
      :data="menus"
      :columns="columns"
      :tree="{ childrenKey: 'children', treeNodeColumnIndex: 0 }"
      :column-controller="{
        placement: 'bottom-left',
        // 允许控制哪些列显示或隐藏
        fields: ['id', 'component', 'operate'],
        dialogProps: { preventScrollThrough: true },
      }"
    >
      <template #icon="{ row }">
        <icon v-if="beIcon(row.icon)" url="/iconfont/iconfont.js" :name="row.icon" />
        <icon v-else :name="row.icon" />
      </template>
      <template #type="{ row }">
        <div>
          <t-tag
            size="small"
            shape="round"
            variant="outline"
            :theme="row.type === '0' ? 'primary' : row.type === '1' ? 'warning' : 'default'"
            >{{ row.type === '0' ? '菜单' : row.type === '1' ? '权限' : '未知' }}</t-tag
          >
          <t-tag v-if="row.hidden" class="mx-1" variant="outline" size="small" shape="round" theme="default"
            >隐藏</t-tag
          >
        </div>
      </template>
      <template #keepAlive="{ row }">
        <t-switch disabled :value="row?.keepAlive"></t-switch>
      </template>
      <template #operate="{ row }">
        <t-button v-permission="'menu:add'" size="small" @click="addMenuClick(row)">添加</t-button>
        <t-button v-permission="'menu:update'" size="small" @click="editMenuClick(row)">编辑</t-button>
        <t-popconfirm content="删除后可能会影响系统业务，是否确认删除？" @confirm="handleDeleteMenu(row)">
          <t-button v-permission="'menu:delete'" size="small" theme="danger">删除</t-button>
        </t-popconfirm>
      </template>
    </t-enhanced-table>

    <t-dialog
      v-model:visible="showMenuDialog"
      width="600"
      :header="currentMenu?.id ? '编辑菜单' : '添加菜单'"
      :footer="false"
    >
      <t-form ref="menuForm" :data="currentMenu" @submit="handleMenuSubmit">
        <t-form-item label="类型">
          <t-radio-group v-model="currentMenu.type">
            <t-radio value="0" label="菜单" />
            <t-radio value="1" label="权限" />
          </t-radio-group>
        </t-form-item>
        <t-form-item v-if="currentMenu.type === '0'" name="icon" label="图标">
          <t-button v-if="!currentMenu.icon" shape="round" variant="outline" size="small" @click="showIconPicker = true"
            >选择图标</t-button
          >
          <template v-else>
            <div class="is-link" @click="showIconPicker = true">
              <icon v-if="beIcon(currentMenu.icon)" size="24" url="/iconfont/iconfont.js" :name="currentMenu.icon" />
              <icon v-else size="24" :name="currentMenu.icon" />
            </div>
            <t-button class="mx-4" size="small" shape="round" theme="default" @click="currentMenu.icon = ''"
              >清除</t-button
            >
          </template>
        </t-form-item>
        <t-form-item
          name="title"
          :label="currentMenu.type === '0' ? '菜单名称' : currentMenu.type === '1' ? '权限名称' : '权限名称'"
          :rules="[{ required: true }]"
        >
          <t-input v-model="currentMenu.title" />
        </t-form-item>

        <t-form-item
          v-if="currentMenu.type === '0'"
          help="请注意全局唯一性"
          name="name"
          label="路由名称"
          :rules="[{ required: true }]"
        >
          <t-input v-model="currentMenu.name" />
        </t-form-item>
        <t-form-item
          v-if="currentMenu.type === '0'"
          help="请以 / 、http、https开头"
          name="path"
          label="Path"
          :rules="[
            { required: true },
            {
              validator: pathValidator,
            },
          ]"
        >
          <t-input v-model="currentMenu.path" />
        </t-form-item>
        <t-form-item
          v-if="currentMenu.type === '0'"
          help="页面请使用 pages/路径/index.vue | 外框架请使用 layouts/index.vue"
          name="component"
          label="组件地址"
          :rules="[{ required: true }, { validator: componentValidator }]"
        >
          <t-input v-model="currentMenu.component" />
        </t-form-item>
        <t-form-item label="权限标识" name="permission">
          <t-input v-model="currentMenu.permission" />
        </t-form-item>
        <t-form-item v-if="currentMenu.type === '0'" help="支持内部地址或第三方网址" label="重定向">
          <t-input v-model="currentMenu.redirect" />
        </t-form-item>
        <t-form-item label="上级" name="parentId">
          <t-tree-select
            v-model="currentMenu.parentId"
            :data="menus"
            clearable
            filterable
            placeholder="请选择"
            @change="handleSelectParentMenu"
          >
            <template #valueDisplay="{ value }">
              <span>{{ value.label || '无' }}</span>
            </template>
          </t-tree-select>
        </t-form-item>
        <t-form-item label="排序权重" help="从大到小排序" name="weight">
          <t-input-number v-model="currentMenu.weight" />
        </t-form-item>
        <t-form-item v-if="currentMenu.type === '0'">
          <div class="dpr-center-start-wrap mt-2">
            <div class="dpr-center-start pr-4 mt-1">
              <span class="pr-1">KeepAlive</span>
              <t-switch v-model="currentMenu.keepAlive"></t-switch>
            </div>
            <div class="dpr-center-start pr-4 mt-1">
              <span class="pr-1">隐藏(页面)</span>
              <t-switch v-model="currentMenu.hidden"></t-switch>
            </div>
            <div class="dpr-center-start pr-4 mt-1">
              <span class="pr-1">隐藏子菜单</span>
              <t-switch v-model="currentMenu.single"></t-switch>
            </div>
            <!--            <div class="dpr-center-start pr-4 mt-1">-->
            <!--              <span class="pr-1">默认展开</span>-->
            <!--              <t-switch v-model="currentMenu.spread"></t-switch>-->
            <!--            </div>-->
          </div>
        </t-form-item>
        <t-form-item>
          <div class="full-width dpr-center-end">
            <t-button theme="default" @click="showMenuDialog = false">取消</t-button>
            <t-button type="submit">确认</t-button>
          </div>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog v-model:visible="showIconPicker" header="选择图标" :footer="false">
      <icon-picker @select="handleIconSelect" />
    </t-dialog>
  </t-card>
</template>
<script lang="ts">
export default {
  name: 'MenuTree',
};
</script>
<script lang="ts" setup>
import { MessagePlugin, EnhancedTable } from 'tdesign-vue-next';
import { MoveIcon, Icon } from 'tdesign-icons-vue-next';
import { onMounted, ref } from 'vue';
import { MenuType, getMenuTreeApi, addMenuApi, updateMenuApi, deleteMenuApi, getMenuApi } from '@/api/menu';
import IconPicker from '@/components/icon-picker/index.vue';

const query = ref({
  lazy: false,
  all: true,
  parentId: null,
});
const beIcon = (icon) => {
  // 是否为第三方图标
  return icon && typeof icon === 'string' && icon.indexOf('icon-') !== -1;
};
const menuForm = ref();
const table = ref();
const expandAll = ref(false);
const showIconPicker = ref(false);
const onExpandAllToggle = () => {
  expandAll.value = !expandAll.value;
  if (expandAll.value) {
    table.value.expandAll();
  } else {
    table.value.foldAll();
  }
};
const pathValidator = (val) => {
  if (val && val.indexOf('/') !== 0 && val.indexOf('http') !== 0) {
    return { result: false, message: '前缀格式错误', type: 'error' };
  }
  if (val && val.indexOf(' ') !== -1) {
    return { result: false, message: '不能包含空格', type: 'error' };
  }
  return { result: true, message: '', type: 'success' };
};
const componentValidator = (val) => {
  if (val && val.indexOf('/') === 0) {
    return { result: false, message: '禁止使用/开头', type: 'error' };
  }
  if (val && val.indexOf(' ') !== -1) {
    return { result: false, message: '不能包含空格', type: 'error' };
  }
  return { result: true, message: '', type: 'success' };
};
const menus = ref([]);
const getTreeMenu = () => {
  getMenuTreeApi(query.value).then((res) => {
    menus.value = res.result;
  });
};

const currentMenu = ref<MenuType>({
  icon: '',
  id: 0,
  keepAlive: false,
  name: '',
  parentId: 0,
  path: '',
  redirect: '',
  permission: '',
  component: '',
  single: false,
  hidden: false,
  title: '',
  type: '0',
  weight: 999,
});
const initMenuForm = () => {
  currentMenu.value = {
    icon: '',
    id: 0,
    keepAlive: false,
    name: '',
    parentId: 0,
    path: '',
    redirect: '',
    permission: '',
    component: '',
    single: false,
    hidden: false,
    title: '',
    type: '0',
    weight: 999,
  };
  setTimeout(() => {
    menuForm.value.clearValidate();
  }, 20);
};
const getMenuDetail = async (id) => {
  const res = await getMenuApi({ id });
  currentMenu.value = res.result;
};

const showMenuDialog = ref(false);
const addLoading = ref(false);
const handleAddMenuSubmit = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  addMenuApi(currentMenu.value)
    .then((res) => {
      if (res.success) {
        getTreeMenu();
        initMenuForm();
        showMenuDialog.value = false;
        MessagePlugin.success('添加成功');
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleUpdateMenuSubmit = () => {
  if (addLoading.value) {
    return;
  }
  addLoading.value = true;
  updateMenuApi(currentMenu.value)
    .then((res) => {
      if (res.success) {
        MessagePlugin.success('修改成功');
        showMenuDialog.value = false;
        getTreeMenu();
      }
    })
    .finally(() => {
      addLoading.value = false;
    });
};
const handleMenuSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    if (!currentMenu.value.id) {
      handleAddMenuSubmit();
    } else {
      handleUpdateMenuSubmit();
    }
  }
};
const handleIconSelect = (icon) => {
  currentMenu.value.icon = icon;
  showIconPicker.value = false;
};
const handleSelectParentMenu = (val, e) => {
  if (val === currentMenu.value.id) {
    currentMenu.value.parentId = 0;
    return;
  }
  console.log(val, e);
};
const addMenuClick = (item) => {
  if (currentMenu.value.id) {
    initMenuForm();
  }
  if (item) {
    currentMenu.value.parentId = item.id;
  }
  showMenuDialog.value = true;
};
const editMenuClick = (menu) => {
  currentMenu.value = menu;
  showMenuDialog.value = true;
};

const handleDeleteMenu = (menu) => {
  deleteMenuApi({ id: menu.id }).then((res) => {
    if (res.success) {
      MessagePlugin.success('删除成功');
      getTreeMenu();
    }
  });
};

// 拖拽排序成功后触发
const onDragSort = (params) => {
  console.log('onDragSort:', params);
};

const onAbnormalDragSort = (params) => {
  console.log(params);
  // this.$message.warning(params.reason);
  if (params.code === 1001) {
    MessagePlugin.warning('不同层级的元素，不允许调整顺序');
  }
};

// 应用于需要阻止拖拽排序的场景。如：当子节点存在时，则不允许调整顺序
// 返回值为 true，允许拖拽排序；返回值 为 false，则阻止拖拽排序
const beforeDragSort = (params) => {
  console.log('beforeDragSort:', params);
  return true;
};
const onTreeExpandChange = (context) => {
  console.log(context.rowState.expanded ? '展开' : '收起', context);
};

onMounted(() => {
  getTreeMenu();
});

const columns = [
  {
    width: 150,
    colKey: 'title',
    title: '名称',
    ellipsis: true,
  },
  {
    colKey: 'icon',
    title: '图标',
    ellipsis: true,
    width: 80,
  },
  {
    colKey: 'type',
    title: '类型',
    ellipsis: true,
    width: 150,
  },
  {
    width: 180,
    colKey: 'permission',
    title: '权限编码',
    ellipsis: true,
  },
  {
    colKey: 'name',
    title: '路由名称',
    width: 150,
  },
  {
    colKey: 'path',
    title: 'Path',
    minWidth: 120,
  },
  {
    colKey: 'component',
    title: '组件地址',
    minWidth: 200,
  },
  {
    colKey: 'operate',
    width: 200,
    title: '操作',
    align: 'center',
  },
];
</script>

<style lang="less" scoped>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
</style>
