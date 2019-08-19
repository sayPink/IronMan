export default [{
    path: '/',
    redirect: '/home',
    name: 'layout',
    component: () => import('@/view/layout/layout'),
    children: [{
        id: 9,
        path: '/home',
        name: 'home',
        icon: "el-icon-loading",
        component: () => import('@/view/home'),
        meta: {
          title: '首页',
        }
      },
      {
        id: 1,
        path: '/music',
        name: 'music',
        icon: "el-icon-orange",
        meta: {
          title: '音乐管理'
        },
        component: () => import('@/view/music'),
      },
      {
        id: 13,
        path: '/userList',
        name: 'userList',
        icon: "el-icon-chicken",
        meta: {
          title: '用户列表',
          // transitionName: 'router'
        },
        component: () => import('@/view/user/userList'),
      },
      {
        id: 6,
        path: '/blog',
        name: 'blog',
        redirect: '/blogList',
        icon: "el-icon-potato-strips",
        meta: {
          title: '博客管理',
        },
        component: () => import('@/view/router'),
        children: [{
          id: 9,
          path: '/blogList',
          name: 'blogList',
          icon: "el-icon-watermelon",
          component: () => import('@/view/blog/blogList'),
          meta: {
            title: '博客列表',
          },
        },
        {
          id: 12,
          path: '/blogAdd',
          name: 'blogAdd',
          icon: "el-icon-cold-drink",
          component: () => import('@/view/blog/blogAdd'),
          meta: {
            title: '添加博客',
          },
        },
        {
          id: 10,
          path: '/blogTag',
          name: 'blogTag',
          icon: "el-icon-sugar",
          component: () => import('@/view/blog/blogTag'),
          meta: {
            title: '标签管理',
          }
        },
        {
          id: 11,
          path: '/blogClass',
          name: 'blogClass',
          icon: "el-icon-dessert",
          component: () => import('@/view/blog/blogClass'),
          meta: {
            title: '分类管理',
          }
        },
        {
          id: 13,
          path: '/blogEdit/:id',
          name: 'blogEdit',
          icon: "el-icon-dessert",
          hidden: true,
          component: () => import('@/view/blog/blogEdit'),
          meta: { title: '编辑博客' }
        },
        {
          id: 14,
          path: '/blogDetail/:id',
          name: 'blogDetail',
          icon: "el-icon-dessert",
          hidden: true,
          component: () => import('@/view/blog/blogDetail'),
          meta: { title: '博客详情' }
        },
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login.vue')
  },
  {
    path: '*',
    component: () => import('@/view/error_404.vue')
  }
]
