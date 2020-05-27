import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      component: resolve => require(['../pages/Index.vue'], resolve)
    },
    {
      path: '/login',
      component: resolve => require(['../pages/pc/login/Login.vue'], resolve)
    },
    {
      path: '/main',
      component: resolve => require(['../pages/pc/main/Main.vue'], resolve)
    },
    {
      path: '/mLogin',
      component: resolve => require(['../pages/mobile/login/Login.vue'], resolve)
    },
    {
      path: '/mMain',
      component: resolve => require(['../pages/mobile/main/Main.vue'], resolve)
    },
    {
      path: '/cantPlay',
      component: resolve => require(['../pages/mobile/help/CantPlay.vue'], resolve)
    }
  ]
})

// const Foo = {
//   template: `...`,
//   beforeRouteEnter(to, from, next) {
//     // 在渲染该组件的对应路由被 confirm 前调用
//     // 不！能！获取组件实例 `this`
//     // 因为当守卫执行前，组件实例还没被创建
//   },
//   beforeRouteUpdate(to, from, next) {
//     // 在当前路由改变，但是该组件被复用时调用
//     // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
//     // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
//     // 可以访问组件实例 `this`
//   },
//   beforeRouteLeave(to, from, next) {
//     // 导航离开该组件的对应路由时调用
//     // 可以访问组件实例 `this`
//   }
// }


// router.beforeEach((to, from, next) => {
//   console.error("asdfasdfasdfasdfasdfasdfasdfasdfasdfadffs")
// })


export default router