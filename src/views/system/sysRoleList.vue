<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form ref="searchRef" :model="listPara" :inline="true" size="small">
      <el-form-item>
        <!-- roleName要与RolePara类里面的roleName一一对应 -->
        <el-input v-model="listPara.roleName" placeholder="请输入角色名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:sysRoleList:add']" type="primary" icon="el-icon-plus" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleType" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleType === '1'" type="danger" size="normal">系统用户</el-tag>
          <el-tag v-if="scope.row.roleType === '2'" type="success" size="normal">学生</el-tag>
          <el-tag v-if="scope.row.roleType === '3'" type="warning" size="normal">教师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column v-if="$checkPermission(['sys:sysRoleList:edit','sys:sysRoleList:assignRole','sys:sysRoleList:delete'])" label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button v-permission="['sys:sysRoleList:edit']" type="primary" size="small" icon="el-icon-edit" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:sysRoleList:assignRole']" type="success" size="small" icon="el-icon-edit" @click="assignBtn(scope.row)">分配权限</el-button>
          <el-button v-permission="['sys:sysRoleList:delete']" type="danger" size="small" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="listPara.currentPage"
      :page-sizes="[10,20,40,80,100]"
      :page-size="listPara.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listPara.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 新增、编辑 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form ref="addRef" :model="addModel" label-width="80px" size="small">
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleName" :rules="Rules.isNull" label="角色名称">
                <el-input v-model="addModel.roleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleType" :rules="Rules.select" label="角色类型">
                <el-select v-model="addModel.roleType" placeholder="">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item label="角色备注">
                <el-input v-model="addModel.remark"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 分配权限弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      :height="assignDialog.height"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <!-- 这里的slot插槽会放到子组件(弹框组件)里面的content插槽位置 -->
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="menuId"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          default-expand-all
          :default-checked-keys="assignTreeChecked"
        ></el-tree>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { getListApi, addRoleApi, editRoleApi, deleteRoleApi, assignRoleApi, saveAssignApi } from '@/api/role'
import { getUserId } from '@/utils/auth'
import Rules from '@/utils/rules'

export default {
  // 注册组件
  components: {
    SysDialog
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 角色id
      roleId: '',
      // 树数据
      assignTreeData: [],
      // 角色原来的权限
      assignTreeChecked: [],
      // 分配权限弹框属性
      assignDialog: {
        title: '',
        visible: false,
        height: 450,
        width: 300
      },
      // 搜索数据
      listPara: {
        roleName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 表格数据
      tableData: [],
      // 表格高度
      tableHeight: 0,
      // 弹框属性
      dialog: {
        height: 150,
        visible: false,
        title: ''
      },
      // 新增表单绑定的数据
      addModel: {
        type: '', // 0：新增 1：编辑
        roleId: '',
        roleName: '',
        roleType: '',
        remark: ''
      },
      // 表单验证规则
      Rules,
      // 角色类型
      options: [{
        value: '1',
        label: '系统用户'
      }, {
        value: '2',
        label: '学生'
      }, {
        value: '3',
        label: '教师'
      }]
    }
  },
  mounted() {
    // 计算表格的高度(目前不能随窗口大小调整)
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  created() {
    this.getList()
  },
  methods: {
    // 分配权限弹窗关闭
    onAssignClose() {
      this.assignDialog.visible = false
    },
    // 分配权限弹框确定
    async onAssignConfirm() {
      const ids = this.$refs.assignTree.getCheckedKeys().concat(this.$refs.assignTree.getHalfCheckedKeys())
      const para = {
        roleId: this.roleId,
        list: ids
      }
      const res = await saveAssignApi(para)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
        this.assignDialog.visible = false
      }
    },
    // 分配权限按钮
    async assignBtn(row) {
      this.roleId = row.roleId
      // 设置弹框属性
      this.assignDialog.title = '为【' + row.roleName + '】分配权限'
      this.assignDialog.visible = true
      // 获取权限树数据
      const para = {
        userId: getUserId(),
        roleId: row.roleId
      }
      const res = await assignRoleApi(para)
      if (res && res.code === 200) {
        // 设置树的数据
        console.log(res)
        this.assignTreeData = res.data.menuList
        this.assignTreeChecked = res.data.checkList
      }
      // 过滤回显的数据
      if (this.assignTreeChecked.length > 0) {
        const newArr = []
        this.assignTreeChecked.forEach((item) => {
          this.checked(item, this.assignTreeData, newArr)
        })
        this.assignTreeChecked = newArr
      }
    },
    // 过滤工具(找出所有的回显数据)
    checked(id, data, newArr) {
      data.forEach((item) => {
        if (item.menuId === id) {
          // 是不是末级
          if (item.children && item.children.length === 0) {
            newArr.push(item.menuId)
          }
        } else {
          // 有下级的时候,继续查找
          if (item.children && item.children.length !== 0) {
            // 递归
            this.checked(id, item.children, newArr)
          }
        }
      })
    },
    // 获取列表
    async getList() {
      const res = await getListApi(this.listPara)
      if (res && res.code === 200) {
        // 设置表格数据
        this.tableData = res.data.records
        this.listPara.total = res.data.total
      }
    },
    // 搜索按钮
    searchBtn() {
      this.getList()
    },
    // 重置按钮
    resetBtn() {
      this.listPara.roleName = ''
      this.getList()
    },
    // 新增按钮
    addBtn() {
      // 设置弹框属性
      this.dialog.title = '新增角色'
      this.dialog.visible = true
      // 清空表单
      this.$resetForm('addRef', this.addModel)
      // 设置为新增
      this.addModel.type = '0'
    },
    // 编辑按钮
    editBtn(row) {
      // 设置弹框属性
      this.dialog.title = '编辑角色'
      this.dialog.visible = true
      // 清空表单
      this.$resetForm('addRef', this.addModel)
      // 设置为编辑
      this.addModel.type = '1'
      // 把当前要编辑的数据设置到表单数据域
      this.$objCopy(row, this.addModel)
    },
    // 删除按钮
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteRoleApi({ role: row.roleId })
        if (res && res.code === 200) {
          // 信息提示
          this.$message({ type: 'success', message: res.msg })
          // 刷新列表
          this.getList()
        }
      }
    },
    // 页容量改变时触发
    sizeChange(val) {
      this.listPara.pageSize = val
      this.getList()
    },
    // 页数改变时触发
    currentChange(val) {
      this.listPara.currentPage = val
      this.getList()
    },
    // 弹框关闭
    onClose() {
      this.dialog.visible = false
    },
    // 弹框确定
    onConfirm() {
      // 表单验证
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          let res = null
          if (this.addModel.type === '0') {
            res = await addRoleApi(this.addModel)
          } else {
            res = await editRoleApi(this.addModel)
          }
          if (res && res.code === 200) {
            // 信息提示
            this.$message({ type: 'success', message: res.msg })
            // 刷新列表
            this.getList()
            this.dialog.visible = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.el-main >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #9b0d14;
  color: #fff;
}
</style>
