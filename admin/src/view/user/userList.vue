<template>
  <div class="content-wrap">
      <section class='search'>
        <el-button size="mini" @click="toggleSelection()">批量删除</el-button>
        <div>
          <el-input size="mini" placeholder="搜索用户名称和手机号码" v-model="searchInput">
            <el-button slot="append" @click="handleSearch()" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </section>

      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" highlight-current-row header-align="center" v-loading="loading" @selection-change="handleSelectionChange">
        <table-item :columns="columns" @handleDelete="handleDelete" @handleEdit="handleEdit"></table-item>
      </el-table>

    <!-- 分页 S -->
    <pageing :totalCount="totalCount" @handleSizeChange="handleSizeChange" :currentPage="currentPage" @handleCurrentChange="handleCurrentChange"></pageing>
    <!-- 分页 E -->

    <!-- 编辑 S -->
    <el-dialog title="修改用户信息" :modal="false" :visible.sync="centerDialogVisible" @close="handelCloseDialog" width="50%" center>

      <div class="block dialog-wrepper">

        <el-form ref="userInfo" :model="userInfo" status-icon :rules="validateUserInfo" label-width="80px">
          <!-- np -->
          <el-form-item label="会员姓名" prop="nickname">
            <el-input v-model="userInfo.nickname" maxlength="16" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="contact_phone">
            <el-input v-model="userInfo.contact_phone" maxlength="11" type="number"></el-input>
          </el-form-item>

          <el-form-item label="会员性别" prop="sex_id">
            <el-radio v-model="userInfo.sex_id" label="男">男</el-radio>
            <el-radio v-model="userInfo.sex_id" label="女">女</el-radio>
          </el-form-item>

          <el-form-item label="会员状态" prop="status">
            <el-radio v-model="userInfo.status" label="启用">启用</el-radio>
            <el-radio v-model="userInfo.status" label="禁用">禁用</el-radio>
          </el-form-item>

          <el-form-item label="会员头像">
            <el-upload class="avatar-uploader" :action="`${baseURL}/api/upload?flag=picture`" 
              :show-file-list="false" 
              :on-success="handleAvatarSuccess" 
              :before-upload="beforeAvatarUpload">
              <img v-if="userInfo.url" :src="userInfo.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

        </el-form>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleEditUserInfo('userInfo')">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 编辑 E -->
  </div>
</template>

