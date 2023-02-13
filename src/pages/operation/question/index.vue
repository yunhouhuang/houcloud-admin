<template>
  <t-card title="常见问题管理" subtitle="发布常见问题和解决办法可以客服压力">
    <template #actions>
      <t-button @click="handleAddQA">新建问题问答</t-button>
    </template>
    <p v-if="!questionList.length" class="full-width dpr-center-center">暂无数据</p>
    <div v-for="(item, index) in questionList" :key="index" class="qa-item dpr-center-sb">
      <div>
        <h3>{{ item.title }}</h3>
        <div class="mt-2 text-line1">
          <span v-html="item.answer" />
        </div>
      </div>
      <div class="qa-item-actions">
        <t-button theme="primary" size="small" variant="outline" @click="handleEdit(item)">编辑</t-button>
        <t-popconfirm theme="warning" content="即将删除，是否确认?" @confirm="handleDelete(item)">
          <t-button theme="danger" size="small" variant="outline">删除</t-button>
        </t-popconfirm>
      </div>
    </div>

    <t-drawer
      v-model:visible="showDetailDialog"
      size="100%"
      :confirm-btn="currentItem.id ? '保存' : '新增'"
      :header="currentItem.id ? '编辑问题' : '新增问题'"
      close-on-esc-keydown
      @confirm="handleSave"
    >
      <t-form>
        <t-form-item label="问题">
          <t-input v-model="currentItem.title"></t-input>
        </t-form-item>
        <t-form-item label="如何解决">
          <editor v-model="currentItem.answer" />
        </t-form-item>
      </t-form>
    </t-drawer>
  </t-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import Editor from '@/components/editor/index.vue';
import { addIssueApi, delIssueApi, getIssueListApi, saveIssueApi } from '@/api/help';

const currentItem = ref({
  id: null,
  title: '',
  answer: '',
});
const showDetailDialog = ref(false);
const questionList = ref([]);
const handleAddQA = () => {
  showDetailDialog.value = true;
  currentItem.value = {
    id: null,
    title: '',
    answer: '',
  };
};
const getIssueList = () => {
  getIssueListApi({ page: 1, limit: 100 }).then((res) => {
    questionList.value = res.result.records || [];
  });
};
const handleSave = () => {
  if (currentItem.value.id) {
    saveIssueApi(currentItem.value).then((res) => {
      if (res.success) {
        MessagePlugin.success('保存成功');
        showDetailDialog.value = false;
      }
    });
  } else {
    addIssueApi(currentItem.value).then((res) => {
      if (res.success) {
        MessagePlugin.success('新增成功');
        showDetailDialog.value = false;
        getIssueList();
      }
    });
  }
};
const handleEdit = (item) => {
  showDetailDialog.value = true;
  currentItem.value = item;
};
const handleDelete = (item) => {
  delIssueApi({ id: item.id }).then((res) => {
    if (res.success) {
      MessagePlugin.success('删除成功');
      getIssueList();
    }
  });
};

onMounted(() => {
  getIssueList();
});
</script>

<style lang="less" scoped>
.qa-item {
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.3s;
  background-color: var(--td-bg-color-container);
  &-actions {
    padding: 0 10px;
    min-width: max-content;
  }
  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }
}
</style>
