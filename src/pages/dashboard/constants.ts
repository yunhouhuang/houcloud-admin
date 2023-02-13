import { TdBaseTableProps } from 'tdesign-vue-next';

interface DashboardPanel {
  title: string;
  number: string | number;
  leftType: string;
  upTrend?: string;
  downTrend?: string;
}

export const PANE_LIST: Array<DashboardPanel> = [
  {
    title: '交易总额 (GMV)',
    number: '2,842.00 万',
    upTrend: '20.5%',
    leftType: 'icon-money-circle',
  },
  {
    title: '会员用户',
    number: '768 人',
    downTrend: '20.5%',
    leftType: 'echarts-bar',
  },
  {
    title: '注册用户',
    number: '1126',
    upTrend: '20.5%',
    leftType: 'icon-usergroup',
  },
  {
    title: '交易订单 (个)',
    number: 527,
    downTrend: '20.5%',
    leftType: 'icon-file-paste',
  },
];
