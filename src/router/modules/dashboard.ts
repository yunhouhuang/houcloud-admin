export default [
  {
    path: '/dashboard',
    component: () => import('@/layouts/index.vue'),
    name: 'Dashboard',
    meta: {
      title: '控制台',
      icon: 'icon-tongjifenxi',
      single: true,
      permission: 'dashboard',
      weight: 9999,
      expanded: false,
    },
    children: [
      {
        path: '',
        name: 'DashboardIndex',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: { title: '控制台' },
      },
    ],
  },
];
