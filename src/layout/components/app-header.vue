<template>
<div class='header'>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item style="cursor: pointer" @click.native="handleJump">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar
        shape="square"
        :size="40"
        :src="userInfo.portrait || require('../../assets/avatar.png')"
      ></el-avatar>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
      <el-dropdown-item
        divided
        @click.native="handleLogout"
      >退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { getUserInfo } from '@/services/user'

const nameMap = {
  role: '角色列表',
  menu: '菜单列表',
  resource: '资源管理',
  'resource-category': '资源分类'
}
export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.loadUserInfo()
  },
  computed: {
    title () {
      return nameMap[this.$route.name as keyof typeof nameMap]
    }
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleJump () {
      this.$router.push('/').catch((err: any) => err)
    },
    handleLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setUser', null)
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
})
</script>

<style lang='scss' scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
