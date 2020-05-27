<template>
  <div class="container">
    <p>
      1.点击
      <a href="http://debugtbs.qq.com/">http://debugtbs.qq.com/</a>
    </p>
    <p class="margin-p">2.点击“安装线上内核”</p>
    <div>
      <img :src="step1" alt />
    </div>
    <p class="margin-p">3.安装完成后，点击“重启”</p>
    <div>
      <img :src="step2" alt />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      step1: require('@/assets/img/login/cantplay_01.jpg'),
      step2: require('@/assets/img/login/cantplay_02.jpg')
    }
  }
}
</script>
<style lang="css" scoped>
p {
  margin: 0;
}
.margin-p {
  margin: 5px 0;
}
.container {
  padding: 20px;
  box-sizing: border-box;
}
img {
  width: 100%;
  display: block;
}
</style>