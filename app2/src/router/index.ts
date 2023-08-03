import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
console.log(qiankunWindow.__POWERED_BY_QIANKUN__ ,"app2---");

const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? "/apps/app2" : "/"),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../App.vue')//这个是我自己的路径
    },
    {
      path: '/:catchAll(.*)',
      name: "404",
      component: () => import('../App.vue')//这个是我自己的路径
    },
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to,"----");
  next()
})
export default router