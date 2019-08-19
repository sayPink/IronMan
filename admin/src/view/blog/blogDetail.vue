<template>
  <div class="detail-container">
    <div class="top-container">
      <el-button type="primary" icon="el-icon-back" circle @click="$router.go(-1)"></el-button>
    </div>
    <div class="html-container color-block vertical" v-html="html"></div>
  </div>
</template>

<script>
import { getBlogDetail } from "@/api/blog"

export default {
  data() {
    return {
      html: ''
    }
  },

  async created() {
    let result = await getBlogDetail(this.$route.params)
    if(!result.data.code) return this.$message.error(result.data.msg)
    this.html = result.data.data[0].html
  }

}
</script>

<style scoped>
.detail-container{
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
}
</style>
