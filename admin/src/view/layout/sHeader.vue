<template>
  <div class="header-wrapper">

    <div class="header-wrapper_title">
      <i :class="triggerClasses" @click="handCollapse"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.redirect||item.path">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>

    </div>

    <el-dropdown trigger="click">

      <div class="user-info">
        <img :src="userInfo.thumb_img_url" alt="用户头像">
        {{userInfo.nickname}}
      </div>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" @click.native="centerDialogVisible = true">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-close" @click.native="handleLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>

    <!-- :before-close="handleClose"  关闭的回调函数 -->
    <el-dialog title="修改密码" :visible.sync="centerDialogVisible" width="40%" :modal="false" center>
      <!-- status-icon 验证成功小图标 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="原始密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入原始密码" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" placeholder="请输入新密码" autocomplete="off" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" placeholder="请输入新密码" autocomplete="off" show-password clearable></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handlePassword('ruleForm')">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
import { editPassword } from "@/api/user";
import { validatePassword } from "@/lib/util";
export default {
  name: "sHeader",
  watch: {
    $route() {
      this.geBreadcroumb();
    }
  },
  created() {
    this.geBreadcroumb();
  },
  mounted() { },
  computed: {
    triggerClasses() {
      return ["el-icon-setting", this.isCollapse ? "rotate" : ""];
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (!validatePassword.test(value)) {
        callback(new Error('密码格式不正确!'));
      } else {
        callback()
      }
    };
    let validateNewPass = (rule, value, callback) => {
      if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback()
      }
    };

    return {
      levelList: null,
      centerDialogVisible: false, //密码弹窗
      ruleForm: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateNewPass, validateNewPass, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {

    handCollapse() {
      this.$emit("handCollapse", !this.isCollapse);
    },
    
    // 退出登录
    handleLogout() {
      this.publicMethod.removeCookie("userInfo");
      this.publicMethod.removeCookie("token");
      this.$router.push("/login");
    },

    geBreadcroumb() {
      let matched = this.$route.matched.filter(item => item.meta.title);
      this.levelList = matched;
    },

    // 不关闭遮罩
    // handleClose(done) {
    //   this.$confirm('确认关闭。').then(_ => {
    //     done();
    //   }).catch(_ => { });
    // },

    // 修改密码
    handlePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return console.log('error submit!!');
        let param = {
          id: this.userInfo.id,
          password: this.ruleForm.password,
          new_password: this.ruleForm.newPassword
        }
        editPassword(param).then(res => {
          if (!res.data.code) return this.$message.error(res.data.msg);
          this.$message.success(res.data.msg);
          this.publicMethod.removeCookie("token");
          this.$router.push("/login");
        })
      });
    }

  }
};
</script>

<style lang="scss" scoped>
.rotate {
  transform: rotateZ(360deg);
  transition: transform 1s ease;
}

.header-wrapper {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &_title {
    display: flex;
    align-items: center;
    .el-breadcrumb {
      padding-left: 20px;
    }
  }
  .el-dropdown {
    .user-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
    & img {
      border-radius: 50%;
      padding: 0 10px;
      width: 30px;
      height: 30px;
    }
  }
}
</style>

