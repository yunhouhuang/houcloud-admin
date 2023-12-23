<template>
  <div>
    <!--    <t-card title="基本信息">-->
    <!--      {{ cacheInfo }}-->
    <!--    </t-card>-->
    <t-row class="mt-4" :gutter="[20]">
      <t-col :sm="12" :md="6">
        <t-card
          v-if="cacheInfo"
          title="资源消耗"
          subtitle="资源使用情况"
          class="dashboard-chart-card"
          :bordered="false"
        >
          <div style="height: 500px">
            <div class="dpr-center-start">
              <div style="min-width: 150px">Redis版本</div>
              <div class="px-2">{{ cacheInfo?.info?.redis_version }}</div>
            </div>
            <div class="dpr-center-start">
              <div style="min-width: 150px">部署模式</div>
              <div class="px-2">{{ cacheInfo?.info?.redis_mode === 'standalone' ? '单个' : '集群' }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">端口</div>
              <div class="px-2">{{ cacheInfo?.info?.tcp_port || '-' }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">已连接客户端数</div>
              <div class="px-2">{{ cacheInfo?.info?.connected_clients }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">主动碎片整理</div>
              <div class="px-2">{{ cacheInfo?.info?.active_defrag_running }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">连续运行</div>
              <div class="px-2">{{ cacheInfo?.info?.uptime_in_days }}天</div>
            </div>

            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">网络带宽进/出</div>
              <div class="px-2">
                {{ cacheInfo?.info?.instantaneous_input_kbps }}kps/{{ cacheInfo?.info?.instantaneous_output_kbps }}kps
              </div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">Key数量</div>
              <div class="px-2">{{ cacheInfo?.dbSize }}</div>
            </div>

            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">CPU占用</div>
              <div class="px-2">{{ cacheInfo?.info.used_cpu_sys }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">内存使用上限</div>
              <div class="px-2">{{ cacheInfo?.info?.maxmemory_human }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">系统内存大小</div>
              <div class="px-2">{{ cacheInfo?.info?.total_system_memory_human }}</div>
            </div>
            <div class="dpr-center-start mt-1">
              <div style="min-width: 150px">已使用的内存</div>
              <div class="px-2">{{ cacheInfo?.info?.used_memory_human }}</div>
            </div>
            <div class="dpr-center-start mt-10">
              <div style="min-width: 150px">系统内存用量</div>
              <t-progress
                style="width: 100%; max-width: 300px"
                theme="plump"
                :percentage="Number(cacheInfo?.info?.used_memory_peak_perc.replaceAll('%', ''))"
              />
            </div>
          </div>
        </t-card>
      </t-col>
      <t-col :sm="12" :md="6">
        <t-card title="指令统计" subtitle="操作指令统计" class="dashboard-chart-card" :bordered="false">
          <div id="countContainer" ref="countContainer" style="height: 500px; width: 500px; margin: 0 auto" />
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ServerInfo',
};
</script>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, ToolboxComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getCacheInfoApi, CacheInfoType } from '@/api/ops';
import { useSettingStore } from '@/store';

echarts.use([TooltipComponent, ToolboxComponent, LegendComponent, PieChart, GridComponent, LineChart, CanvasRenderer]);
const cacheInfo = ref<CacheInfoType>();
const settingStore = useSettingStore();

// monitorChart
let countContainer: HTMLElement;
let countChart: echarts.ECharts;
const renderCountChart = (dataList, darkMode) => {
  if (!countContainer) {
    countContainer = document.getElementById('countContainer');
  }
  if (countChart) {
    countChart.dispose();
  }
  countChart = echarts.init(countContainer);
  countChart.setOption({
    darkMode,
    legend: {
      textStyle: {
        color: darkMode ? '#fff' : '#555',
      },
      top: 'bottom',
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: false },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [
      {
        name: '指令统计',
        type: 'pie',
        roseType: 'radius',
        radius: [50, 150],
        center: ['50%', '38%'],
        itemStyle: {
          borderRadius: 2,
        },
        data: dataList,
      },
    ],
  });
};
const getCacheInfo = async () => {
  const res = await getCacheInfoApi();
  cacheInfo.value = res.result;
  renderCountChart(res.result.commandList, settingStore.displayMode === 'dark');
};
watch(
  () => settingStore.displayMode,
  (n) => {
    if (!cacheInfo.value || !cacheInfo.value.commandList) {
      return;
    }
    renderCountChart(cacheInfo.value.commandList, n === 'dark');
  },
);
// let timer = null;
onMounted(() => {
  getCacheInfo();
  // timer = setInterval(() => {
  //   getCacheInfo();
  // }, 5000);
});
onUnmounted(() => {
  // clearInterval(timer);
});
</script>

<style lang="less" scoped></style>
