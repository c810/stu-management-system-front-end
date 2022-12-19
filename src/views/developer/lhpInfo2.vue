<template>
  <div class="main">
    <h2>↓滚轮滚一下呗↓</h2>
    <div class="bg" ref="background">
      <span>Hello</span>
    </div>
    <h1>欢迎来到<br>李浩鹏的前端世界</h1>
  </div>
</template>

<script>


export default {
  data() {
    return {
      // 获取背景对象
      bg: document.querySelector('.bg')
    }
  },
  mounted() {
    // console.log('============================')
    // console.log(this.$refs.bg.style.cssText)
    console.log(this.$refs.background.style.cssText)
    // 获取当前滚轮的位置
    const scrollY = window.scrollY
    // console.log(scrollY)
    if (scrollY !== 0) {
      // 滚轮位置不等于0时,修改背景的定位加上滚轮的值
      this.$refs.background.style.backgroundPosition = 'calc(50% + ' + scrollY + 'px) calc(50% + ' + scrollY + 'px)'
    } else {
      // 否则清空背景的定位
      this.bg.style.backgroundPosition = ''
    }
  },
  methods: {
    // init() {
    //   // 监听滚轮事件
    //   document.addEventListener('scroll', function() {
    //
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
* {
  /* 初始化 */
  margin: 0;
  padding: 0;
}

.main {
  /* 200%窗口高度（两屏窗口的高度）*/
  height: 200vh;
}

.bg {
  /* 背景图片 */
  background-image: url("../../assets/images/LHPInfoBg/mountain.jpg");
  /* 对图片进行剪切，保留原始比例 */
  background-size: cover;
  /* 设置背景图片的定位 */
  background-position: 50% 50%;
  height: 200vh;
  font-size: 450px;
  font-weight: 900;
  text-align: center;
  /* 相对定位 */
  position: relative;
  /* 以区块内的文字作为裁剪区域向外裁剪，文字的背景即为区块的背景，文字之外的区域都将被裁剪掉 */
  -webkit-background-clip: text;
  /* 将文字透明镂空 */
  -webkit-text-fill-color: transparent;
  overflow: hidden;
  padding-top: 100px;
}

.bg::before {
  content: "";
  /* 背景图片继承父元素 */
  background-image: inherit;
  background-size: cover;
  background-position: 50% 50%;
  /* 绝对定位 */
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -99;
}

h2 {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  letter-spacing: 8px;
  color: #fff;
}

h1 {
  position: absolute;
  top: 145vh;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  color: #fff;
  letter-spacing: 10px;
  padding: 100px 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
