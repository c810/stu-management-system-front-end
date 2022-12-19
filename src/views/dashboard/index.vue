<template>
  <el-main>
    <!-- 统计 -->
    <el-row
      :gutter="20"
      type="flex"
      class="row-bg"
      justify="center"
      style="margin-bottom: 80px"
    >
      <el-col :span="6">
        <div class="show-header" style="background: rgb(45, 183, 245)">
          <div class="bottom-text">学生总数</div>
          <div class="show-num">{{ stuCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(237, 64, 20)">
          <div class="bottom-text">班级总数</div>
          <div class="show-num">{{ classCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgba(91,187,11,0.91)">
          <div class="bottom-text">专业总数</div>
          <div class="show-num">{{ majorCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(255, 153, 0)">
          <div class="bottom-text">教师总数</div>
          <div class="show-num">{{ teacherCount }}</div>
        </div>
      </el-col>
    </el-row>
    <!-- 图表显示:定义容器,宽度和高度,id -->
    <div style="display: flex">
      <div id="main1" style="width: 400px; height: 300px; flex-grow: 1"></div>
      <div id="main2" style="width: 400px; height: 300px; flex-grow: 1"></div>
    </div>
    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="clearfix">
        <span style="color: #000000; font-weight: 600">公告列表</span>
      </div>
      <!-- 循环打印公告 -->
      <div v-for="(item,index) in noticeList" :key="index" class="text item">
        <span style="font-weight: 600; font-size: 14px">{{ item.title }}</span>
        <span style="margin-left: 30px; font-size: 14px">{{ item.noticeContent }}</span>
        <span style="margin-left: 30px; font-size: 14px">{{ item.createTime }}</span>
        <el-divider></el-divider>
      </div>
    </el-card>
  </el-main>
</template>

<script>
import { getHomeCountApi } from '@/api/login'
import { getTopListApi } from '@/api/notice'
import { getStuCountApi, getHotMajorApi } from '@/api/student'

export default {
  data() {
    return {
      stuCount: 0,
      classCount: 0,
      majorCount: 0,
      teacherCount: 0,
      noticeList: []
    }
  },
  created() {
    this.getHomeCount()
    this.getTopList()
  },
  mounted() {
    this.myecharts1()
    this.myecharts2()
  },
  methods: {
    // 获取最近3条公告列表
    async getTopList() {
      const res = await getTopListApi()
      if (res && res.code === 200) {
        console.log(res)
        this.noticeList = res.data
        console.log(this.noticeList)
      }
    },
    // 首页总数
    async getHomeCount() {
      const res = await getHomeCountApi()
      if (res && res.code === 200) {
        console.log(res)
        this.stuCount = res.data.stuCount
        this.classCount = res.data.classCount
        this.majorCount = res.data.majorCount
        this.teacherCount = res.data.teacherCount
      }
    },
    async myecharts1() {
      // 初始化echarts
      var myChart = this.$echarts.init(document.getElementById('main1'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '学生统计'
        },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: '总数',
            type: 'bar',
            data: []
          }
        ]
      }
      // 动态获取数据
      const res = await getStuCountApi()
      if (res && res.code === 200) {
        console.log(res)
        option.xAxis.data = res.data.names
        option.series[0].data = res.data.count
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async myecharts2() {
      var myChart = this.$echarts.init(document.getElementById('main2'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '热门专业',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            // name: "Access From",
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      }
      // 动态获取数据
      const res = await getHotMajorApi()
      if (res && res.code === 200) {
        option.series[0].data = res.data
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-text {
  bottom: 0;
  //width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 80px;
  line-height: 80px;
  text-align: center;
  //position: absolute;
  font-weight: 600;
  font-size: 20px;
  float: left;
  width: 50%;
  border-radius: 10px;
}

.show-header {
  background: #00c0ef;
  color: #fff;
  height: 80px;
  border-radius: 10px;
  position: relative;

}

.show-num {
  font-size: 38px;
  font-weight: 600;
  //padding: 5px;
  float: left;
  width: 50%;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
</style>
