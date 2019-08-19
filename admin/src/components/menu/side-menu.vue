 <template>
  <div class="side-menu-wrapper">
    <el-menu
      class="menu-wrap el-menu-vertical-demo"
      background-color="white"
      text-color=""
      active-text-color="#409EFF"
      :default-active="$route.name"
      :collapse="isCollapse"
      @select="headleSelect"
      unique-opened
    >
      <slot></slot>
      <template v-for="item in menuList">
        <re-submenu
          v-if="item.children"
          :key="`menu_${item.name}`"
          :index="item.name"
          :parent="item"
        ></re-submenu>
        <el-menu-item v-else :key="`menu_${item.name}`" :index="item.name">
          <i :class="item.icon"></i>
          <span slot="title"> {{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
 <script>
//
import ReSubmenu from "./re-submen.vue";
import { mapState } from "vuex";
export default {
  name: "SideMenu",
  components: {
    ReSubmenu
  },
  computed: {
    // 路由没有 使用 mode: 'history', 应添加下面这个方法
    // headleRoutes() {
    //   return this.$route.path.replace("/", "");
    // }
  },
  data() {
    return {};
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    headleSelect(name) {
      this.$router.push({ name });
    }
  }
};
</script>
<style lang="scss">
.menu-wrap {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  overflow: hidden;
}
</style>

 
 