
import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
console.log(qiankunWindow.__POWERED_BY_QIANKUN__ ,"app1---");
const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? "/apps/app1" : "/"),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: "404",
      component: () => import('../App.vue')//这个是我自己的路径
    },
  ]
})

export default router