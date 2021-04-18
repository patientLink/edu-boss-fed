<template>
  <el-container style="position: relative">
    <el-aside style="width: 200px">
      <app-aside></app-aside>
    </el-aside>
    <el-container style="position: relative">
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang='scss' scoped>
.el-container {
  min-height: 100vh;
  min-width: 980px;
}
.el-aside {
  background: #d3dce6;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 11;
}
.el-header {
  background: #f8f9fb;
  position: fixed;
  width: 100%;
  padding-left: 220px;
  top: 0;
  z-index: 10;
}
.el-main {
  background: #e9eef3;
  position: absolute;
  padding-left: 220px;
  top: 60px;
  width: 100vw;
  min-width: 980px;
}
</style>
