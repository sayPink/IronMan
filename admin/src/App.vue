<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",

  created() {
    // 第一次进入页面时，修改值

  },
  computed: {

  }
};
</script>

<style lang="scss">
@import "./scss/common.css";
@import "element-ui/lib/theme-chalk/index.css";
</style>
