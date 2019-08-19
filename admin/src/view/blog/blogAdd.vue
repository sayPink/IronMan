<template>
  <div class="add-container" v-loading="loading">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8">
        <el-input placeholder="请输入标题" v-model="title">
          <template slot="prepend">标题</template>
        </el-input>
      </el-col>

      <el-col :span="4">
        <el-popover placement="top" trigger="hover">
          <img class="cover-img" :src="cover" v-if="cover">
          <span class="tip-text" v-else>未添加封面</span>
          <el-button icon="el-icon-plus" style="width:100%" slot="reference" @click="handleDispatchEvent">{{cover ? "已添加" : "添加封面"}}</el-button>
        </el-popover>
        <input type="file" hidden ref="up_cover" @change="handleSelectDone">
      </el-col>

      <el-col :span="4">
        <el-select placeholder="选择博客类别" v-model="class_id" style="width:100%">
          <el-option v-for="item in classList" :key="item.id" :label="item.class_name" :value="item.id"></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <el-select multiple v-model="tag_id" placeholder="请选择文章标签" style="width:100%">
          <el-option v-for="item in blogTagList" :key="item.id" :label="item.tag_name" :value="item.id"></el-option>
        </el-select>
      </el-col>
    </el-row>
    

    <mavon-editor codeStyle="atom-one-dark" :toolbars="toolbars" @save="handleSubmit" @imgAdd="handleUploadImage"
      @change="handleEditContent"  ref="md" :boxShadow="false">
    </mavon-editor>
  </div>
</template>

<script>
import quillEditor from "@/components/quillEditor";
import { upload, markDownMoveFile, getBlogClassNameList, getBlogTagList, addBlog } from "@/api/blog"

export default {
  name: "blogAdd",
  // components: {
  //   quillEditor
  // },
  data() {
    return {
      loading: false,
      markdown: '',
      html: '',
      cover: '',
      title: '',
      class_id: '',
      tag_id: '',
      blogTagList: [],
      classList: [],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: false, // 标题
        underline: false, // 下划线
        strikethrough: false, // 中划线
        mark: false, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: false, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
    };
  },

  created() {
    this.handleBlogClassList()
    this.handleBlogTagList()
  },

  methods: {

    handleSubmit(){
      let coverUlr = null
      if(this.cover){
        coverUlr = this.cover.split('/')
      }
      let param = { 
        markdown: this.markdown, 
        html: this.html, 
        cover: coverUlr[coverUlr.length - 1], 
        title: this.title, 
        class_id: this.class_id, 
        tag_id: this.tag_id.join(',')
      }
      if(!param.title)return this.$message.error('标题必须写，写多少心里没数么')
      if(!param.cover)return this.$message.error('封面不选那不丑的一匹')
      if(!param.class_id)return this.$message.error('分类选一选')
      if(!param.tag_id)return this.$message.error('分类都选了，差个标签么')
      if(!param.markdown)return this.$message.error('内容都没填就发布,寻思啥呢')
      this.$confirm('此操作将发布博客, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async()=>{
        let result = await addBlog(param)
        if(!result.data.code) return this.$notify.error({ title: '失败', message: result.data.msg });
        this.$notify({ title: '成功', message: result.data.msg, type: 'success' });
        this.$router.replace('/blogList')
      }).catch(e =>{
        console.log('取消发布')
      })
    },

    async handleSelectDone(e){
      this.loading = true
      let result = await this.uploadImage(e.target.files[0])
      this.cover = result.data.data
    },

    handleDispatchEvent() {
      this.$refs.up_cover.dispatchEvent(new MouseEvent('click'))
    },

    async handleBlogClassList(){
      let result = await getBlogClassNameList()
      if(!result.data.code) return this.$message.error(result.data.msg)
      this.classList = result.data.data
    },

    async handleBlogTagList(){
      let { data: { data } } = await getBlogTagList()
      this.blogTagList = data
    },

    async handleUploadImage(pos, $file){
      this.loading = true
      let result = await this.uploadImage($file)
      this.$refs.md.$img2Url(pos, result.data.data)
    },

    async uploadImage(file){
      let formdata = new FormData();
      formdata.append('image', file);
      let result = await upload(formdata)
      this.loading = false
      if(!result.data.code) return this.$notify.error({ title: '失败', message: result.data.msg });
      let moveFile = await markDownMoveFile({fileName: result.data.data})
      this.$notify({ title: '成功', message: result.data.msg, type: 'success' });
      return moveFile
    },

    handleEditContent(markdown, html) {
      this.markdown = markdown
      this.html = html
    }
  },
 
};
</script>
<style scoped lang="scss">

.add-container{
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: white;
}

.cover-img{
  display: block;
  max-width: 400px;
} 
</style>

