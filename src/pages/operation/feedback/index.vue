<template>
  <div>
    <t-card title="意见反馈管理">
      <t-form>
        <t-row>
          <t-col :span="8">
            <t-row>
              <t-col :xs="12" :sm="6" :md="4" :xl="4">
                <t-form-item label="类型">
                  <t-select v-model="query.type" placeholder="类型筛选" class="mr-1" @change="getFeedbackList">
                    <t-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code" />
                  </t-select>
                </t-form-item>
              </t-col>
              <t-col :xs="12" :sm="6" :md="4" :xl="4">
                <t-form-item label="状态">
                  <t-select v-model="query.status" placeholder="状态筛选" class="mr-1" @change="getFeedbackList">
                    <t-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code" />
                  </t-select>
                </t-form-item>
              </t-col>
            </t-row>
          </t-col>
        </t-row>
      </t-form>
      <t-table
        class="mt-4"
        :data="feedbackList"
        :columns="COLUMNS"
        row-key="id"
        vertical-align="middle"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="{ offsetTop, container: getContainer }"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
      >
        <template #base="{ row }">
          <div v-if="row.user && row.user.id" class="dpr-center-start">
            <div style="min-width: 24px">
              <t-avatar :image="row.user.avatar || '/avatar.png'" />
            </div>
            <div class="text-line1 ml-1" style="max-width: 120px; font-weight: bold">{{ row.user.nickname }}</div>
          </div>
          <div v-else>游客</div>
        </template>
        <template #images="{ row }">
          <div v-if="row.imageArr">
            <t-avatar v-for="img in row.imageArr" :key="img" :image="img" shape="square" />
          </div>
        </template>
        <template #createdAt="{ row }">
          <div style="font-size: 12px">{{ formatTime(row.createdAt) }}</div>
        </template>
        <template #status="{ row }">
          <div
            style="font-size: 12px"
            :style="{ color: row.status === '2' ? '#3f3f3f' : row.status === '1' ? '#2b82d9' : '#ff7700' }"
          >
            {{ row.status === '2' ? '已完成' : row.status === '1' ? '处理中' : '待处理' }}
          </div>
        </template>
        <template #op="slotProps">
          <t-button
            size="small"
            :theme="slotProps.row.status === '2' ? 'default' : 'primary'"
            @click="handleClickDetail(slotProps.row)"
            >{{ slotProps.row.status === '2' ? '查看' : '处理' }}</t-button
          >
          <t-dropdown min-column-width="140">
            <template #dropdown>
              <t-dropdown-item @click="handleDelete(slotProps.row)">
                <delete-icon />
                <span class="mx-2">删除</span>
              </t-dropdown-item>
            </template>
            <t-button size="small" theme="default" variant="outline">更多</t-button>
          </t-dropdown>
        </template>
      </t-table>
    </t-card>
    <t-dialog v-model:visible="showDetailDialog" style="width: 780px" header="处理反馈" :footer="null">
      <div>
        <p>类型: {{ currentFeedback.type }}</p>
        <p>反馈内容: {{ currentFeedback.content }}</p>
        <p>联系方式: {{ currentFeedback.contact }}</p>
        <p>反馈用户: {{ currentFeedback.user_id ? currentFeedback.user.nickname : '游客' }}</p>
        <p>
          状态: {{ currentFeedback.status === '2' ? '已完成' : currentFeedback.status === '1' ? '处理中' : '待处理' }}
        </p>
        <t-textarea
          v-model="processContent"
          :disabled="currentFeedback.status === '2'"
          class="mt-6"
          placeholder="处理结果"
        ></t-textarea>
        <t-radio-group v-if="currentFeedback.status !== '2'" v-model="processStatus" class="mt-2">
          <t-radio value="1">处理中</t-radio>
          <t-radio value="2">已完成</t-radio>
        </t-radio-group>
        <div class="dpr-center-end mt-2">
          <span class="tip-text px-2">每条反馈仅可处理一次，完成后无法再次处理。</span>
          <t-button :disabled="currentFeedback.status === '2'" @click="handelProcess(currentFeedback.id)"
            >处理</t-button
          >
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { DeleteIcon } from 'tdesign-icons-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { formatTime, secondToHms } from '@/utils/time';
import { prefix } from '@/config/global';
import { useSettingStore } from '@/store';
import { deleteFeedbackApi, FeedbackType, getFeedbackListApi, handleFeedbackApi } from '@/api/help';

