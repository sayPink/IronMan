<template>
  <div class="login-wrapper">
    <div class="text-box">
      <div class="text-head">
        <img src="@/assets/image/login/icon.png" alt>
      </div>
      <div class="text-body">
        <form action>
          <p>
            <el-input
              type="text"
              :class="{'error-border':accError}"
              v-model="loginAccount"
              placeholder="账号"
              maxlength="30"
              onkeypress="if(event.keyCode==13){document.getElementById('pwd').focus()}"
              clearable
            ></el-input>
            <span class="error-tip" v-show="accError">{{accErrorTip}}</span>
          </p>
          <p>
            <el-input
              type="password"
              v-model="loginPassword"
              id="pwd"
              placeholder="密码"
              maxlength="30"
              @keyup.native="submit('input',$event)"
            ></el-input>
            <span class="error-tip" v-show="pwdError">{{pwdErrorTip}}</span>
          </p>
          <el-button
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            class="login-btn"
            @click="submit('btn',$event)"
            @click="submit"
          >登录</el-button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { login } from "@/api/user";
import { mapState, mapMutations } from "vuex";
import hexMd5 from "@/lib/md5";
export default {
  name: "login",
  data() {
    return {
      loginAccount: "",
      loginPassword: "",
      // 验证账号
      accError: false,
      accErrorTip: "",
      //验证密码
      pwdErrorTip: "",
      pwdError: false,
      stopDbClick: true,
      fullscreenLoading: false
    };
  },

  created() {
    // 第一次进入页面时，修改值
    // this.EDIT_TRANSITION(this.$store.state.isTransition);
  },

  computed: {},

  methods: {
    // ...mapMutations(["EDIT_TRANSITION"]),
    submit(val, event) {
      if ((event.keyCode === 13 && val === 'input' && this.loginPassword !== '') || val === 'btn') {
        if (this.loginAccount === "") {
          this.accErrorTip = "账号不能为空";
          this.pwdError = true;
        }
        if (this.loginPassword === "") {
          this.pwdErrorTip = "密码不能为空";
          this.accError = true;
        }
        if (this.pwdError || this.accError) {
          return false;
        }
        if (this.stopDbClick) {
          this.stopDbClick = false;
          // let param = {
          //   username: "superman",
          //   password: hexMd5.hex_md5(String("123456")).toUpperCase()
          // };
          let param = {
            username: this.loginAccount,
            password: this.loginPassword
          };
          login(param).then(res => {
              this.stopDbClick = true;
              if (!res.data.code) return this.$notify.error({ title: '失败', message: res.data.msg });
              this.publicMethod.setCookie("token", JSON.stringify(res.data.data));
              this.$notify({ title: '成功', message: '登录成功', type: 'success' });
              this.$router.push({ path: "/home" });
            }).catch(error => {
              console.log(error);
              this.stopDbClick = true
              this.$notify.error({ title: '失败', message: '登录失败' });
            });
        }
      }
    }
  }
};
</script>
<style lang="scss">
.login-wrapper {
  width: 100%;
  height: 100vh;
  background: url("../assets/image/login/login-bg.png") no-repeat top center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .text-box {
    width: 400px;
    background: #fff;
    border: 1px solid #dedede;
    text-align: center;
    padding-bottom: 50px;
    .text-head {
      padding: 30px 0;
    }
    p {
      padding: 0 26px;
      margin-top: 30px;
      position: relative;
      .error-tip {
        font-size: 10px;
        position: absolute;
        left: 28px;
        bottom: -19px;
        color: #e3111e;
      }
      .error-border {
        input {
          border: 1px solid #e3111e;
        }
      }
    }
    .login-btn {
      width: 340px;
      height: 46px;
      line-height: 45px;
      margin-top: 47px;
      padding: 0;
    }
  }
}
</style>


