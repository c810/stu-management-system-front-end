<template>
  <div class="login-container">
    <div class="logo">
      <a class="sdu-logo" href="javascript:"></a>
      <span class="line"></span>
      <span class="title">教学信息管理系统</span>
    </div>
    <el-form ref="loginForm" class="login-form" :model="addModel" :rules="rules" size="normal">
      <el-form-item>
        <span class="login-title">教学信息管理系统</span>
      </el-form-item>
      <el-form-item class="my-el-form-item" prop="username">
        <span class="svg-container">
          <i class="el-icon-user"/>
        </span>
        <span class="input-deep">
          <el-input v-model="addModel.username" placeholder="请输入账户"/>
        </span>
      </el-form-item>
      <el-form-item class="my-el-form-item" prop="password">
        <span class="svg-container">
          <i class="el-icon-key"/>
        </span>
        <span class="input-deep">
          <el-input type="password" v-model="addModel.password" placeholder="请输入密码" />
        </span>
      </el-form-item>
      <el-form-item prop="userType">
        <!-- <el-radio-group v-model="addModel.userType"> -->
        <!--   <el-radio :label="0">学生</el-radio> -->
        <!--   <el-radio :label="1">教师</el-radio> -->
        <!--   <el-radio :label="2">管理员</el-radio> -->
        <!-- </el-radio-group> -->
        <el-radio-group v-model="addModel.userType">
          <el-radio-button label="0">学生</el-radio-button>
          <el-radio-button label="1">教师</el-radio-button>
          <el-radio-button label="2">管理员</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="24">
          <el-col :span="12" :offset="0">
            <!-- 待完成 -->
            <el-checkbox v-model="checked">十天内免登录</el-checkbox>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-link :underline="false">忘记密码?</el-link>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button class="myBtn" type="primary" @click="onSubmit">登录</el-button>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button class="myBtn">注册</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import '@/styles/style/theme/index.css'
export default {
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
      }
    }
  },
  methods: {
    // 登录提交
    onSubmit() {
      // 表单验证
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 调用 store模块 -> user模块 -> login()方法
          this.$store.dispatch('user/login', this.addModel).then(() => {
            // 登录成功,返回数据,不会立即进入首页,需要做权限验证
            // 权限验证通过,才会进入首页
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<!--<style lang="scss">
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #fff;
$light_gray: #fff;
$light_black: #000000;
$cursor: #000000;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 9px 10px 12px 15px;
      color: $light_black; // 输入框字体颜色
       //&#45;&#45;el-input-placeholder-color: #424242;
      height: 47px;
      caret-color: $cursor; // 插入光标的颜色

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .my-el-form-item {
    padding: 0 0 0 16px;
    border: 2px solid rgba(103, 76, 76, 0.1); // 输入框边框线条
    background: rgba(0, 0, 0, 0.07);
    border-radius: 5px;
    color: #111111;
  }
  .my-el-form-item:hover {
     border: 2px solid #9b0d14;
   }
}
</style>-->

<style scoped>
/*@import '../../styles/style/theme/index.css';*/
/*/deep/:root {
  --el-color-primary: #9b0d14;
}*/
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
  margin: 45px 0 0 0px;
}

.logo .title {
  float: left;
  font-size: 28px;
  color: #fff;
  margin-top: 50px;
}

/* 登录表单总样式 */
.login-form {
  position: relative;
  right: 160px;
  top: 240px;
  height: 450px;
  width: 600px;
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

/* 输入框整体 */
.my-el-form-item {
  padding: 0 14px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, .2);
  border-radius: 5px;
}

.my-el-form-item:hover {
  border: 2px solid #9b0d14;

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
  /*border: 1px solid #00ff00;*/
  display: inline-block;
  width: 5%;
  font-weight: 700;
  color: #363232FF;
}

/*!*用户类型选择器*!
/deep/.el-radio-group {
 margin-bottom: 22px;
!*border: 1px solid rgba(103, 76, 76, 0.1);  输入框边框线条*!
!*background: rgba(0, 255, 0, 1);*!
 border-radius: 5px;
 color: #111111;
}
/deep/.el-radio-button {
  !*border: 1px solid rgb(232, 2, 2);  !*输入框边框线条*!*!
  color: rgba(0, 0, 0, 0.1);
}
!*.my-el-radio-button {*!
!*  border: 1px solid rgb(232, 2, 2);  !*输入框边框线条*!*!
!*  background-color: #9b0d14;*!
!*  color: rgba(0, 0, 0, 0.1);*!
!*}*!*/

/* 表单按钮 */
.myBtn {
  width: 100%;
}
</style>