<script>
import { getUserAll, editUserInfo, deleteUserInfoAll } from "@/api/user";
import { validateNnickname, validatePhone } from "@/lib/util";
import pageing from "@/components/pageing";
import tableItem from "@/components/tableItem";
import { baseURL } from '@/config'
export default {
  name: "memberList",
  components: {
    pageing,
    tableItem
  },
  props: {
    food: {
      type: String,
      default: "apple"
    }
  },
  // 页面还没有渲染时的方法  这里没有this
  // beforeRouteEnter(to, from, next) {
  // console.log(to.name);
  // next();
  // r如果想用this 可以在next生成一个实例
  // next(vm =>{
  //   console.log(vm)
  // })
  // },
  // 离开页调用方法
  // beforeRouteLeave(to, from, next) {
  // next();
  // const leave = confirm("您确定要离开吗？");
  // if (leave) next();
  // else next(false);
  // },
  data() {
    // let validateUserName = (rule, value, callback) => {
    //   if (!validateNnickname.test(value)) {
    //     callback(new Error('数字+字母最少6位。'));
    //   } else {
    //     callback()
    //   }
    // };
    let validateContactPhone = (rule, value, callback) => {
      if (!validatePhone.test(value)) {
        callback(new Error('手机号码有误。'));
      } else {
        callback()
      }
    };
    return {
      // 表头数据 这里的key对应要显示的字段名称   切记
      columns: [
        {
          key: "operating",
          label: "操作",
          width: "200"
        },
        {
          key: "checked",
          width: "50"
        },
        {
          key: "id",
          label: "id",
          width: "80"
        },
        {
          key: "nickname",
          label: "姓名",
          width: "100"
        },
        {
          key: "sex_id",
          label: "性别",
          width: "100"
        },
        {
          key: "contact_phone",
          label: "手机号码",
          width: "150"
        },
        {
          key: "city",
          label: "城市",
          width: "150"
        },
        {
          key: "status",
          label: "状态",
          width: "100"
        },
        {
          key: "create_time",
          label: "注册时间",
          width: "200"
        },
        {
          key: "update_time",
          label: "更新时间"
        }
      ],
      baseURL: baseURL,
      searchInput: '',
      // 表格总数据
      tableData: [],
      multipleSelection: [], //记录表格选中的值
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      currentPage: 1,
      PageSize: 10,
      loading: true, //添加loading
      centerDialogVisible: false,
      userInfo: "",//初始化单条用户信息
      uploadImage: '',//上传图片保存的路径
      // 
      validateUserInfo: {
        // nickname: [
        //   { validator: validateUserName, trigger: 'blur' }
        // ],
        contact_phone: [
          { validator: validateContactPhone, trigger: 'blur' }
        ]
      }
    };
  },

  created() {
    this.getUserList();
  },

  methods: {

    // 关闭弹窗清除 上传图片的路径
    handelCloseDialog() {
      this.uploadImage = '';
    },

    // 修改用户信息
    handleEditUserInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return console.log('error submit!!');
        let param = {
          id: this.userInfo.id,
          contact_phone: this.userInfo.contact_phone,
          sex_id: this.userInfo.sex_id == '男' ? 1 : 0,
          status: this.userInfo.status == '启用' ? 1 : 0,
          portrait: this.uploadImage ? this.uploadImage : this.userInfo.thumb_img_url
        }
        editUserInfo(param).then(res => {
          if (!res.data.code) return this.$notify.error({ title: '失败', message: res.data.msg });
          this.$notify({ title: '成功', message: res.data.msg, type: 'success' })
          this.centerDialogVisible = false
          this.getUserList();//列表
        }).catch(e => {
          console.error(e);
          this.$message.error(e);
        })
      });
    },

    // 搜索
    handleSearch() {
      this.getUserList()
    },

    publicDelete(param) {
      deleteUserInfoAll(param).then(res => {
        this.loading = false;
        if (!res.data.code) return this.$notify.error({ title: '失败', message: res.data.msg });
        this.$notify({ title: '成功', message: res.data.msg, type: 'success' });
        this.getUserList();
      }).catch(e => {
        console.error(e)
        this.$message.error(e);
      })
    },

    // 批量删除
    toggleSelection(rows, index) {
      if (!this.multipleSelection.length) return this.$notify({ title: '警告', message: '请选择删除的用户', type: 'warning' });
      this.$confirm('你确定要删除吗。', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true;
        let id = this.multipleSelection.map(item => item.id).join(',');
        let param = { id };
        this.publicDelete(param)
      })
    },

    // 每页显示的条数
    handleSizeChange(val) {
      this.loading = true;
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
      this.getUserList();
    },

    // 显示第几页
    handleCurrentChange(val) {
      this.loading = true;
      // 改变默认的页数
      this.currentPage = val;
      this.getUserList();
    },

    // 获取用户列表
    getUserList() {
      this.loading = true;
      let param = {
        search: this.searchInput.replace(/(^\s*)|(\s*$)/g, ""),
        page_num: this.currentPage,
        page_size: this.PageSize
      };
      getUserAll(param).then(res => {
        if (!res.data.code) return this.$notify.error({ title: '失败', message: res.data.msg });
        this.loading = false;
        this.tableData = res.data.data;
        this.tableData.forEach(item => {
          item.sex_id = item.sex_id == 1 ? "男" : "女"
          item.status = item.status == 1 ? "启用" : "禁用"
        })
        this.totalCount = res.data.total;
      }).catch(e => {
        console.error(e);
        this.$notify.error({ title: '失败', message: e })
      });
    },

    // 表格自定义排序
    formatter(row, column) {
      console.log(row.address);
    },

    // 编辑表格
    handleEdit(row) {
      this.centerDialogVisible = !this.centerDialogVisible;
      this.userInfo = { ...row };
    },

    // 删除表格
    handleDelete(index, row) {
      this.$confirm('你确定要删除吗。', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true;
        let param = { id: row.id };
        this.publicDelete(param)
      }).catch(()=>{
        console.log('取消删除')
      })
    },

    //选中的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //图片上传
    handleAvatarSuccess(res, file) {
      if(!res.code) return this.$notify.error({ title: '失败', message: res.msg });
      this.$notify({ title: '成功', message: res.msg, type: 'success' });
      this.uploadImage = res.data;
      this.userInfo.url = URL.createObjectURL(file.raw);
    },

    // 
    beforeAvatarUpload(file) {
      const isJPG = (file.type == 'image/jpeg' || file.type == 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是JPG和PNG格式');
        return isJPG
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过5MB');
        return isLt2M
      }
      return isJPG, isLt2M;
    },

  }
};
</script>

<style lang="scss" scoped>

.el-pagination{
  padding:20px 5px 0
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.content-wrap{
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;

  .search{
      border-radius: 5px 5px 0;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background: white;
      // margin: 10px 0 0;
  }
}

</style>
