<template>
  <el-container class="homeContainer">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="warning" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :default-active="activePath"
          :collapse="isCollapse"
          router
          :collapse-transition="false"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-submenu :index="v.id + ''" v-for="v in menuList" :key="v.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[v.id]"></i>
              <!-- 文本 -->
              <span>{{ v.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="savePath('/' + item.path)" :index="'/' + item.path" v-for="item in v.children" :key="item.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="iconfont icon-liebiao"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-yonghuguanli',
        '103': 'iconfont icon-quanxianguanli',
        '101': 'iconfont icon-shangpinguanli',
        '102': 'iconfont icon-dingdanguanli',
        '145': 'iconfont icon-shujutongji'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    loginOut() {
      // window.sessionStorage.removeItem('token')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      let { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 菜单的折叠展开
    toggleCollapse(e) {
      this.isCollapse = !this.isCollapse
    },
    // 保存获取到的path
    savePath(v) {
      window.sessionStorage.setItem('activePath', v)
    }
  },
  created() {
    this.getMenuList()
    console.log(1)
    // 取出保存的path
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
// document.body.
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
}
.el-menu {
  border: none;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  padding: 0 10px 0 0;
}
.toggle-btn {
  background-color: #4a5064;
  text-align: center;
  color: white;
  font-size: 12px;
  padding: 5px 0;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
