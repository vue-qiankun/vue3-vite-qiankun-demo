import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import { registerMicroApps, start } from "qiankun";

const app = createApp(App)

const apps: any[] = [
  {
    name: "app1", // 应用的名字
    entry: "http://localhost:9001/", // 默认加载这个html，解析里面的js动态的执行（子应用必须支持跨域，内部使用的是 fetch）
    container: "#container", // 要渲染到的节点id，对应上一步中src/App.vue中的渲染节点
    activeRule: "/apps/app1"
  },
  {
    name: "app2",
    entry: "http://localhost:9002/",
    container: "#container",
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
