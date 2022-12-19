<template>
  <el-main>
    <div class="left-box">
      <div class="userAvatar">
        <el-avatar :size="100" :src="circleUserAvatar"/>
      </div>
      <div class="userName">
        <p>{{ teacherInfoList.teacherName }}</p>
      </div>
      <div class="signature">
        <p><b>『&nbsp;</b>{{ teacherInfoList.signature }}<b>&nbsp;』</b></p>
      </div>
      <el-divider content-position="center">组织机构</el-divider>
      <el-row class="el-row">
        <i class="el-icon-school"/><span class="font-config">{{ teacherInfoList.schoolName }}</span>
      </el-row>
      <el-row class="el-row">
        <i class="el-icon-collection"/>
        <span class="font-config">{{ teacherInfoList.collegeName }}</span>
        <el-divider direction="vertical"/>
        <span class="font-config">{{ teacherInfoList.position }}</span>
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
      <div id="leiDaTu" class="echart" style="width: 600px;height: 600px;"></div>
    </div>
    <div class="right-box">
      <el-row>
        <span class="personal-information">个人信息</span>

        <el-button class="editBtn" style="margin-left: 20px" type="primary" size="small" icon="el-icon-edit"
                   @click="editBtn()"
        >编辑
        </el-button>
      </el-row>
      <table class="table">
        <tr>
          <td class="shadow"><i class="el-icon-user"/>编号</td>
          <td>{{ teacherInfoList.teacherNum }}</td>
          <td class="shadow"><i class="el-icon-phone-outline"/>电话</td>
          <td>{{ teacherInfoList.phone }}</td>
          <td class="shadow" v-if="teacherInfoList.sex==='0'"><i class="el-icon-male"/>性别</td>
          <td v-if="teacherInfoList.sex==='0'">男</td>
          <td class="shadow" v-if="teacherInfoList.sex==='1'"><i class="el-icon-female"/>性别</td>
          <td v-if="teacherInfoList.sex==='1'">女</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-postcard"/>身份证号</td>
          <td>{{ teacherInfoList.idCard }}</td>
          <td class="shadow"><i class="el-icon-message"/>邮箱</td>
          <td>{{ teacherInfoList.email }}</td>
          <td class="shadow"><i class="el-icon-star-off"/>民族</td>
          <td>{{ teacherInfoList.nation }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-place"/>籍贯</td>
          <td>{{ teacherInfoList.nativePlace }}</td>
          <td class="shadow"><i class="el-icon-location-outline"/>通讯地址</td>
          <td colspan="3">{{ teacherInfoList.location }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-collection-tag"/>政治面貌</td>
          <td>{{ teacherInfoList.politicalFace }}</td>
          <td class="shadow"><i class="el-icon-reading"/>学历</td>
          <td colspan="3">{{ teacherInfoList.eduBackground }}</td>
        </tr>
        <tr>
          <td class="shadow"><i class="el-icon-date"/>出生日期</td>
          <td>{{ teacherInfoList.birthday }}</td>
          <td class="shadow"><i class="el-icon-orange"/>婚姻状况</td>
          <td colspan="3">{{ teacherInfoList.maritalStatus }}</td>
        </tr>
        <tr style="height: 300px">
          <td class="shadow"><i class="el-icon-tickets"/>个人描述</td>
          <td class="self-box" colspan="5">{{ teacherInfoList.selfDescribe }}</td>
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
          :model="teacherInfoList"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="collegeId" label="所属学院">
                <el-input v-model="teacherInfoList.collegeName" placeholder="请输入专业名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="position" label="职位">
                <el-input v-model="teacherInfoList.position" placeholder="请输入职位"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--            <el-col :span="12" :offset="0">
                          <el-form-item prop="classId" label="所属班级">

                          </el-form-item>
                        </el-col>-->
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" label="角色">
                <el-select
                  v-model="teacherInfoList.roleId"
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
              <el-form-item prop="teacherName" label="姓名">
                <el-input v-model="teacherInfoList.teacherName" placeholder="请输入姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别">
                <el-radio-group v-model="teacherInfoList.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="teacherInfoList.phone" placeholder="请输入电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="teacherInfoList.email" placeholder="请输入邮箱"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="teacherNum" label="编号">
                <el-input v-model="teacherInfoList.teacherNum" placeholder="请输入编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="idCard" label="身份证号">
                <el-input v-model="teacherInfoList.idCard" placeholder="请输入身份证号"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nativePlace" label="籍贯">
                <el-input v-model="teacherInfoList.nativePlace" placeholder="请输入籍贯"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="location" label="通讯地址">
                <el-input v-model="teacherInfoList.location" placeholder="请输入通讯地址"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="politicalFace" label="政治面貌">
                <el-select v-model="teacherInfoList.politicalFace" placeholder="请输入政治面貌">
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
                <el-input v-model="teacherInfoList.eduBackground" placeholder="请输入学历"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="birthday" label="出生日期">
                <el-date-picker
                  v-model="teacherInfoList.birthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="intoTime" label="入职时间">
                <el-date-picker
                  v-model="teacherInfoList.intoTime"
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
                <el-input v-model="teacherInfoList.nation" placeholder="请输入民族"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="maritalStatus" label="婚姻状况">
                <el-radio-group v-model="teacherInfoList.maritalStatus">
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
                v-model="teacherInfoList.signature"
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
                v-model="teacherInfoList.selfDescribe"
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
import { getUserId } from '@/utils/auth'
import SysDialog from '@/components/Dialog/SysDialog'
import { getRoleByIdApi, getTeacherByIdApi, getRoleApi, editApi } from '@/api/teacher'
import { getEvaluateAverageScoreListApi } from '@/api/evaluate'

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
      // 表单验证规则
      rules: {
        roleId: [{
          trigger: 'blur',
          required: true,
          message: '请选择角色'
        }],
        collegeName: [{
          trigger: 'blur',
          required: true,
          message: '请输入学院名称'
        }],
        position: [{
          trigger: 'blur',
          required: true,
          message: '请输入职位'
        }],
        teacherName: [{
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
        teacherNum: [{
          trigger: 'blur',
          required: true,
          message: '请输入编号'
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
      // 头像
      circleUserAvatar: 'http://rl4wu1zfh.hb-bkt.clouddn.com/logo.png',
      // 表单信息
      teacherInfoList: {
        teacherId: getUserId(),
        teacherName: '暂无数据',
        signature: '个性签名个性签名个性签名个性签名个性签名',
        roleId: '', // 教师

        schoolName: '山东大学',
        collegeName: '软件学院',
        position: '暂无数据',
        teacherNum: '暂无数据',

        sex: '0',
        phone: '暂无数据',
        intoTime: '',
        email: '暂无数据',
        politicalFace: '暂无数据',
        nativePlace: '暂无数据',
        location: '暂无数据',
        birthday: '',
        nation: '暂无数据',

        eduBackground: '暂无数据',
        idCard: '暂无数据',
        maritalStatus: '暂无数据',
        selfDescribe: '暂无数据'
      },
      evaluateAverageScore: {
        attitudeAverageScore: 0,
        bookChosenAverageScore: 0,
        homeworkAverageScore: 0,
        reactionAverageScore: 0,
        teachLevelAverageScore: 0
      }
    }
  },
  created() {
    this.getTeacher()
    this.getRoleList()
    this.getEvaluateAverageScore()

  },
  methods: {
    // 雷达图
    drawPie() {
      const charts = this.$echarts.init(document.getElementById('leiDaTu'))
      var option = {
        radar: {
          name: {
            textStyle: {
              color: '#fff', // 字体颜色
              backgroundColor: '#b9b9b9', // 背景色
              borderRadius: 3, // 圆角
              padding: [3, 5] // padding
            }
          },
          center: ['30%', '26%'],
          radius: '38%',
          // startAngle: 270,
          indicator: [
            { name: '教学水平', max: 5 },
            { name: '课堂互动', max: 5 },
            { name: '教学态度', max: 5 },
            { name: '作业布置', max: 5 },
            { name: '教材选择', max: 5 }
          ]
        },
        series: [{
          name: '个人统计',
          type: 'radar',
          areaStyle: {
            color: 'rgba(180,194,238,1)' // 图表背景的颜色
          },
          /* label: {
            show: true, // 显示数值
          }, */
          data: [{
            value: [
              this.evaluateAverageScore.teachLevelAverageScore,
              this.evaluateAverageScore.reactionAverageScore,
              this.evaluateAverageScore.attitudeAverageScore,
              this.evaluateAverageScore.homeworkAverageScore,
              this.evaluateAverageScore.bookChosenAverageScore
            ],
            name: '个人统计'
          }]
        }]
      }
      charts.setOption(option)
    },
    // 获取教师平均分
    async getEvaluateAverageScore() {
      const res = await getEvaluateAverageScoreListApi({ teacherId: getUserId() })
      if (res && res.code === 200) {
        console.log('{{{{{{{{{{{{{{{{{{{{{{{')
        console.log(res)
        this.evaluateAverageScore = res.data
        console.log(this.evaluateAverageScore)
      }
      this.$nextTick(function() {
        console.log("LLLLLLLLLLLLLLLLLLLLLLLL")
        this.drawPie('leiDaTu')
      })
    },
    // 获取角色id
    async getRoleId(teacherId) {
      const res = await getRoleByIdApi({ teacherId: teacherId })
      if (res && res.code === 200) {
        console.log(res)
        this.teacherInfoList.roleId = res.data.roleId
      }
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
    },
    // 获取教师
    async getTeacher() {
      const res = await getTeacherByIdApi({ teacherId: this.teacherInfoList.teacherId })
      if (res && res.code === 200) {
        console.log(res)
        this.teacherInfoList = res.data
        this.teacherInfoList.schoolName = '山东大学'
        this.getRoleId(this.teacherInfoList.teacherId)
        for (var i in this.teacherInfoList) {
          if (this.teacherInfoList[i] === null || this.teacherInfoList[i] === '') {
            this.teacherInfoList[i] = '暂无数据'
          }
        }
        if (this.teacherInfoList.politicalFace === '0') {
          this.teacherInfoList.politicalFace = '党员'
        } else if (this.teacherInfoList.politicalFace === '1') {
          this.teacherInfoList.politicalFace = '团员'
        } else if (this.teacherInfoList.politicalFace === '2') {
          this.teacherInfoList.politicalFace = '群众'
        } else {
          this.teacherInfoList.politicalFace = '暂无数据'
        }
        if (this.teacherInfoList.maritalStatus === '0') {
          this.teacherInfoList.maritalStatus = '未婚'
        } else if (this.teacherInfoList.maritalStatus === '1') {
          this.teacherInfoList.maritalStatus = '已婚'
        } else {
          this.teacherInfoList.maritalStatus = '暂无数据'
        }
        this.teacherInfoList.birthday = this.teacherInfoList.birthday.substring(0, 10)
      }
    },
    // 弹框关闭
    onClose() {
      this.getTeacher()
      this.addDialog.visible = false
    },
    // 弹框确定
    onConfirm() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          const res = await editApi(this.teacherInfoList)
          if (res && res.code === 200) {
            // 提示信息
            this.$message.success(res.msg)
            // 刷新列表
            this.getTeacher()
            this.addDialog.visible = false
          }
        }
      })
    },
    // 编辑按钮
    async editBtn() {
      // 清空表单
      this.$resetForm('addForm', this.teacherInfoList)
      // 根据id查询回显的数据
      const res = await getTeacherByIdApi({ teacherId: getUserId() })
      if (res && res.code === 200) {
        this.$objCopy(res.data, this.teacherInfoList)
        this.getRoleId(this.teacherInfoList.teacherId)
      }
      console.log(this.teacherInfoList)
      // 设置弹框属性
      this.addDialog.title = '编辑个人信息'
      this.addDialog.visible = true
      // 防止在浏览器中获取到密码
      this.teacherInfoList.password = ''
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
