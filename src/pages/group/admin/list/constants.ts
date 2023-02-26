export const COLUMNS = [
  {
    title: '头像',
    align: 'left',
    colKey: 'base',
    width: 80,
    ellipsis: true,
    fixed: 'left',
  },
  { title: '姓名', colKey: 'nickname', minWidth: 170, cell: { col: 'nickname' } },
  { title: '角色', colKey: 'role', minWidth: 150, cell: { col: 'role' } },
  { title: '邮箱地址', colKey: 'email', minWidth: 200, cell: { col: 'email' } },
  { title: '联系电话', colKey: 'mobile', width: 130, cell: { col: 'mobile' } },
  {
    title: '近期使用',
    ellipsis: true,
    width: 185,
    colKey: 'lastLiveAt',
    sortable: true,
    cell: { col: 'lastLiveAt' },
  },
  {
    title: '注册时间',
    width: 185,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    title: '状态',
    width: 100,
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
