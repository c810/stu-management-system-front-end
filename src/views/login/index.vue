<template>
  <div class="login-container">
    <div class="logo">
      <a class="sdu-logo" href="javascript:" />
      <span class="line" />
      <span class="title">教学信息管理系统</span>
    </div>
    <div class="main-box">

      <el-form
        ref="loginForm"
        class="login-form"
        :model="addModel"
        :rules="rules"
        size="normal"
        @keyup.enter.native="onSubmit"
      >
        <el-form-item>
          <span class="login-title">教学信息管理系统</span>
        </el-form-item>
        <el-form-item class="userTypeChooseBtn" prop="userType">
          <el-radio-group v-model="addModel.userType" fill="#9b0d14">
            <el-radio-button label="0">学生</el-radio-button>
            <el-radio-button label="1">教师</el-radio-button>
            <el-radio-button label="2">管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="my-el-form-item" prop="username">
          <span class="svg-container">
            <i class="el-icon-user" />
          </span>
          <span class="input-deep">
            <el-input v-model="addModel.username" placeholder="请输入账户" />
          </span>
        </el-form-item>
        <el-form-item class="my-el-form-item" prop="password">
          <span class="svg-container">
            <i class="el-icon-key" />
          </span>
          <span class="input-deep">
            <el-input v-model="addModel.password" type="password" placeholder="请输入密码" />
          </span>
        </el-form-item>
        <el-form-item class="forgetPwdLinkBox">
          <!--        <el-row :gutter="24">
                    <el-col :span="12" :offset="0">
                      &lt;!&ndash; 待完成 &ndash;&gt;
                      <el-checkbox v-model="checked">十天内免登录</el-checkbox>
                    </el-col>
                    <el-col :span="12" :offset="0">
                      <el-link class="forgetPwdLink" :underline="false">忘记密码?</el-link>
                    </el-col>
                  </el-row>-->
          <el-link class="forgetPwdLink" :underline="false" @click="beforeTo">忘记密码?</el-link>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-button class="myBtn loginBtn" type="primary" @click="onSubmit">登录</el-button>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-button class="myBtn registerBtn">注册</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-popover
        class="el-popover-box"
        placement="bottom"
        trigger="click"
        style="opacity: 0.85"
      >
        <template #reference>
          <!--滑动图片弹窗验证-->
          <PuzzleVerification
            v-model="isVerificationShow"
            :puzzle-img-list="puzzleImgList"
            block-type="puzzle"
            :on-success="handleSuccess"
            :on-error="handleError"
          />
        </template>
      </el-popover>
    </div>
    <p class="login-copyright">© 2022 山东大学 版权所有</p>
  </div>
</template>

