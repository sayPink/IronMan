<template>
  <i :class="classes" :style="styles"></i>
</template>
<script>
export default {
  name: "IconFont",
  props: {
    icon: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#515a5e"
    },
    size: {
      type: Number,
      default: 12
    }
  },

  computed: {
    classes() {
      return ["iconfont", `icon-${this.icon}`];
    },
    styles() {
      return { color: this.color, fontSize: `${this.size}px` };
    }
  }
};
</script>
