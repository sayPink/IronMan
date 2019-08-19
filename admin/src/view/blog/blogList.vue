<template>
  <div class="blog-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6" class="music-wrap" style="cursor: auto">
        <div class="item">
          <i class="el-icon-tickets"></i>
          已发布
          <span class="color-blue">{{ totalCount }}</span> 篇博客
        </div>
      </el-col>
      <el-col :span="6" class="music-wrap">
        <div class="item" @click="$router.push('/blogAdd')">
          <i class="el-icon-document-add"></i>
          添加博客
        </div>
      </el-col>
    </el-row>
    
    <div class="blog-list">
      <!-- 列表 -->
      <el-table :data="blogList" tooltip-effect="dark" style="width: 100%;margin-top: 10px" highlight-current-row header-align="center" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="标题" width="550">
          <template slot-scope="scope">
            <el-tag size="mini" disable-transitions type="success" v-if="scope.row.is_top" @click="handleCancelTop(scope.row.id)">取消置顶</el-tag>
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="class_name" label="分类" width="100"></el-table-column>
        <el-table-column label="标签" width="400">
          <template slot-scope="scope">
            <el-tag size="mini" style="margin-left: 5px" disable-transitions v-for="item in scope.row.tag_name"
              :key="item.id">{{item.tag_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="编辑时间" width="150"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="operating" label="操作" show-overflow-tooltip width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="$router.push('/blogDetail/'+scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push('/blogEdit/'+scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
         </el-table-column>
      </el-table>

      <div style="margin: 10px 20px">
        <el-button size="small" :disabled="checkSelectEmpty"
          type="success" @click="handleSelectTop">置顶</el-button>
        <el-button size="small" :disabled="checkSelectEmpty"
          type="danger" @click="handleSelectDelte">删除</el-button>
      </div>

      <!-- 分页 -->
      <pageing :currentPage="currentPage" :totalCount="totalCount" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></pageing>
    </div>

  </div>
</template>

<script>
import { getBlogList, cancelTop, deleteBlog } from "@/api/blog";
import pageing from "@/components/pageing";
import { dataFormat } from "@/lib/util"
export default {
  components: {
    pageing
  },

  data() {
    return {
      loading: true,
      multipleSelection:[],
      totalCount: 1, //分页 总条数
      currentPage: 1, //分页 第几页
      PageSize: 12,
      blogList:[],
    }
  },

  created(){
    this.handleBlogList()
  },

  computed: {
    checkSelectEmpty() {
      return !this.multipleSelection.length
    }
  },

  methods:{
    
    handleSelectTop(){
      let id = this.multipleSelection.map(item => item.id);
      if (!this.multipleSelection.length) return this.$notify({ title: '警告', message: '请选择删除的用户', type: 'warning' });
      this.$confirm(`此操作将置顶这${id.length}篇博客, 是否继续?`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        this.loading = true;
        let param = { id: id.join(','), is_top: 1 };
        let result = await cancelTop(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg)
        this.handleBlogList()
      }).catch(()=>{
        console.log('取消')
      })
    },

    handleSelectDelte(){
      let id = this.multipleSelection.map(item => item.id);
      if (!this.multipleSelection.length) return this.$notify({ title: '警告', message: '请选择删除的用户', type: 'warning' });
      this.$confirm(`此操作将删除这${id.length}篇博客, 是否继续?`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        this.loading = true;
        let param = { id: id.join(',')};
        let result = await deleteBlog(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg)
        this.handleBlogList()
      }).catch(()=>{
        console.log('取消')
      })
    },

    async handleCancelTop(id){
      let param = { id: id, is_top: 0 }
      let result = await cancelTop(param)
      if(!result.data.code) return this.$message.error(result.data.msg)
      this.$message.success(result.data.msg)
      this.handleBlogList()
    },

    async handleBlogList(){
      let param = { 
        page_num: this.currentPage,
        page_size: this.PageSize
      }
      let result = await getBlogList(param)
      if(!result.data.code) return this.$message.error(result.data.msg)
       result.data.data.map((item, index) =>{
        if(result.data.data[index].update_time){
          result.data.data[index].update_time = dataFormat(result.data.data[index].update_time)
          result.data.data[index].create_time = dataFormat(result.data.data[index].create_time)
        }
      })
      this.loading = false
      this.blogList = result.data.data
      this.totalCount = result.data.total
    },

     // 每页显示的条数
    handleSizeChange(val) {
      this.loading = true;
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
      this.handleBlogList();
    },

    // 显示第几页
    handleCurrentChange(val) {
      this.loading = true;
      // 改变默认的页数
      this.currentPage = val;
      this.handleBlogList();
    },

     // 删除表格
    handleDelete(index, row) {
      this.$confirm('你确定要删除吗。', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        this.loading = true;
        let param = { id: row.id };
        let result = await deleteBlog(param)
        if(!result.data.code) return this.$message.error(result.data.msg)
        this.$message.success(result.data.msg)
        this.handleBlogList()
      }).catch(e =>{
        console.log('取消')
      })
    },
        //选中的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 编辑表格
    handleEdit(row) {
      this.centerDialogVisible = !this.centerDialogVisible;
      this.userInfo = { ...row };
    },

  }
}
</script>

<style scoped lang="scss">
.blog-container {

  .el-pagination{
    padding: 0 20px 10px;
  }

  .el-tag.el-tag--success{
    cursor: pointer;
  }

  .music-wrap {
    background: white;
    margin: 0 10px;
    border-radius: 8px;
    color: #666;
    cursor: pointer;

    .item {
      height: 90px;
      display: flex;
      align-items: center;
      margin-left: 10px;

      .color-blue{
        color: #409eff;
        padding: 0 5px;
      }
    }
    .el-icon-tickets,
    .el-icon-document-add {
      font-size: 28px;
      padding-right: 15px;
      color: inherit;
      opacity: 0.8;
    }
  }

  .blog-list{
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 8px;
    background-color: white;
    padding: 0 20px;
  }
}
</style>