import Vue from 'vue'
import Router from 'vue-router'
// 登录页面
import Login from '../components/Login.vue'
// 主页
import Home from '../components/Home.vue'
// 欢迎页面
import Welcome from '../components/Welcome.vue'
// 用户页面
import Users from '../components/Users.vue'
// 权限管理
import Roles from '../components/power/Roles.vue'
// 权限列表
import Rights from '../components/power/Rights.vue'
// 商品分类
import Cate from '../components/goods/Cate.vue'
// 分类参数
import Params from '../components/goods/Params.vue'

// 导入面包屑导航
import Mbx from '../components/Mbx.vue'
// 将面包屑导航注册为全局组件
Vue.component('Mbx', Mbx)

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    }
    ]
  }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from从哪个路径跳转过来
  // next()不加参数代表放行,加参数代表强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
