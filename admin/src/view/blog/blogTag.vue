<template>
  <div class="tag-container" v-loading="loading">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="handleAddTag">添加标签</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table :data="blogTagList" style="width: 100%">
          <el-table-column label="ID" width="180">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="标签名" width="180">
            <template slot-scope="scope">{{ scope.row.tag_name }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEditTag(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDeleteTag(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBlogTagList, editBlogTag, deleteBlogTag, addBlogTag } from '@/api/blog'
export default {
  data() {
    return {
      blogTagList: null,
      loading: true
    }
  },

  created() {
    this.handleBlogTagList()
  },

  methods: {

    async handleBlogTagList(){
      let { data: { data } } = await getBlogTagList()
      this.loading = false
      this.blogTagList = data
    },

    handleEditTag(index, row) {
      this.$prompt('请输入标签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.tag_name,
        inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
        inputErrorMessage: '标签长度2-12字符'
      }).then(async({ value }) => {
        this.loading = true
        let param = { id: row.id, tag_name: value }
        let result = await editBlogTag(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg);
        this.handleBlogTagList()
      }).catch(() => {
        console.log('取消添加')
      })
    },

    handleDeleteTag(index, row) {
      this.$confirm('此操作将永久删除该标签，文章关联将失效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        let param = { id: row.id }
        let result = await deleteBlogTag(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg);
        this.handleBlogTagList()
      }).catch(() => {
        console.log('取消删除')
      })
    },

    handleAddTag() {
      this.$prompt('请输入标签', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: '标签长度2-12字符'
        }).then(async({ value }) => {
          let param = { tag_name: value }
          let result = await addBlogTag(param)
          if(!result.data.code) return this.$message.error(result.data.msg)
          this.$message.success(result.data.msg);
          this.handleBlogTagList()  
        }).catch(() => {
        console.log('取消添加')
      })
    },

  }
}
</script>

<style lang="scss" scoped>
  .tag-container{
    width: 100%;
    padding: 20px;
    background: white;
    border-radius: 8px;
  }
</style>
