export const COLUMNS = [
  {
    title: '操作内容',
    align: 'left',
    width: 150,
    colKey: 'title',
    fixed: 'left',
  },
  { title: '操作人员', colKey: 'admin.nickname', width: 140, cell: { col: 'admin' } },
  { title: '操作时间', colKey: 'createdAt', width: 200, cell: { col: 'createdAt' } },
  {
    title: 'IP',
    width: 140,
    ellipsis: true,
    colKey: 'ip',
  },
  {
    title: 'HOST',
    width: 150,
    ellipsis: true,
    colKey: 'host',
  },
  {
    title: '请求地址',
    width: 200,
    ellipsis: true,
    colKey: 'uri',
  },
  {
    title: '终端信息',
    minWidth: 200,
    ellipsis: true,
    colKey: 'ua',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 120,
    colKey: 'op',
    title: '操作',
  },
];
