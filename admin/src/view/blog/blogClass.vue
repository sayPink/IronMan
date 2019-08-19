<template>
  <div class="class-container" v-loading="loading">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="handleAddClass">添加分类</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table :data="classList" style="width: 100%">
          <el-table-column label="ID" width="180">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="分类名" width="180">
            <template slot-scope="scope">{{ scope.row.class_name }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEditClass(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDeleteClass(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBlogClassNameList, editBlogClass, deleteBlogClass, addBlogClass } from '@/api/blog'
export default {
 data() {
    return {
      classList: null,
      loading: true
    }
  },

  created() {
    this.handleBlogClassList()
  },

  methods: {

    async handleBlogClassList(){
      let result = await getBlogClassNameList()
      this.loading = false
      if(!result.data.code) return this.$message.error(result.data.msg)
      this.classList = result.data.data
    },

    handleEditClass(index, row) {
      this.$prompt('请输入分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.class_name,
        inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
        inputErrorMessage: '标签长度2-12字符'
      }).then(async({ value }) => {
        this.loading = true
        let param = { id: row.id, class_name: value }
        let result = await editBlogClass(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg);
        this.handleBlogClassList()
      }).catch(() => {
        console.log('取消添加')
      })
    },

    handleDeleteClass(index, row) {
      this.$confirm('此操作将永久删除该标签，文章关联将失效, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.loading = true
        let param = { id: row.id }
        let result = await deleteBlogClass(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg);
        this.handleBlogClassList()
      }).catch(() => {
        console.log('取消删除')
      })
    },

    handleAddClass() {
      this.$prompt('请输入分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[u4e00-\u9fa5a-zA-Z0-9]{1,12}$/,
          inputErrorMessage: '标签长度2-12字符'
        }).then(async({ value }) => {
          let param = { class_name: value }
          let result = await addBlogClass(param)
          if(!result.data.code) return this.$message.error(result.data.msg)
          this.$message.success(result.data.msg);
          this.handleBlogClassList()  
        }).catch(() => {
          console.log('取消添加')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
 .class-container{
    width: 100%;
    padding: 20px;
    background: white;
    border-radius: 8px;
  }
</style>