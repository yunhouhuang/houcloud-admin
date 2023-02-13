import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/personal',
    name: 'Personal',
    component: Layout,
    redirect: '/personal/index',
    meta: { title: '个人页', icon: 'user-circle', hidden: true },
    children: [
      {
        path: 'index',
        name: 'PersonalIndex',
        component: () => import('@/pages/personal/index.vue'),
        meta: { title: '个人中心' },
      },
      {
        path: 'notice',
        name: 'PersonalNotice',
        component: () => import('@/pages/personal/notice/index.vue'),
        meta: { title: '消息通知' },
      },
    ],
  },
];
