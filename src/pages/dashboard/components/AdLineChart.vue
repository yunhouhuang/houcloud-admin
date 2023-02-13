<template>
  <t-card
    id="adLineChart"
    ref="adLineChart"
    class="dashboard-chart-container"
    :style="{ width: '100%', height: '375px', padding: '12px' }"
  />
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, onUpdated } from 'vue';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
const renderMonitorChart = (option) => {
  const chartDom = document.getElementById('adLineChart');
  const myChart = echarts.init(chartDom);
  myChart.setOption(option);
};
const option = {
  title: {
    text: '推送统计',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['短视频', '资讯内容'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周三', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '短视频',
      type: 'line',
      data: [120, 1, 33, 435, 123, 1200, 666],
    },
    {
      name: '直播',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
  ],
};
onMounted(() => {
  renderMonitorChart(option);
});
onUpdated(() => {
  renderMonitorChart(option);
});
</script>
<script lang="ts">
export default {
  name: 'GmvLineChart',
};
</script>
<style scoped></style>
