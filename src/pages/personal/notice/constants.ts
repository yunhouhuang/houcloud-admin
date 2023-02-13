export const COLUMNS = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: '标题',
    align: 'left',
    width: 120,
    colKey: 'title',
    fixed: 'left',
  },
  {
    title: '时间',
    width: 190,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    title: '状态',
    align: 'left',
    width: 120,
    colKey: 'status',
    fixed: 'left',
  },
  { title: '内容', colKey: 'content', cell: { col: 'content' }, fixed: 'content' },

  {
    align: 'left',
    fixed: 'right',
    width: 120,
    colKey: 'op',
    title: '操作',
  },
];
