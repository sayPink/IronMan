<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6" class="music-wrap">
        <div class="item" @click="$router.push('/music')">
          <i class="el-icon-headset"></i>
          已添加
          <span class="color-blue">{{ musicTotal }}</span> 首音乐
        </div>
      </el-col>
      <el-col :span="6" class="music-wrap">
        <div class="item" @click="$router.push('/blogList')">
          <i class="el-icon-document"></i>
          已发布
          <span class="color-blue">{{ blogTotal }}</span> 篇博客
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBlogList } from "@/api/blog";
import { getMusicList } from "@/api/blog"
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      blogTotal: '',
      musicTotal: ''
    };
  },

  created(){
    this.handleBlogList()
    this.handleMusicList()
  },

  methods:{
    async handleBlogList() {
      let result = await getBlogList()
      if(!result.data.code)return
      this.blogTotal = result.data.total
    },
    async handleMusicList() {
      let result = await getMusicList()
      if(!result.data.code)return
      this.musicTotal = result.data.total
    },
  }

};
</script>

<style scoped lang="scss">

.home-container {
  .music-wrap {
    background: white;
    margin: 0 10px;
    border-radius: 8px;
    color: #666;
    cursor: pointer;

    .item {
     padding: 30px;
      display: flex;
      align-items: center;
      margin-left: 10px;

      .color-blue{
        color: #409eff;
        padding: 0 5px;
      }

    }

    .el-icon-headset,
    .el-icon-document {
      font-size: 28px;
      padding-right: 15px;
      color: inherit;
      opacity: 0.8;
    }
  }

  .music-wrap:hover {
    background: #f8f8f8;
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.1);
    color: #333;
  }
}
</style>