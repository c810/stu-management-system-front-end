<template>
  <el-main class="main-box">
    <div class="color-controller">
      <div class="down-load-btn"><el-button type="success" size="normal" icon="el-icon-edit" @click="getPdf('个人简历')">下载简历
      </el-button></div>

      <div class="color-picker-box">
        <span class="color-picker-text">左侧背景颜色：</span>
        <el-color-picker
          v-model="left_bg_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>

      <div class="color-picker-box">
        <span class="color-picker-text">姓名背景颜色：</span>
        <el-color-picker
          v-model="name_bg_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>

      <div class="color-picker-box">
        <span class="color-picker-text">姓名文字颜色：</span>
        <el-color-picker
          v-model="name_text_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>

      <div class="color-picker-box">
        <span class="color-picker-text">图标背景颜色：</span>
        <el-color-picker
          v-model="icon_bg_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>

      <div class="color-picker-box">
        <span class="color-picker-text">图标图案颜色：</span>
        <el-color-picker
          v-model="icon_pic_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>

      <div class="color-picker-box">
        <span class="color-picker-text">图标文字颜色：</span>
        <el-color-picker
          v-model="icon_text_color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
    </div>

    <div class="paper" id="pdfDom">
      <div class="left-box" :style="{ '--left_bg_color': left_bg_color }">
        <div class="avatar">
          <div class="my-avatar"></div>
        </div>
        <div class="name" :style="{ '--name_bg_color': name_bg_color,'--name_text_color': name_text_color }">
          <div class="my-name">{{ stuInfoList.stuName }}</div>
          <div class="my-divider">
            <el-divider></el-divider>
          </div>
          <div class="my-wish">求职意向：软件工程师</div>
        </div>
        <div class="basic-info" :style="{ '--icon_bg_color': icon_bg_color,'--icon_pic_color': icon_pic_color,'--icon_text_color': icon_text_color }">
          <div class="info-icon-text">
            <div v-if="stuInfoList.sex==='0'" class="icon"><i class="el-icon-male"></i></div>
            <span v-if="stuInfoList.sex==='0'" class="info-text">性别：男</span>
            <div v-if="stuInfoList.sex==='1'" class="icon"><i class="el-icon-female"></i></div>
            <span v-if="stuInfoList.sex==='1'" class="info-text">性别：女</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-date"></i></div>
            <span class="info-text">出生日期：{{ stuInfoList.birthday }}</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-location-outline"></i></div>
            <span class="info-text">籍贯：{{ stuInfoList.nativePlace }}</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-star-off"></i></div>
            <span class="info-text">政治面貌：{{ stuInfoList.politicalFace }}</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-user"></i></div>
            <span class="info-text">民族：{{ stuInfoList.nation }}</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-phone-outline"></i></div>
            <span class="info-text">电话号码：{{ stuInfoList.phone }}</span>
          </div>
          <div class="info-icon-text">
            <div class="icon"><i class="el-icon-message"></i></div>
            <span class="info-text">邮箱：{{ stuInfoList.email }}</span>
          </div>
        </div>
        <div class="score"></div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { getByIdApi } from '@/api/student'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      left_bg_color: '#f4f4f4',
      name_bg_color: '#8064a1',
      name_text_color: '#ffffff',
      icon_bg_color: '#8064a1',
      icon_pic_color: '#ffffff',
      icon_text_color: '#000000',

      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
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
  /*   state: {
      glbcolor: '#334157'// 设置一个默认颜色
    },
    mutations: {
      storeColor(state, data) {
        state.glbcolor = data
      }
    },
    computed: {
      projectId(bgcolor) {
        return this.$store.state.glbcolor
      }
    }, */
  created() {
    this.getStu()
  },
  methods: {
    // 切换颜色
    /*     changeColors(val) {
          if (val) {
            this.$store.commit('storeColor', val)
          }
        }, */
    // 获取学生
    async getStu() {
      const res = await getByIdApi({ stuId: this.stuInfoList.stuId })
      if (res && res.code === 200) {
        console.log(res)
        this.stuInfoList = res.data
        this.stuInfoList.schoolName = '山东大学'
        // this.getCollegeName(res.data.collegeId)
        // this.getMajorName(res.data.majorId)
        // this.getClassName(res.data.classId)
        // this.getRoleId(this.stuInfoList.stuId)
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
    }
  }
}
</script>

<style lang="scss" scoped>

.main-box {
  position: relative;
}

.down-load-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.color-controller {
  position: absolute;
  top: 200px;
  left: 1270px;
  //border: 1px solid #9b0d14;
}

.color-picker-box {
  display: flex;
  align-items: center;
  //border: 1px solid #5f9440;
}

.color-picker-text {
  font-size: 18px;
  font-weight: 700;
}

.paper {
  margin-left: 100px;
  width: 1095px;
  height: 1556px;
  box-shadow: 5px 5px 25px #c7c7c7;
}

.left-box {
  width: 36%;
  height: 100%;
  background-color: var(--left_bg_color) !important;
}

.avatar {
  width: 100%;
  height: 25%;
  //border: 1px solid #9b0d14;
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-avatar {
  width: 260px;
  height: 260px;
  border-radius: 100%;
  background-color: #ffffff;
  margin-top: 30px;
}

.name {
  width: 100%;
  height: 10%;
  background: var(--name_bg_color) !important;
  //border: 1px solid #9b0d14;
}

.my-name {
  margin-top: 18px;
  padding-top: 28px;
  color: var(--name_text_color) !important;
  font-size: 35px;
  font-weight: 700;
  letter-spacing: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.my-divider {
  margin-top: -12px;
  width: 290px;
  height: 16px;
  margin-left: 50px;
}

.el-divider {
  background-color: var(--name_text_color) !important;
}

.my-wish {
  color: var(--name_text_color) !important;
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.basic-info {
  width: 100%;
  height: 40%;
  //border: 1px solid #9b0d14;
  padding: 30px 0 0 40px;
}

.info-icon-text {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.icon {
  width: 45px;
  height: 45px;
  border-radius: 100%;
  background-color: var(--icon_bg_color) !important;
  color: var(--icon_pic_color) !important;
  font-size: 22px;
  display: inline-block;
  padding: 11px 12px;
  margin-right: 20px;
}

.info-text {
  display: inline-block;
  font-weight: 700;
  font-size: 20px;
  color: var(--icon_text_color) !important;
}

.score {
  width: 100%;
  height: 25%;
  //border: 1px solid #9b0d14;
}
</style>
