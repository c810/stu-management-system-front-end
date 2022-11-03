<template>
  <!-- el-开头的标签,当作普通的div标签看待 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width + 'px'"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <div class="container" :style="{height: height + 'px'}">
      <!-- 使用插槽展示内容(在父组件中使用) -->
      <slot name="content"/>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹框的标题
    title: {
      type: String,
      default: '标题'
    },
    // 控制弹框展示和隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 控制弹框宽度
    width: {
      type: Number,
      default: 630
    },
    // 控制弹框高度
    height: {
      type: Number,
      default: 250
    }
  },
  methods: {
    // 控制弹窗关闭事件
    onClose() {
      this.$emit('onClose') // 触发父组件绑定的关闭事件
    },
    // 控制弹窗确定事件
    onConfirm() {
      this.$emit('onConfirm') // 触发父组件绑定的确定事件
    }
  }
}
</script>

<style lang="scss" scoped>
// 当弹框内容高度超出弹框指定高度,实现上下滑动(滚动条)
.container{
  padding: 0;
  overflow-x: initial;
  overflow-y: auto;
}

.el-dialog__wrapper {
  // ::v-deep深度查找,从.el-dialog__wrapper开始向下查找,不管有多少层级,找到.el-dialog,定义样式
  ::v-deep .el-dialog { // 弹框上方两圆角
    border-top-left-radius: 9px !important;
    border-top-right-radius: 9px !important;
    .el-dialog__header { // 弹框头上方两圆角
      border-top-left-radius: 7px !important;
      border-top-right-radius: 7px !important;
      background-color: #1890ff;
       // 弹框标题样式
      .el-dialog__title {
        color: #fff;
        font-size: 15px;
        font-weight: 700;
      }
      // 弹框关闭按钮
      .el-dialog__close {
        color: #fff;
      }
    }
    // 弹框主体
    .el-dialog__body {
      padding: 10px 10px !important;
    }
    // 弹框底部分割线
    .el-dialog__footer {
      border-top: 1px solid #e8eaec !important;
      padding: 10px !important;
    }
  }
}
</style>