<script>
import PuzzleVerification from 'vue-puzzle-verification'
import ResetPassword from '@/views/login/ResetPassword'
// import '@/styles/style/theme/index.css'
export default {
  components: {
    PuzzleVerification,
    ResetPassword
  },
  data() {
    return {
      addModel: {
        username: '',
        password: '',
        userType: ''
      },
      // 表单验证规则
      rules: {
        username: [{
          trigger: 'change',
          required: true,
          message: '请输入账户'
        }],
        password: [{
          trigger: 'change',
          required: true,
          message: '请输入密码'
        }],
        userType: [{
          trigger: 'change',
          required: true,
          message: '请选择用户类型'
        }]
      },
      isVerificationShow: false,
      puzzleImgList: [
        require('../../assets/images/verify/1.jpg'),
        require('../../assets/images/verify/2.jpg'),
        require('../../assets/images/verify/3.jpg'),
        require('../../assets/images/verify/4.jpg'),
        require('../../assets/images/verify/5.jpg'),
        require('../../assets/images/verify/6.jpg'),
        require('../../assets/images/verify/7.jpg'),
        require('../../assets/images/verify/8.jpg'),
        require('../../assets/images/verify/9.jpg'),
        require('../../assets/images/verify/10.jpg'),
        require('../../assets/images/verify/11.jpg'),
        require('../../assets/images/verify/12.jpg')
      ],
      isInput: false
    }
  },
  methods: {
    beforeTo() {
      if (this.addModel.username === '') {
        this.$notify({
          title: '跳转失败',
          message: '输入用户名或邮箱再去重置密码吧',
          type: 'error',
          duration: 1500
        })
      } else {
        this.$router.push({
          name: 'ResetPassword',
          query: {
            username: this.addModel.username
          }
        })
      }
    },
    handleSuccess() {
      // 验证通过后关闭图片验证
      this.isVerificationShow = false
      // 信息提示
      // this.$message({ type: 'success', message: '验证成功!' })
      this.login()
    },
    handleError() {
      // 信息提示
      // this.$message({ type: 'error', message: '验证失败!' })
    },
    change() {
      // 如果监听到输入框发生变化，那么采用用户输入的密码
      this.isInput = true
    },
    // 登录提交
    onSubmit() {
      // 表单验证
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.isVerificationShow = true
        }
      })
    },
    login() {
      // 调用 store模块 -> user模块 -> login()方法
      this.$store.dispatch('user/login', this.addModel).then(() => {
        // 登录成功,返回数据,不会立即进入首页,需要做权限验证
        // 权限验证通过,才会进入首页
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
/* 登录界面总体 */
.login-container {
  display: flex;
  height: 100%;
  width: 100%;
  /* 设置背景颜色，背景图加载过程中会显示背景色 */
  /* 让背景图基于容器大小伸缩 */
  /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
  background: #464646 url("../../assets/images/login_bg.jpg") no-repeat fixed center center;
  background-size: cover;
  overflow: hidden;
}

/* 登录界面logo */
.logo {
  float: left;
  margin-left: 50px;
  width: 100%;
  height: 148px;
}

.logo .sdu-logo {
  float: left;
  margin: 0;
  width: 243px;
  height: 148px;
  background: url(/logo-sdu.png) no-repeat 0 0;
  background-size: 100%;
}

.logo .line {
  height: 58px;
  border-left: 1px solid #fff;
  float: left;
  width: 20px;
  margin: 48px 0 0 0px;
}

.logo .title {
  float: left;
  font-size: 28px;
  color: #fff;
  margin-top: 60px;
}

/* 表单大盒子 */
.main-box {
  position: absolute;
  right: 120px;
  top: 280px;
  float: right;
  min-width: 760px;
  height: 420px;
}

/* 人机验证 */
.el-popover-box {
  float: right;
  margin: 90px 0 0 10px;
  top: 500px;
  right: 500px;
  margin-right: 20px;
  /*background-color: rgba(255,255,255,.8);*/
}

/* 登录表单总样式 */
.login-form {
  float: right;
  right: 160px;
  top: 240px;
  height: 410px;
  width: 450px;
  background: rgb(255, 255, 255, .8);
  padding: 40px 35px 0;
  border-radius: 25px;
  /* 阴影 左右 上下 虚实 颜色 */
  box-shadow: 5px 5px 25px #797979;
  overflow: hidden;
}

/* 表单标题 */
.login-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  color: #9b0d14;
}

.userTypeChooseBtn {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 更改角色选择器按钮颜色 */
.userTypeChooseBtn >>> .el-radio-button__inner:hover {
  color: #9b0d14;
}

.userTypeChooseBtn >>> .el-radio-button__orig-radio:checked + .el-radio-button__inner:hover {
  color: #fff;
}

/* 输入框整体 */
.my-el-form-item {
  padding: 0 14px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 5px;
}

.my-el-form-item:hover {
  border: 1px solid #9b0d14;
}

.el-input {
  display: inline-block;
  width: 90%;
}

.input-deep >>> .el-input__inner {
  border: 0; /* 取消输入框边框 */
}

/* 图标 */
.svg-container i {
  display: inline-block;
  width: 5%;
  font-weight: 700;
  color: #363232FF;
}

/* 忘记密码 */
.forgetPwdLinkBox {
  margin: -15px 0 10px 0;
}

.forgetPwdLink {
  margin-left: 250px;
}

.forgetPwdLink:hover {
  color: #9b0d14;
}

/* 表单按钮 */
.myBtn {
  width: 100%;
}

.loginBtn {
  border: 1px solid #B00817FF;
  background-color: #9b0d14;
}

.loginBtn:hover {
  border: 1px solid #9b0d14;
  background-color: #b00817;
}

.registerBtn {
  color: #9b0d14;
  border: 1px solid #B00817FF;
  background-color: #fff;
}

.registerBtn:hover {
  color: #ffffff;
  border: 1px solid #9b0d14;
  background-color: #b00817;
}

.login-copyright {
  color: #eee;
  padding-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

@media screen and (min-height: 550px) {
  .login-copyright {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
}
</style>
