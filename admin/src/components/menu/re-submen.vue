<template>
  <el-submenu :index="parent.name">
    <template slot="title">
      <i :class="parent.icon"></i>
      <span slot="title">{{ parent.meta.title }}</span>
    </template>
    <template v-for="item in parent.children">
      <re-submenu v-if="item.children" :key="`menu_${item.name}`" :index="item.name" :parent="item"></re-submenu>
      <el-menu-item v-if="!item.hidden" :key="`menu_${item.name}`" :index="item.name">
        <i :class="item.icon"></i> 
        <span slot="title" v-if="">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-submenu>
</template>
<script>
export default {
  name: "ReSubmen",
  props: {
    parent: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

