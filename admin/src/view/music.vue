<template>
  <div class="music-container" v-loading="loading" style="min-height: 300px">
    <el-row :gutter="20">
      <el-col :span="6" class="music-wrap" style="cursor: auto">
        <div class="item">
          <i class="el-icon-headset"></i>
          已添加
          <span class="color-blue">{{ totalCount }}</span> 首音乐
        </div>
      </el-col>
      <el-col :span="6" class="music-wrap">
        <div class="item" @click="isDialog = true">
          <i class="el-icon-document-add"></i>
          添加音乐
        </div>
      </el-col>
    </el-row>
    <!--  -->
    <el-row :gutter="20" class="music-list">
      <el-col :span="6" v-for="(item, index) in musicList" :key="item.id">
        <div class="music-item" :style="{backgroundImage:`url('${item.bg_path}`}">
          <div class="tools-layer">
          <span>
            <i class="el-icon-bell">{{item.like}}</i>
          </span>
          <span>
            <i class="el-icon-setting" @click="handleMuiscEdit(index)"></i>
            <i class="el-icon-delete" @click="handleDelete(item.id)"></i>
          </span>
          </div>
          <div class="item-title">{{item.song_name}} - {{item.singer}}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <pageing :totalCount="totalCount" @handleSizeChange="handleSizeChange" :currentPage="currentPage" @handleCurrentChange="handleCurrentChange"></pageing>

      <!-- 编辑 S -->
    <el-dialog title="添加音乐" :visible.sync="isDialog" @close="handelCloseDialog" width="45%">

      <div class="block dialog-wrepper">
        <el-form ref="musicDetaill" :model="musicDetaill" :rules="rulesMusic">

          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="音乐名称" prop="song_name" label-width="6em">
                <el-input v-model="musicDetaill.song_name" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片来源" prop="source" label-width="6em">
                <el-input v-model="musicDetaill.source" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row> 

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="作者名称" prop="singer" label-width="6em">
                <el-input v-model="musicDetaill.singer" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上传音乐" prop="song_url" label-width="6em">
                <el-upload class="upload-demo" action="http://127.0.0.1:3006/api/upload?flag=mp3"
                  :limit="1"
                  :file-list="musicFileList"
                  :on-success="handleMusicSuccess" 
                  :before-remove="handleMusicDelete"
                  :before-upload="beforeMusicUpload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传MP3,且不超过20M</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上传图片" prop="bg_url" label-width="6em">
                <el-upload class="upload-demo" action="http://127.0.0.1:3006/api/upload?flag=picture" 
                  :limit="1"
                  :file-list="bgFileList"
                  :on-success="handleAvatarSuccess" 
                  :before-remove="handleAvatarDelete"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过5M</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="音乐描述" label-width="6em">
            <el-input type="textarea" v-model="musicDetaill.describe" autosize></el-input>
          </el-form-item>
            
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isDialog=false">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleSubmitMusic('musicDetaill')">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import pageing from "@/components/pageing"
import { getMusicList, deleteMusic, addMusic, editMusic } from "@/api/blog"
export default {
  components: {
    pageing
  },
  data() {
    return {
      totalCount: 1,
      currentPage: 1,
      PageSize: 12,
      musicList: '',
      musicDetaill: {
        song_name: '',
        source: '',
        singer: '',
        song_url: '',
        bg_url: '',
        describe: ''
      },
      loading: false,
      isDialog: false,
      rulesMusic: {
        song_name: [
          { required: true, message: '音乐名称不能为空'}
        ],
        source:[
          { required: true, message: '图片来源不能为空'}
        ],
        singer:[
          { required: true, message: '音乐作者不能为空'}
        ],
        song_url:[
          { required: true, message: '音乐不能为空'}
        ],
        bg_url:[
          { required: true, message: '图片不能为空'}
        ],
      }
    };
  },

  computed: {
    bgFileList() {
      let { bg_url } = this.musicDetaill
      if (bg_url) {
        let name = bg_url.split('/')
        return [{ name: name[name.length - 1], url: bg_url }]
      } else {
        return []
      }
    },

    musicFileList() {
      let { song_url } = this.musicDetaill
      if (song_url) {
        let name = song_url.split('/')
        return [{ name: name[name.length - 1], url: song_url }]
      } else {
        return []
      }
    }
  },

  created(){
    this.handleMuiscList()
  },

  methods:{
    async handleMuiscList(){
      let param = { 
        page_num: this.currentPage,
        page_size: this.PageSize
      }
      let result = await getMusicList(param)
      this.loading = false
      if(!result.data.code) return 
      this.musicList = result.data.data
      this.totalCount = result.data.total
    },

     // 每页显示的条数
    handleSizeChange(val) {
      this.loading = true;
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
      this.handleMuiscList();
    },
    
    // 显示第几页
    handleCurrentChange(val) {
      this.loading = true;
      // 改变默认的页数
      this.currentPage = val;
      this.handleMuiscList();
    },

    // 编辑列表信息
    handleMuiscEdit(index){
      this.isDialog = true
      this.musicDetaill = this.musicList[index]
    },

    // 关闭弹窗
    handelCloseDialog(){
      this.musicDetaill = {};
      this.$refs.musicDetaill.resetFields();
    },

    // 上传的时候
    beforeAvatarUpload(file) {
      const isJPG = (file.type == 'image/jpeg' || file.type == 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$notify.error({ title: '失败', message: '上传头像图片只能是JPG和PNG格式' })
        return isJPG
      }
      if (!isLt2M) {
        this.$notify.error({ title: '失败', message: '上传头像图片大小不能超过5MB' })
        return isLt2M
      }
      return isJPG, isLt2M;
    },

    // 上传的时候
    beforeMusicUpload(file) {
      const isMP3 = (file.type == 'audio/mp3');
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isMP3) {
        this.$notify.error({ title: '失败', message: '音乐格式只能是mp3' })
        return isMP3
      }
      if (!isLt20M) {
        this.$notify.error({ title: '失败', message: '上传mp3大小不能超过20MB' })
        return isLt20M
      }
      return isMP3, isLt20M;
    },

      //图片上传
    handleAvatarSuccess(res, file) {
      if(!res.code) return this.$notify.error({ title: '失败', message: res.msg });
      this.$notify({ title: '成功', message: res.msg, type: 'success' });
      this.musicDetaill.bg_url = res.data
    },

    handleAvatarDelete(){
      this.musicDetaill.bg_url = ''
    },
    
    handleMusicDelete(){
      this.musicDetaill.song_url = ''
    },
    
    // 上传mp3
    handleMusicSuccess(res, file){
      if(!res.code) return this.$notify.error({ title: '失败', message: res.msg });
      this.$notify({ title: '成功', message: res.msg, type: 'success' });
      this.musicDetaill.song_url = res.data
    },

   // 删除表格
    handleDelete(id) {
      this.$confirm('你确定要删除吗。', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(async() => {
        let param = { id };
        let result = await deleteMusic(param)
        if(!result.data.code)return this.$notify.error({title: '失败', message: result.data.msg})
        this.$notify({title: '成功', message: result.data.msg, type:'success'})
        this.handleMuiscList()
      }).catch(e =>{
        console.log(e)
      })
    },

    handleSubmitMusic(musicDetaill){
      this.$refs[musicDetaill].validate(async(valid) => {
        if(!valid) return console.log('error submit!!');
        let result
        if(this.musicDetaill.id){
          result = await editMusic(this.musicDetaill)
        }else{
          result = await addMusic(this.musicDetaill)
        }
        if(!result.data.code)return this.$notify.error({title: '失败', message: result.data.msg})
        this.$notify({title: '成功', message: result.data.msg, type:'success'})
        this.isDialog = false,
        this.handleMuiscList()
      })
    },

  }
};
</script>

<style scoped lang="scss">
.music-container {
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

    .el-icon-headset,
    .el-icon-document-add {
      font-size: 28px;
      padding-right: 15px;
      color: inherit;
      opacity: 0.8;
    }
  }
}

.music-item {
  height: 22.5vh;
  border-radius: 8px;
  border: 1px solid #d7dfe3;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-end;
  .item-title {
    line-height: 40px;
    color: #fff;
    width: 100%;
    padding-left: 10px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }
  .tools-layer {
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-100%);
    transition: all 0.2s;
    justify-content: space-between;
    width: 100%;
    span {
      display: flex;
      align-items: center;
      color: #fff;
      letter-spacing: 2px;
      i{
        font-size: 14px;
      }
    }
    i {
      display: block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
      &:not(.icon-like):hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
  &:hover {
    .tools-layer {
      transform: translateY(0);
    }
  }
}
.music-list {
  // margin: 10px 0;
  .el-col {
    margin: 10px auto;
  }
}
</style>