<template>
  <div>
    <page-header title="消息通知" @on-back="$router.go(-1)" />
    <t-card :bordered="false" class="br-default">
      <div class="dpr-center-sb-wrap pb-2">
        <div style="min-width: 200px">
          <t-radio-group v-model="query.type" @change="handleNoticeTypeChange">
            <t-radio-button value="all">全部</t-radio-button>
            <t-radio-button value="unread">未读</t-radio-button>
          </t-radio-group>
        </div>
        <div class="dpr-center-start my-1" style="width: max-content">
          <div class="dpr-center-start px-2">
            <t-button
              v-if="selectedRowKeys.length"
              theme="primary"
              shape="round"
              :variant="selectedRowKeys.length ? 'base' : 'outline'"
              :loading="batchReadLoading"
              @click="handleBatchRead"
            >
              标记为已读 {{ selectedRowKeys.length ? selectedRowKeys.length : '' }}
            </t-button>
            <t-button
              v-if="selectedRowKeys.length"
              shape="round"
              variant="outline"
              theme="danger"
              @click="handleClickDelete"
            >
              批量删除 {{ selectedRowKeys.length }} 条通知
            </t-button>
          </div>
          <t-input
            v-model="query.keywords"
            placeholder="筛选通知标题内容"
            clearable
            class="notice-search-input"
            :on-enter="onSearch"
          >
            <template #suffix-icon>
              <search-icon size="20px" />
            </template>
          </t-input>
        </div>
      </div>
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="middle"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="rehandleSelectChange"
      >
        <template #type="{ row }">
          <span>{{ row.type === 'sys' ? '系统消息' : row.type }}</span>
        </template>
        <template #status="{ row }">
          <span :class="row.status === '0' ? 't-button-link success-color' : 'tip-color'">
            {{ row.status === '0' ? '未读' : '已读' }}</span
          >
        </template>
        <template #createdAt="{ row }">
          <span>{{ formatTime(row.createdAt) }}</span>
        </template>
        <template #op="slotProps">
          <a class="t-button-link" @click="handleClickDetail(slotProps.row)">查看</a>
        </template>
      </t-table>
    </t-card>

    <t-drawer v-model:visible="showDetail" header="通知详情" size="70%" :footer="false" @close="currentNotice = null">
      <div v-if="currentNotice">
        <h3>{{ currentNotice.title }}</h3>
        <p class="tip-text mt-1">{{ formatTime(currentNotice.createdAt) }}</p>
        <p class="pa-2">
          {{ currentNotice.content }}
        </p>
        <div class="my-4">
          <t-button variant="outline" shape="round" @click="goPage(currentNotice)">查看</t-button>
        </div>
      </div>
    </t-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import NotificationPlugin from 'tdesign-vue-next/es/notification/plugin';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';
import { formatTime } from '@/utils/time';
import { COLUMNS } from './constants';
import { AdminNoticeType, delNoticeApi, getNoticesApi, readNoticeApi, getNoticeApi } from '@/api/personal';
import PageHeader from '@/components/page-header/index.vue';

const store = useSettingStore();

const data = ref<AdminNoticeType[]>([]);
const query = ref({
  page: 1,
  limit: 20,
  keywords: '',
  type: 'all',
});

const pagination = ref({
  defaultPageSize: query.value.limit,
  total: 0,
  defaultCurrent: 1,
});

const dataLoading = ref(false);

const fetchData = async () => {
  dataLoading.value = true;
  try {
    const res = await getNoticesApi(query.value);
    if (res.success) {
      data.value = res.result.records || [];
      pagination.value = {
        ...pagination.value,
        total: res.result.total,
      };
    }
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const onSearch = () => {
  fetchData();
};

onMounted(() => {
  fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref([]);

const router = useRouter();
const delRow = ref<AdminNoticeType>(null);
const showDetail = ref(false);
const onConfirmDelete = () => {
  // 真实业务请发起请求
  confirmVisible.value = false;
  delNoticeApi({ ids: selectedRowKeys }).then((res) => {
    if (res.success) {
      MessagePlugin.success('删除成功');
      fetchData();
    }
  });
  delRow.value = null;
};

const onCancel = () => {
  delRow.value = null;
};

const rowKey = 'id';

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  fetchData();
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const batchReadLoading = ref(false);
const handleBatchRead = () => {
  if (batchReadLoading.value) {
    return;
  }
  batchReadLoading.value = true;
  readNoticeApi({ ids: selectedRowKeys.value })
    .then((res) => {
      if (res.success) {
        NotificationPlugin.success({ title: '操作成功' });
        selectedRowKeys.value = [];
        fetchData();
      }
    })
    .finally(() => {
      batchReadLoading.value = false;
    });
};
const ids = ref('');
const currentNotice = ref<AdminNoticeType>();
const handleClickDetail = (item) => {
  getNoticeApi({ id: item.id }).then((res) => {
    showDetail.value = true;
    currentNotice.value = res.result;
    item.status = '1';
  });
};

const goPage = (item) => {
  readNoticeApi({ ids: [item.id] });
};
const handleClickDelete = () => {
  const dialogInstance = DialogPlugin.confirm({
    header: '删除消息通知',
    body: `删除后无法恢复,请确认...`,
    confirmBtn: {
      content: '确定删除',
      variant: 'base',
      theme: 'primary',
    },
    onConfirm: ({ e }) => {
      dialogInstance.destroy();
      delNoticeApi({ ids: selectedRowKeys.value }).then((res) => {
        if (res.success) {
          MessagePlugin.success('删除成功');
          selectedRowKeys.value = [];
          fetchData();
        }
      });
    },
    onClose: ({ e, trigger }) => {
      dialogInstance.destroy();
    },
  });
};

const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});

const handleNoticeTypeChange = () => {
  selectedRowKeys.value = [];
  fetchData();
};
const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
</script>

<style lang="less" scoped>
.notice-search-input {
  :deep(.t-input) {
    border-radius: 15px;
    padding: 12px;
  }
}
</style>
