## 关于Qiankun
qiankun 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

官方文档： https://qiankun.umijs.org/zh/guide
## 操作步骤

### 创建主应用
```bash
pnpm create vue
Project name: main
cd main
pnpm add qiankun -S
pnpm install
pnpm dev
```
#### main.ts
```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import { registerMicroApps, start } from "qiankun";

const app = createApp(App)

const apps: any[] = [
  {
    name: "app1", // 应用的名字
    entry: "http://localhost:9001/", // 默认加载这个html，解析里面的js动态的执行（子应用必须支持跨域，内部使用的是 fetch）
    container: "#app1", // 要渲染到的节点id，对应上一步中src/App.vue中的渲染节点
    activeRule: "/apps/app1"
  },
  {
    name: "app2",
    entry: "http://localhost:9002/",
    container: "#app2",
    activeRule: "/apps/app2"
  },
];
registerMicroApps(apps); // 注册应用
start({
  prefetch:'all', // 预加载
  sandbox: {
      //experimentalStyleIsolation: true, //   开启沙箱模式,实验性方案
  },
}); // 开启应用

app.use(router)
app.mount('#app')
```
#### App.vue
```vue
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <!-- 新增app1路由 -->
        <router-link to="/apps/app1">app1</router-link>
        <!-- 新增app1路由 -->
        <router-link to="/apps/app1/about">app1/about</router-link>
        <!-- 新增app2路由 -->
        <router-link to="/apps/app2">app2</router-link>
      </nav>
  <RouterView />
  <!-- 新增site1渲染节点 -->
  <div id="app1" />
  <!-- 新增app2渲染节点 -->
  <div id="app2" />
```
### 创建app1
```bash
pnpm create vue
Project name: app1
cd app1
pnpm add vite-plugin-qiankun -S
pnpm install
pnpm dev
```
#### vite.config.ts
```ts
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: { usePolling: true },
    hmr: true,
    port: 9001,
    headers: {
      'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
    },
  },
  plugins: [
    vue(),
    qiankun('vue3', {
      useDevMode: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```
#### main.ts
```ts
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps,
} from "vite-plugin-qiankun/dist/helper";
const initQianKun = () => {
  renderWithQiankun({
    // bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap
    // 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等
    bootstrap() {
      console.log("bootstrap app1");
    },
    // 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法，也可以接受主应用传来的参数
    mount(_props: any) {
      console.log("mount", _props);
      render(_props.container);
    },
    // 应用每次 切出/卸载 会调用的unmount方法，通常在这里我们会卸载微应用的应用实例
    unmount(_props: any) {
      console.log("unmount", _props);
    },
    update: function (props: QiankunProps): void | Promise<void> {
      console.log("update");
    },
  });
};

const render = (container) => {
  // 如果是在主应用的环境下就挂载主应用的节点，否则挂载到本地
  const appDom = container ? container : "#app";
  const app = createApp(App);
  app.use(router);
  app.mount(appDom);
};
// 判断是否为乾坤环境，否则会报错iqiankun]: Target container with #subAppContainerVue3 not existed while subAppVue3 mounting!
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render(null);

```
#### router/index.ts
```ts

import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
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
```
### 创建app2
与app1创建方式相同，只是名称不同
## 启动
分别在main/app1/app2目录下执行`pnpm dev`,浏览器访问 [http://localhost:5173/](http://localhost:5173/) 即可

## 踩坑点
- 由于应用的路由不在`router/index.ts`里，请求应用路由时会出现`[Vue Router warn]: No match found for location with path`的提示，在路由表中加`/:catchAll(.*)`可解决该类问题
- initQianKun.mount 调用render时，要有完整的createApp().mount(),当你切换应用时，这个逻辑会重新调用。
- 子应用的全局样式，会影响主应用，所以设计的时候要做到样式隔离

## 项目地址

https://github.com/vue-qiankun/vue3-vite-qiankun-demo
