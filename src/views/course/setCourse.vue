<template>
  <el-container>
    <el-aside
      :style="{ height: leftHeight + 'px' }"
      style="border-right: 1px solid #EBEEF5;"
      width="200px"
    >
      <el-input v-model="filterText" style="padding:5px;" size="mini" placeholder="请输入关键字查询"/>
      <el-tree
        ref="leftTree"
        style="font-size: 14px"
        class="filter-tree"
        :data="leftTree"
        node-key="classId"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        empty-text="暂无数据"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="nodeSelect"
      >
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div>
            <!-- 没有子元素时显示的图标 (即是最后一层) -->
            <span v-if="data.children.length === 0">
              <i
                class="el-icon-document"
                style="color: #8c8c8c; margin-right: 3px"
              />
            </span>
            <!-- 有子元素显示的图标 -->
            <span v-else @click.stop="openBtn(data)">
              <!-- 这里的展开的显示隐藏即是 [+] [-]-->
              <svg-icon
                v-if="data.open"
                icon-class="add-s"
                style="margin-right: 4px; font-size: 18px"
              />
              <svg-icon v-else icon-class="sub-s" style="margin-right: 4px"/>
            </span>
            <!-- 名称 -->
            <span>{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <el-main>
      <el-form :model="searchModel" :inline="true" size="small">
        <el-form-item>
          <el-input v-model="searchModel.courseName" placeholder="请输入课程名称"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
          <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addBtn">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :height="tableHeight" :data="tableList" border stripe>
        <el-table-column prop="className" label="班级"/>
        <el-table-column prop="courseName" label="课程"/>
        <el-table-column prop="courseYear" label="开课年份"/>
        <el-table-column prop="type" label="学期类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === '0'" type="success" size="small">春季</el-tag>
            <el-tag v-if="scope.row.type === '1'" type="warning" size="small">秋季</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配课程新增或编辑弹框组件 -->
      <sys-dialog
        :title="addDialog.title"
        :visible="addDialog.visible"
        :width="addDialog.width"
        :height="addDialog.height"
        @onClose="onClose"
        @onConfirm="onConfirm"
      >
        <div slot="content">
          <el-transfer
            v-model="value"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入课程名称"
            :data="courseList"
            :titles="['待选课程','已选课程']"
            :props="{
              key: 'courseId',
              label: 'courseName'
            }"
          />
          <el-form style="margin-top: 20px" ref="addForm" :model="addModel" :rules="rules" label-width="80px"
                   :inline="true" size="small"
          >
            <el-form-item prop="courseYear" label="开课年份">
              <el-date-picker
                v-model="addModel.courseYear"
                type="year"
                value-format="yyyy"
                placeholder="请选择开课年份"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="type" label="学期类型">
              <el-select v-model="addModel.type" placeholder="请选择学期类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </sys-dialog>
    </el-main>
  </el-container>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { getClassTreeApi, getCourseListApi, saveCourseApi, getClassCourseApi, deleteClassCourseApi } from '@/api/course'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      // tableHeight: 0,
      tableList: [],
      selectList: [],
      // 学期选择数据
      options: [{
        value: '0',
        label: '春季'
      }, {
        value: '1',
        label: '秋季'
      }],
      // 表单数据
      addModel: {
        classId: '',
        courseYear: '',
        type: ''
      },
      // 表单验证规则
      rules: {
        courseYear: [{
          trigger: 'blur',
          required: true,
          message: '请选择开课年份'
        }],
        type: [{
          trigger: 'blur',
          required: true,
          message: '请选择学期类型'
        }]
      },
      // 课程数据
      courseList: [],
      value: [],
      // 班级名称
      className: '',
      // 左侧树所选类型
      type: '',
      // 弹框属性
      addDialog: {
        title: '',
        visible: false,
        width: 640,
        height: 400
      },
      // 搜索数据
      searchModel: {
        total: '',
        currentPage: 1,
        pageSize: 10,
        classId: '',
        courseName: ''
      },
      filterText: '',
      leftHeight: 0,
      defaultProps: {
        children: 'children',
        label: 'className'
      },
      leftTree: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.leftTree.filter(val)
    }
  },
  created() {
    this.getTree()
    this.getClassCourse()
  },
  mounted() {
    this.$nextTick(() => {
      this.leftHeight = window.innerHeight - 100
    })
  },
  methods: {
    // 删除按钮
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteClassCourseApi({
          classCourseId: row.classCourseId
        })
        if (res && res.code === 200) {
          this.$message.success(res.msg)
          this.getClassCourse()
        }
      }
    },
    async getClassCourse() {
      const res = await getClassCourseApi(this.searchModel)
      if (res && res.code === 200) {
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
    },
    filterMethod(query, item) {
      return item.courseName.indexOf(query) > -1
    },
    // 弹框确定
    onConfirm() {
      this.selectList = []
      if (this.value.length === 0) {
        this.$message.warning('请选择课程!')
        return
      }
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          for (let i = 0; i < this.value.length; i++) {
            const obj = {}
            obj.courseId = this.value[i]
            obj.classId = this.addModel.classId
            obj.courseYear = this.addModel.courseYear
            obj.type = this.addModel.type
            this.selectList.push(obj)
          }
          const res = await saveCourseApi(this.selectList)
          if (res && res.code === 200) {
            this.$message.success(res.msg)
            this.getClassCourse()
            this.addDialog.visible = false
          }
        }
      })
    },
    // 弹框关闭
    onClose() {
      this.addDialog.visible = false
    },
    // 新增按钮
    async addBtn() {
      this.value = []
      this.selectList = []
      this.addModel.courseYear = ''
      this.addModel.type = ''
      // 没有选择班级,或者选择的是专业
      if (!this.type || this.type === '0') {
        this.$message.warning('请选择班级!')
        return
      }
      // 获取课程数据
      const res = await getCourseListApi()
      if (res && res.code === 200) {
        this.courseList = res.data
      }
      this.addDialog.title = '为【' + this.className + '】分配课程'
      this.addDialog.visible = true
    },
    // 重置按钮
    resetBtn() {
      this.searchModel.courseName = ''
      this.getClassCourse()
    },
    // 搜索按钮
    searchBtn() {
      this.getClassCourse()
    },
    nodeSelect(node) {
      console.log(node)
      this.className = node.className
      this.type = node.type
      this.addModel.classId = node.classId
      this.searchModel.classId = node.classId
      this.getClassCourse()
    },
    openBtn(data) {
      data.open = !data.open
      this.$refs.leftTree.store.nodesMap[data.classId].expanded = !data.open
    },
    filterNode(value, data) {
      if (!value) return true
      return data.className.indexOf(value) !== -1
    },
    async getTree() {
      const res = await getClassTreeApi()
      console.log(res)
      if (res && res.code === 200) {
        this.leftTree = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
  }

  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }

  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  // 竖线
  .el-tree-node:before {
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
  }

  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }

  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }

  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

//去掉最上级的before  after 即是去电最上层的连接线
.el-aside ::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}

//上级部门树
.el-dialog__wrapper ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
  }

  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }

  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  // 竖线
  .el-tree-node:before {
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
  }

  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }

  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }

  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

//去掉最上级的before  after 即是去电最上层的连接线
.el-dialog__wrapper ::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>
