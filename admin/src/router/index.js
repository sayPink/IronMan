import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import publicMethod from '@/lib/util'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
})

// // 导航守卫    beforeEach不能访问this 因为守卫导航确定前被调用，因此即将登场的新组建还没有创建
router.beforeEach((to, from, next) => {
  to.meta && publicMethod.setTitle(to.meta.title)
  if (to.name !== 'login') {
    if (publicMethod.getCookie('token') !== null) next()
    else next({
      name: 'login'
    })
  } else {
    if (publicMethod.getCookie('token') !== null) next({
      name: 'home'
    })
    else next()
  }
})

// router.berforeResolve(route => {
//   // ${//these hooks do not get a next function and cannot affect the navigation}
// })

// 后置钩子  路由后搞事情
// router.afterEach(route => {

// })

/* 
 *1.导航被触发
 *2.在失活的组件(即将离开的页面组件)里调用离开守卫 beforeRouteLeave
 *3.调用全局的前置守卫 beforeEach
 *4.在重用的组件里调用 beforeRouteUpdate
 *5.调用路由独享的守卫 beforeEnter
 *6.解析异步路由组件
 *7.在被激活的组件（即将进入的页面组件）里调用beforeRouteEnter
 *8.调用全局解析守卫 beforeResolve
 *9.导航被确认
 *10.调用全局的后置守卫 aferEach
 *11.触发DOM更新
 *12.用创建好的实例低氧beforeRouteEnter守卫里传入next的回调函数
 */

export default router
