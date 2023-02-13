<template>
  <div>
    <t-card class="list-card-container">
      <t-form>
        <t-row justify="end" class="mb-4" :gutter="[20]">
          <t-col :span="3">
            <t-form-item label="日志类型">
              <t-select v-model="query.type" @change="getSysLogs">
                <t-option value="" label="全部" />
                <t-option value="0" label="接口日志" />
                <t-option value="1" label="登录日志" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="5">
            <t-form-item label="">
              <t-date-picker
                v-model="query.startAt"
                placeholder="开始时间"
                enable-time-picker
                allow-input
                clearable
                :presets="presets"
                @change="getSysLogs"
              />
              <span class="px-2">至</span>
              <t-date-picker
                v-model="query.endAt"
                placeholder="结束时间"
                enable-time-picker
                allow-input
                :presets="presets"
                clearable
                @change="getSysLogs"
              />
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-input v-model="query.keywords" placeholder="日志内容关键字检索" clearable @enter="getSysLogs">
              <template #suffix-icon>
                <search-icon size="20px" />
              </template>
            </t-input>
          </t-col>
        </t-row>
      </t-form>
      <t-base-table
        :data="data"
        :columns="COLUMNS"
        row-key="id"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="true"
        :header-affix-props="{ offsetTop, container: getContainer }"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
      >
        <template #uri="{ row }"> {{ row.method }}-{{ row.uri }} </template>
        <template #createdAt="{ row }">
          {{ formatTime(row.createdAt) }}
        </template>
        <template #op="slotProps">
          <a class="t-button-link" @click="handleClickDetail(slotProps)">查看详情</a>
        </template>
      </t-base-table>
    </t-card>
    <t-dialog v-model:visible="showDetailDialog" header="日志详情" :footer="false"> {{ currentSysLog }} </t-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SystemLogs',
};
</script>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'tdesign-icons-vue-next';

import dayjs from 'dayjs';
import { useSettingStore } from '@/store';

import { COLUMNS } from './constants';
import { getSysLogsApi } from '@/api/security';
import { formatTime } from '@/utils/time';

const presets = ref({
  今天开始: dayjs().format('YYYY-MM-DD 00:00:00'),
  一小时前: dayjs().subtract(1, 'hour'),
  此刻: dayjs(),
});
const store = useSettingStore();
const data = ref([]);
const pagination = ref({
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
});

const showDetailDialog = ref(false);
const dataLoading = ref(false);
const query = ref({
  page: 1,
  limit: 20,
  startAt: null,
  endAt: null,
  type: '',
  keywords: '',
});
const getSysLogs = async () => {
  getSysLogsApi(query.value).then((res) => {
    data.value = res.result.records;
    pagination.value.total = res.result.total;
  });
};

onMounted(() => {
  getSysLogs();
});

const router = useRouter();

const rehandlePageChange = (curr, pageInfo) => {
  query.value.page = curr.current;
  query.value.limit = curr.pageSize;
  getSysLogs();
};

const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const currentSysLog = ref({});
const handleClickDetail = (obj: any) => {
  showDetailDialog.value = true;
  currentSysLog.value = obj;
};
const offsetTop = computed(() => {
  return store.isUseTabsRouter ? 48 : 0;
});

const getContainer = () => {
  return document.querySelector('.tdesign-starter-layout');
};
</script>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: 8px;
    color: var(--tdvns-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
