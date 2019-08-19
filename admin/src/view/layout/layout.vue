<template>
  <el-container class="layout-wrap">

    <!--  侧边栏 -->
    <side-menu :isCollapse="isCollapse" :menuList="routers">
      <div class="user-avatar">
        <img :src="userInfo.thumb_img_url" alt="用户头像">
        <span :class="isCollapse?'hidden-name':''">{{userInfo.nickname}}</span>
      </div>
    </side-menu>

    <!-- 头部+内容 -->
    <el-container>
      <!-- 头部 -->
      <el-header style='height: auto'>
        <s-header :isCollapse="isCollapse" :userInfo="userInfo" @handCollapse="handCollapse"></s-header>
        <!-- tag
        <el-tabs class="tag" style="" type="card" @tab-click="handleClickTab" @tab-remove="handleRemoveTab" closable :value="$route.name">
          <el-tab-pane v-for="item in tabList" :key="`tabNav_${item.meta.title}`" :label="item.meta.title" :name="getTabNameByRoute(item)"></el-tab-pane>
        </el-tabs> -->
      </el-header>

      <!-- 内容 -->
      <el-main>
        <section class="conter-wrapper">
          <router-view />
        </section>
      </el-main>

      <!-- 底部 S-->
      <!-- <el-footer>版权©2019 SuperMan .</el-footer> -->
      <!-- 底部 E-->
    </el-container>
  </el-container>
</template>
<script>

import { getUserInfo } from "@/api/user";
import sideMenu from "@/components/menu";
import sHeader from "./sHeader";
import { mapState, mapMutations } from "vuex";
import { getTabNameByRoute } from "@/lib/util";
export default {
  name: "layout",
  components: {
    sideMenu,
    sHeader
  },
  
  data() {
    return {
      token: '',
      getTabNameByRoute,
      isCollapse: false,
      userInfo: {},
    };
  },

  watch: {
    $route(newRoute) {
      this.UPDATE_ROUTER(newRoute);
    }
  },

  created() {
    // 第一次进入页面时，修改值
    this.UPDATE_ROUTER(this.$route);
    this.token = JSON.parse(this.publicMethod.getCookie("token"));
    this.handleGetUserInfo()
  },

  computed: {
    ...mapState({
      // 模块里头的
      routers: state => state.router.routers[0].children,
      tabList: state => state.tabNav.tabList,
      labelPath: state => state.tabNav.labelPath
    })
  },

  methods: {
    ...mapMutations(["UPDATE_ROUTER", "DELETE_ROUTER"]),

    // 获取用户信息
    handleGetUserInfo() {
      let param = { token: this.token }
      getUserInfo(param).then(res => {
        if (!res.data.code) return this.$message({ showClose: true, message: res.data.msg, type: 'error' });
        if (res.data.code === -1) return this.$message({ showClose: true, message: res.data.msg, type: 'error' });
        this.userInfo = res.data.data[0];
      }).catch(e => {
        console.error(e)
      })
    },
 
    // 显示隐藏侧栏
    handCollapse(isCollapse) {
      this.isCollapse = isCollapse;
    },

    //添加
    handleClickTab(key, event) {
      this.$router.push({ path: key.name });
    },

    handleRemoveTab(name, event) {
      let activeName = this.$route.name;
      this.$store.commit("DELETE_ROUTER", { name, activeName });
      this.$router.push(this.labelPath);
    }

  }
};
</script>

<style lang="scss">

.el-tabs__header{
  margin: 0;
}

.layout-wrap {
  height: 100vh;

  .el-container{
    min-width: 1200px;
    min-height: 100%;
    overflow: auto;
  }

  .el-header{
    padding: 0;
    display: flex;
    flex-direction: column;

    .el-icon-setting {
      cursor: pointer;
      font-size: 25px;
      transition: transform 1s ease;
    }
  }
  
  //
  .el-main {
    width: 100%;
    margin: 0 auto;
    position: relative;
    overflow: initial;
    padding: 10px 20px;
  }

  .user-avatar {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      padding-right: 5px;
    }
    .hidden-name {
      display: none;
    }
  }
  .tag{
    background:white;
    margin: 10px 20px 0;
    padding: 10px;
  }
}

</style>