const types = [
  {
    name: '全部',
    code: '',
  },
  {
    name: '意见建议',
    code: '意见建议',
  },
  {
    name: 'BUG反馈',
    code: 'BUG反馈',
  },
  {
    name: '其他',
    code: '其他',
  },
];
const statusList = [
  {
    name: '全部',
    code: '',
  },
  {
    name: '待处理',
    code: '0',
  },
  {
    name: '处理中',
    code: '1',
  },
  {
    name: '已完成',
    code: '2',
  },
];
const feedbackList = ref<FeedbackType[]>();
const total = ref<number>(0);
const showDetailDialog = ref<boolean>(false);

const query = ref({
  page: 1,
  limit: 20,
  keywords: '',
  type: '',
  status: '',
});

const pagination = ref({
  defaultPageSize: query.value.limit,
  total: 0,
  defaultCurrent: 1,
});
const dataLoading = ref(false);

const getFeedbackList = () => {
  getFeedbackListApi(query.value).then((res) => {
    feedbackList.value = res.result.records || [];
    pagination.value.total = res.result.total || 0;
  });
};

const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};

const rehandlePageChange = (curr, pageInfo) => {
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getFeedbackList();
};
const getContainer = () => {
  return document.querySelector(`.${prefix}-layout`);
};
const processContent = ref('');
const processStatus = ref('1');
const handelProcess = (id) => {
  handleFeedbackApi({ id, remark: processContent.value, status: processStatus.value }).then((res) => {
    if (res.success) {
      MessagePlugin.success('处理成功');
      showDetailDialog.value = false;
      getFeedbackList();
    }
  });
};

const offsetTop = computed(() => {
  return useSettingStore().isUseTabsRouter ? 48 : 0;
});

const currentFeedback = ref<FeedbackType>({
  contact: '',
  content: '',
  createdAt: '',
  id: 0,
  imageArr: '',
  images: '',
  status: '',
  type: '',
  updatedAt: '',
  user: undefined,
  user_id: 0,
});
const handleClickDetail = (item) => {
  showDetailDialog.value = true;
  currentFeedback.value = item;
};
const handleDelete = (item) => {
  const dialog = DialogPlugin.confirm({
    header: '删除提示',
    body: '直接删除会导致用户无法收到反馈处理信息，是否确认？',
    cancelBtn: {
      content: '按流程处理',
    },
    confirmBtn: {
      content: '直接删除',
      theme: 'danger',
    },
    onConfirm: () => {
      deleteFeedbackApi({ id: item.id }).then((res) => {
        console.log(res.data);
        if (res.success) {
          MessagePlugin.success('删除成功');
          dialog.destroy();
          getFeedbackList();
        }
      });
    },
  });
};
onMounted(() => {
  getFeedbackList();
});
const COLUMNS = [
  {
    title: 'ID',
    align: 'left',
    width: 70,
    colKey: 'id',
    fixed: 'left',
  },
  { title: '类型', width: 150, colKey: 'type', fixed: 'left', cell: { col: 'type' } },
  {
    title: '反馈内容',
    ellipsis: true,
    colKey: 'content',
  },
  {
    title: '反馈图片',
    width: 130,
    ellipsis: true,
    colKey: 'images',
  },
  {
    title: '用户',
    align: 'left',
    width: 180,
    colKey: 'base',
  },
  {
    title: '状态',
    width: 100,
    ellipsis: true,
    colKey: 'status',
  },
  {
    title: '提交时间',
    width: 180,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 120,
    colKey: 'op',
    title: '操作',
  },
];
</script>

<style lang="less" scoped></style>
