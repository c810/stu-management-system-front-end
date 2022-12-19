<template>
  <el-main class="main-box">
    <div class="left-box">
      <div class="userAvatar">
        <el-avatar :size="100" :src="circleUserAvatar"/>
      </div>
      <div class="userName">
        <p>{{ stuInfoList.stuName }}</p>
      </div>
      <div class="signature">
        <p><b>『&nbsp;</b>{{ stuInfoList.signature }}<b>&nbsp;』</b></p>
      </div>
      <el-divider content-position="center">组织机构</el-divider>
      <el-row class="el-row">
        <i class="el-icon-school"/><span class="font-config">{{ stuInfoList.schoolName }}</span>
      </el-row>
      <el-row class="el-row">
        <i class="el-icon-collection"/>
        <span class="font-config">{{ stuInfoList.collegeName }}</span>
        <el-divider direction="vertical"/>
        <span class="font-config">{{ stuInfoList.majorName }}</span>
        <el-divider direction="vertical"/>
        <span class="font-config">{{ stuInfoList.className }}</span>
      </el-row>
      <el-divider content-position="center">个人标签</el-divider>
      <div>
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput"><i
          style="margin-right: 10px"
          class="el-icon-plus"
        />新增
        </el-button>
        <el-divider content-position="center">个人统计</el-divider>
      </div>
    </div>
    <div class="right-box">
      <el-row>
        <span class="personal-information">个人信息</span>

        <el-button class="editBtn" style="margin-left: 20px" type="primary" size="small" icon="el-icon-edit"
                   @click="editBtn()"
        >编辑
        </el-button>
        <el-button class="editBtn" type="success" size="small" icon="el-icon-edit" @click="downloadBtn()">下载简历
        </el-button>
      </el-row>
      <table class="table">
        <tr>
          <td class="shadow"><i class="el-icon-user"/>学号</td>
          <td>{{ stuInfoList.stuNum }}</td>
          <td class="shadow"><i class="el-icon-phone-outline"/>电话</td>
          <td>{{ stuInfoList.phone }}</td>
          <td class="shadow" v-if="stuInfoList.sex==='0'"><i class="el-icon-male"/>性别</td>
          <td v-if="stuInfoList.sex==='0'">男</td>
          <td class="shadow" v-if="stuInfoList.sex==='1'"><i class="el-icon-female"/>性别</td>
          <td v-if="stuInfoList.sex==='1'">女</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-postcard"/>身份证号</td>
          <td>{{ stuInfoList.idCard }}</td>
          <td class="shadow"><i class="el-icon-message"/>邮箱</td>
          <td>{{ stuInfoList.email }}</td>
          <td class="shadow"><i class="el-icon-star-off"/>民族</td>
          <td>{{ stuInfoList.nation }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-place"/>籍贯</td>
          <td>{{ stuInfoList.nativePlace }}</td>
          <td class="shadow"><i class="el-icon-location-outline"/>通讯地址</td>
          <td colspan="3">{{ stuInfoList.location }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-collection-tag"/>政治面貌</td>
          <td>{{ stuInfoList.politicalFace }}</td>
          <td class="shadow"><i class="el-icon-reading"/>学历</td>
          <td colspan="3">{{ stuInfoList.eduBackground }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-date"/>出生日期</td>
          <td>{{ stuInfoList.birthday }}</td>
          <td class="shadow"><i class="el-icon-orange"/>婚姻状况</td>
          <td colspan="3">{{ stuInfoList.maritalStatus }}</td>
        </tr>
        <tr style="height: 300px">
          <td class="shadow"><i class="el-icon-tickets"/>个人描述</td>
          <td class="self-box" colspan="5">{{ stuInfoList.selfDescribe }}</td>
        </tr>
      </table>
    </div>
    <!-- 新增或编辑弹框组件 -->
    <sys-dialog
      :title="addDialog.title"
      :visible="addDialog.visible"
      :width="addDialog.width"
      :height="addDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
      style="margin-top: -60px;"
    >
      <div slot="content">
        <el-form
          :model="stuInfoList"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="collegeId" label="所属学院">
                <el-select
                  v-model="stuInfoList.collegeId"
                  placeholder="请选择学院"
                  @change="collegeChange"
                >
                  <el-option
                    v-for="item in collegeList"
                    :key="item.collegeId"
                    :label="item.collegeName"
                    :value="item.collegeId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="majorId" label="所属专业">
                <el-select
                  v-model="stuInfoList.majorId"
                  placeholder="请选择专业"
                  @change="majorChange"
                >
                  <el-option
                    v-for="item in majorList"
                    :key="item.majorId"
                    :label="item.majorName"
                    :value="item.majorId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="classId" label="所属班级">
                <el-select
                  v-model="stuInfoList.classId"
                  placeholder="请选择班级"
                >
                  <el-option
                    v-for="item in classList"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" label="角色">
                <el-select
                  v-model="stuInfoList.roleId"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="stuName" label="姓名">
                <el-input v-model="stuInfoList.stuName" placeholder="请输入姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别">
                <el-radio-group v-model="stuInfoList.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="stuInfoList.phone" placeholder="请输入电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="stuInfoList.email" placeholder="请输入邮箱"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="stuNum" label="学号">
                <el-input v-model="stuInfoList.stuNum" placeholder="请输入学号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="idCard" label="身份证号">
                <el-input v-model="stuInfoList.idCard" placeholder="请输入身份证号"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nativePlace" label="籍贯">
                <el-input v-model="stuInfoList.nativePlace" placeholder="请输入籍贯"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="location" label="通讯地址">
                <el-input v-model="stuInfoList.location" placeholder="请输入通讯地址"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="politicalFace" label="政治面貌">
                <el-select v-model="stuInfoList.politicalFace" placeholder="请输入政治面貌">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="eduBackground" label="学历">
                <el-input v-model="stuInfoList.eduBackground" placeholder="请输入学历"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="birthday" label="出生日期">
                <el-date-picker
                  v-model="stuInfoList.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="intoTime" label="入学时间">
                <el-date-picker
                  v-model="stuInfoList.intoTime"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="请选择入学时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nation" label="民族">
                <el-input v-model="stuInfoList.nation" placeholder="请输入民族"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="maritalStatus" label="婚姻状况">
                <el-radio-group v-model="stuInfoList.maritalStatus">
                  <el-radio :label="'0'">未婚</el-radio>
                  <el-radio :label="'1'">已婚</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="signature" label="个性签名">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入个性签名"
                v-model="stuInfoList.signature"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="maritalStatus" label="个人描述">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入个人描述"
                v-model="stuInfoList.selfDescribe"
              >
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { getUserId } from '@/utils/auth'
import { editApi, getByIdApi, getClassListApi, getRoleByIdApi, getRoleListApi } from '@/api/student'
import { getMajorListApi, getClassNameByIdApi } from '@/api/classes'
import { getCollegeApi, getMajorNameByIdApi } from '@/api/major'
import { getCollegeNameByIdApi } from '@/api/college'
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      options: [{
        value: '0',
        label: '党员'
      }, {
        value: '1',
        label: '团员'
      }, {
        value: '2',
        label: '群众'
      }],
      // 角色数据
      roleList: [],
      // 班级数据
      classList: [],
      // 专业数据
      majorList: [],
      // 学院数据
      collegeList: [],
      // 表单验证规则
      rules: {
        roleId: [{
          trigger: 'blur',
          required: true,
          message: '请选择角色'
        }],
        collegeId: [{
          trigger: 'blur',
          required: true,
          message: '请选择学院'
        }],
        majorId: [{
          trigger: 'blur',
          required: true,
          message: '请选择专业'
        }],
        classId: [{
          trigger: 'blur',
          required: true,
          message: '请选择班级'
        }],
        stuName: [{
          trigger: 'blur',
          required: true,
          message: '请输入姓名'
        }],
        sex: [{
          trigger: 'blur',
          required: true,
          message: '请选择性别'
        }],
        phone: [{
          trigger: 'blur',
          required: true,
          message: '请输入电话'
        }],
        intoTime: [{
          trigger: 'blur',
          required: true,
          message: '请选择入学年份'
        }],
        stuNum: [{
          trigger: 'blur',
          required: true,
          message: '请输入学号'
        }],
        email: [{
          trigger: 'blur',
          required: true,
          message: '请输入邮箱'
        }],
        idCard: [{
          trigger: 'blur',
          required: true,
          message: '请输入身份证号'
        }],
        nativePlace: [{
          trigger: 'blur',
          required: true,
          message: '请输入籍贯'
        }],
        location: [{
          trigger: 'blur',
          required: true,
          message: '请输入通讯地址'
        }],
        politicalFace: [{
          trigger: 'blur',
          required: true,
          message: '请选择政治面貌'
        }],
        eduBackground: [{
          trigger: 'blur',
          required: true,
          message: '请输入学历'
        }],
        birthday: [{
          trigger: 'blur',
          required: true,
          message: '请选择出生日期'
        }],
        maritalStatus: [{
          trigger: 'blur',
          required: true,
          message: '请选择婚姻状况'
        }],
        nation: [{
          trigger: 'blur',
          required: true,
          message: '请填写民族'
        }]
      },
      // 弹框属性
      addDialog: {
        title: '',
        visible: false,
        width: 1300,
        height: 700
      },
      // 个人动态标签
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      // 头像地址
      circleUserAvatar: 'http://rl4wu1zfh.hb-bkt.clouddn.com/logo.png',
      // 表单信息
      stuInfoList: {
        stuId: getUserId(),
        stuName: '暂无数据',
        signature: '个性签名个性签名个性签名个性签名个性签名',
        roleId: '',

        schoolName: '山东大学',
        collegeName: '软件学院',
        // collegeId: '',
        majorName: '软件工程专业',
        // majorId: '',
        className: '软件4班',
        // classId: '',
        stuNum: '暂无数据',

        hobby: '暂无数据',
        intoTime: '',
        sex: '暂无数据',
        phone: '暂无数据',

        email: '暂无数据',
        politicalFace: '暂无数据',
        nativePlace: '暂无数据',
        location: '暂无数据',
        birthday: '暂无数据',
        nation: '暂无数据',

        eduBackground: '暂无数据',
        idCard: '暂无数据',
        maritalStatus: '暂无数据',
        selfDescribe: '暂无数据'

      }
    }
  },
  created() {
    this.getStu()
    this.getRoleList()
  },
  methods: {
    downloadBtn() {
      this.$router.push({
        name: 'stuInfoPdf',
        query: {
          stuId: getUserId()
        }
      })
    },
    // 获取班级名称
    async getClassName(classId) {
      const res = await getClassNameByIdApi({ classId: classId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList.className = res.data.className
      }
    },
    // 获取专业名称
    async getMajorName(majorId) {
      const res = await getMajorNameByIdApi({ majorId: majorId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList.majorName = res.data.majorName
      }
    },
    // 获取学院名称
    async getCollegeName(collegeId) {
      const res = await getCollegeNameByIdApi({ collegeId: collegeId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList.collegeName = res.data.collegeName
      }
    },
    // 获取角色id
    async getRoleId(stuId) {
      const res = await getRoleByIdApi({ stuId: stuId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList.roleId = res.data.roleId
      }
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
    },
    // 专业选择事件
    majorChange(val) {
      this.stuInfoList.classId = ''
      this.getClassList(val)
    },
    // 根据专业id获取班级列表
    async getClassList(majorId) {
      const res = await getClassListApi({ majorId: majorId })
      if (res && res.code === 200) {
        this.classList = res.data
      }
    },
    // 学院选择事件
    collegeChange(val) {
      this.stuInfoList.majorId = ''
      this.stuInfoList.classId = ''
      this.getMajorList(val)
    },
    // 根据学院id获取专业列表
    async getMajorList(collegeId) {
      const res = await getMajorListApi({ collegeId: collegeId })
      if (res && res.code === 200) {
        this.majorList = res.data
      }
    },
    // 学院列表
    async getCollegeList() {
      const res = await getCollegeApi()
      if (res && res.code === 200) {
        this.collegeList = res.data
      }
    },
    // 弹框关闭
    onClose() {
      this.getStu()
      this.addDialog.visible = false
    },
    // 弹框确定
    onConfirm() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          const res = await editApi(this.stuInfoList)
          if (res && res.code === 200) {
            // 提示信息
            this.$message.success(res.msg)
            // 刷新列表
            this.getStu()
            this.addDialog.visible = false
          }
        }
      })
    },
    // 编辑按钮
    async editBtn() {
      // 清空表单
      this.$resetForm('addForm', this.stuInfoList)
      // 加载学院列表
      this.getCollegeList()
      // 根据id查询回显的数据
      const res = await getByIdApi({ stuId: getUserId() })
      if (res && res.code === 200) {
        this.$objCopy(res.data, this.stuInfoList)
        this.getMajorList(this.stuInfoList.collegeId)
        this.getClassList(this.stuInfoList.majorId)
        this.getRoleId(this.stuInfoList.stuId)
      }
      console.log(this.stuInfoList)
      // this.getStu()
      // 设置弹框属性
      this.addDialog.title = '编辑个人信息'
      this.addDialog.visible = true
      // 防止在浏览器中获取到密码
      this.stuInfoList.password = ''
    },
    // 获取学生
    async getStu() {
      const res = await getByIdApi({ stuId: this.stuInfoList.stuId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList = res.data
        this.stuInfoList.schoolName = '山东大学'
        this.getCollegeName(res.data.collegeId)
        this.getMajorName(res.data.majorId)
        this.getClassName(res.data.classId)
        this.getRoleId(this.stuInfoList.stuId)
        for (var i in this.stuInfoList) {
          if (this.stuInfoList[i] === null || this.stuInfoList[i] === '') {
            this.stuInfoList[i] = '暂无数据'
          }
        }
        if (this.stuInfoList.politicalFace === '0') {
          this.stuInfoList.politicalFace = '党员'
        } else if (this.stuInfoList.politicalFace === '1') {
          this.stuInfoList.politicalFace = '团员'
        } else if (this.stuInfoList.politicalFace === '2') {
          this.stuInfoList.politicalFace = '群众'
        } else {
          this.stuInfoList.politicalFace = '暂无数据'
        }
        if (this.stuInfoList.maritalStatus === '0') {
          this.stuInfoList.maritalStatus = '未婚'
        } else if (this.stuInfoList.maritalStatus === '1') {
          this.stuInfoList.maritalStatus = '已婚'
        } else {
          this.stuInfoList.maritalStatus = '暂无数据'
        }
        this.stuInfoList.birthday = this.stuInfoList.birthday.substring(0, 10)
      }
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }

  }
}
</script>

<style scoped>
/* el-main盒子 */
/*.main-box {
  border: 1px solid #00c0ef;
}*/

/* 左侧信息总体 */
.left-box {
  float: left;
  width: 30%;
  height: 840px;
  padding: 0 40px;
  background: rgb(255, 255, 255, .8);
  border-radius: 25px;
  box-shadow: 5px 5px 25px #c7c7c7;
  overflow: hidden;
}

/* 右侧信息总体 */
.right-box {
  float: left;
  width: 68%;
  height: 840px;
  margin-left: 20px;
  background: rgb(255, 255, 255, .8);
  border-radius: 25px;
  box-shadow: 5px 5px 25px #c7c7c7;
  overflow: hidden;
  padding: 35px 35px 0 35px;
}

/* 头像 */
.userAvatar,
.userName,
.signature {
  display: flex;
  justify-content: center;
  align-items: center;
}

.userAvatar {
  margin-top: 28px;
}

.userName {
  margin-top: 20px;
  font-weight: 700;
  font-size: 20px;
  height: 30px;
}

.signature {
  color: #b2b2b2;
  line-height: 20px;
  font-size: 14px;
}

.el-row {
  margin-bottom: 10px;
}

.el-icon-school,
.el-icon-collection {
  margin-right: 10px;
  font-weight: 700;
  color: #a6a5a5;
}

.font-config {
  font-size: 14px;
  font-family: 宋体;
  font-weight: 700;
}

/* 个人标签 */
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.table {
  width: 100%;
  border: 1px solid #ebeef5;
  border-collapse: collapse;
  text-align: center;
  color: #909399;
  font-family: "微软雅黑 Light";
  font-size: 15px;
  font-weight: 700;
}

.table i {
  margin-right: 7px;
}

.table tr {
  height: 50px;
  border: 1px solid #ebeef5;
}

.table td {
  border: 1px solid #ebeef5;
}

.shadow {
  text-align: left;
  padding-left: 20px;
  background-color: #fafafa;
  width: 130px;
}

.self-box {
  text-align: left;
  padding: 0 40px;
  line-height: 28px;
  text-indent: 2em;
}

/* 个人信息 */
.personal-information {
  font-weight: 700;
  height: 24px;
  font-size: 24px;
  margin-left: 10px;
}

.editBtn {
  float: right;
}
</style>
