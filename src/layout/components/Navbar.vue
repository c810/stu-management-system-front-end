<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    <!-- 打赏按钮 -->
<!--    <div class="exceptional" @click="exceptional">打赏</div>-->
    <!-- 教师消息通知 -->
    <el-badge v-if="addModel.userType === '1'" :value="unreadMessage" :max="10" class="message-box"
              @click="goToEvaluate(unreadMessage)"
    >
      <i @click="goToEvaluate(unreadMessage)" class="el-icon-message-solid"></i>
    </el-badge>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span v-if="addModel.userType === '2'" class="welcomeUser">{{ userName }}</span>
          <span v-else-if="addModel.userType === '1'" class="welcomeUser">{{ userTeacherName }}</span>
          <span v-else-if="addModel.userType === '0'" class="welcomeUser">{{ userStuName }}</span>
          <i style="color: white" class="el-icon-caret-bottom"/> <!-- 头像右侧小箭头 -->
        </div>
        <el-dropdown-menu slot="dropdown" :append-to-body="false" class="user-dropdown">
          <!-- <router-link to="/">
              <el-dropdown-item>
                Home
              </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>-->
          <el-dropdown-item @click.native="resetPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <!--          <a target="_blank" href="/stuInfo">
                      <el-dropdown-item>个人信息</el-dropdown-item>
                    </a>-->
          <!--          <el-dropdown-item @click.native="resetInfo">
                      <span style="display:block;">个人信息</span>
                    </el-dropdown-item>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 新增或编辑弹框组件 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-form-item prop="oldPassword" label="原密码">
            <el-input type="password" v-model="addModel.oldPassword"></el-input>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input type="password" v-model="addModel.newPassword"></el-input>
          </el-form-item>
          <el-form-item prop="checkNewPassword" label="验证密码">
            <el-input type="password" v-model="addModel.checkNewPassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 打赏弹框 -->
    <sys-dialog
      :title="Dialog.title"
      :visible="Dialog.visible"
      :width="Dialog.width"
      :height="Dialog.height"
      @onClose="onExceptionalClose"
      @onConfirm="onExceptionalConfirm"
    >
      <div slot="content">
        <div class="wx"></div>
        <div class="zfb"></div>
      </div>
    </sys-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SysDialog from '@/components/Dialog/SysDialog'
import { getUserId, getUserType } from '@/utils/auth'
import { updatePasswordApi, getUserByIdApi } from '@/api/user'
import { getByIdApi } from '@/api/student'
import { getTeacherByIdApi } from '@/api/teacher'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SysDialog
  },
  data() {
    return {
      tableList: [],
      searchModel: {
        teacherId: getUserId(),
        currentPage: 1,
        pageSize: 10
        // total: 0
      },
      unreadMessage: 0,
      // 表单验证规则
      rules: {
        oldPassword: [{
          trigger: 'blur',
          required: true,
          message: '请输入原密码'
        }],
        newPassword: [{
          trigger: 'blur',
          required: true,
          message: '请输入新密码'
        }],
        checkNewPassword: [{
          trigger: 'blur',
          required: true,
          message: '请再次输入新密码'
        }]
      },
      addModel: {
        userId: getUserId(),
        userType: getUserType(),
        oldPassword: '',
        newPassword: '',
        checkNewPassword: ''
      },
      dialog: {
        title: '修改密码',
        visible: false,
        width: 650,
        height: 150
      },
      Dialog: {
        title: '打赏我们',
        visible: false,
        width: 680,
        height: 453
      },
      user: {},
      userName: {},
      userStuName: {},
      userTeacherName: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    const type = getUserType()
    console.log(type)
    if (type === '2') {
      this.getUser()
    } else if (type === '0') {
      this.getStudent()
    } else if (type === '1') {
      this.getTeacher()
    }
  },
  methods: {
    async goToEvaluate(val) {
      console.log('click')
      if (!val) {
        this.$message.info('暂无新消息!')
      } else {
        this.$router.push({
          name: 'myEvaluate',
          query: {
            unreadMessage: val
          }
        })
        this.unreadMessage = 0
      }
    },
    onExceptionalClose() {
      this.Dialog.visible = false
    },
    onExceptionalConfirm() {
      this.Dialog.visible = false
    },
    // 打赏
    exceptional() {
      this.Dialog.visible = true
    },
    // 获取学生
    async getStudent() {
      const res = await getByIdApi({ stuId: this.addModel.userId })
      if (res && res.code === 200) {
        this.userStuName = res.data.stuName
      }
    },
    // 获取教师
    async getTeacher() {
      const res = await getTeacherByIdApi({ teacherId: this.addModel.userId })
      if (res && res.code === 200) {
        this.getOneTeacher = res.data
        this.unreadMessage = res.data.unreadMessage
        this.userTeacherName = res.data.teacherName
      }
    },
    // 获取管理员用户
    async getUser() {
      const res = await getUserByIdApi({ userId: this.addModel.userId })
      if (res && res.code === 200) {
        this.userName = res.data.username
      }
    },
    // 弹框确定
    async onConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (this.addModel.newPassword === this.addModel.checkNewPassword) {
            const res = await updatePasswordApi(this.addModel)
            if (res && res.code === 200) {
              this.$message.success(res.msg)
              this.dialog.visible = false
            }
            this.dialog.visible = false
          } else {
            this.$message.warning('新密码与验证密码不同!')
          }
        }
      })
    },
    // 弹框关闭
    onClose() {
      this.dialog.visible = false
    },
    // 修改密码
    resetPassword() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.addModel.userId = getUserId()
      this.addModel.userType = getUserType()
      this.dialog.visible = true
    },
    /* resetInfo() {
      this.dialog.visible = true
    }, */
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
/* 消息通知 */
.message-box {
  position: absolute;
  right: 150px;
  top: 15px;
  cursor: pointer;
}

.el-icon-message-solid {
  color: white;
  font-size: 25px;
}

/* 打赏 */
.exceptional {
  position: fixed;
  right: 40px;
  bottom: 35px;
  width: 55px;
  height: 55px;
  background-color: #9b0d14;
  border-radius: 100%;
  text-align: center;
  line-height: 55px;
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
}

.wx {
  display: inline-block;
  width: 331px;
  height: 450px;
  margin-right: 20px;
  //border: 1px solid #9b0d14;
  background: url(../../../public/wx.jpg) no-repeat;
  background-size: cover;
}

.zfb {
  display: inline-block;
  width: 300px;
  height: 450px;
  //border: 1px solid #9b0d14;
  background: url(../../../public/zfb.jpg) no-repeat;
  background-size: cover;
}

.wx-text {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-top: -10px;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #9b0d14; // 顶部导航栏颜色
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .welcomeUser {
          position: relative;
          cursor: pointer;
          top: -15px;
          right: -4px;
          display: inline-block;
          height: 30px;
          margin-top: -20px;
          line-height: 30px;
          color: white;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 14px;
          font-size: 12px;
        }
      }

      .user-dropdown {
        z-index: 3005 !important;
        width: 100px;
        position: fixed !important;
        top: 45px !important;
        //right: 1444px !important;

        .el-dropdown-menu__item:hover {
          color: #9b0d14;
          background-color: rgba(234, 207, 208, 0.56);
        }
      }

    }
  }
}
</style>
