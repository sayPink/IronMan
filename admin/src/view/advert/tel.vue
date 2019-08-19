<template>
  <div>
    <h1>{{message}}8</h1>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "tel",
  data() {
    return {
      message: ""
    };
  },
  computed: {
    // ...mapState({
    //   appName: state => state.router.appName
    // })
  },
  mounted() {
    this.$bus.$on("on-click", mes => {
      this.message = mes;
    });
  }
};
</script>
<style>

</style>
