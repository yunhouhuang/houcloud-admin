export const COLUMNS = [
  {
    title: '图标',
    align: 'left',
    colKey: 'image',
    width: 80,
    ellipsis: true,
    fixed: 'left',
  },
  { title: '名称', colKey: 'name', width: 130, cell: { col: 'name' } },
  { title: '排序', colKey: 'weight', width: 80, cell: { col: 'weight' } },
  { title: '类型', colKey: 'type', cell: { col: 'type' } },
  {
    title: '修改时间',
    width: 190,
    ellipsis: true,
    colKey: 'updatedAt',
  },
  {
    title: '创建时间',
    width: 190,
    ellipsis: true,
    colKey: 'createdAt',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 140,
    colKey: 'op',
    title: '操作',
  },
];
