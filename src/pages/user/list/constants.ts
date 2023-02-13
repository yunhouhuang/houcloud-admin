export const COLUMNS = [
  {
    title: '基础',
    align: 'left',
    width: 180,
    colKey: 'base',
    fixed: 'left',
  },
  { title: '钱包余额', colKey: 'wallet', width: 130, cell: { col: 'wallet' } },
  {
    title: '最近活跃',
    ellipsis: true,
    width: 150,
    colKey: 'lastLiveAt',
    sortable: true,
    cell: { col: 'lastLiveAt' },
  },
  {
    title: '注册时间',
    width: 150,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    title: '状态',
    width: 120,
    ellipsis: true,
    colKey: 'status',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 140,
    colKey: 'op',
    title: '操作',
  },
];
