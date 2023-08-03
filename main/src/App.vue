<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
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
    </div>
  </header>

  <!-- 渲染节点 -->
  <div id="container" />
  <RouterView />
</template>

<style scoped>


nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
