<template>
  <div class="left-container">
    <ul class="left-ul">
      <li
        class="left-li"
        :class="item.class"
        v-for="(item, index) in navBarList"
        @mouseenter="mouseEnter(index)"
        @mouseleave="mouseLeave(index)"
        @click="operate(item.command)"
        :key="item.title"
      >
        <div>
          <el-tooltip
            class="item"
            effect="light"
            popper-class="test"
            :content="item.title"
            placement="left-end"
          >
            <i :class="item.icon"></i>
          </el-tooltip>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      navBarList: [
        { title: this.$t('navBar.clouddesk'), command: 'clouddesk', icon: 'iconfont icon-clouddesk', class: 'normal' },
        { title: this.$t('navBar.screenShare'), command: 'screenShare', icon: 'iconfont icon-screenShare', class: 'normal' },
        { title: this.$t('navBar.qa'), command: 'qa', icon: 'iconfont icon-qa', class: 'normal' },
        { title: this.$t('navBar.signIn'), command: 'signIn', icon: 'iconfont icon-signIn', class: 'normal' },
        { title: this.$t('navBar.stats'), command: 'stats', icon: 'iconfont icon-stats', class: 'normal' },
        { title: this.$t('navBar.clock'), command: 'clock', icon: 'iconfont icon-clock', class: 'normal' },
        { title: this.$t('navBar.dice'), command: 'dice', icon: 'iconfont icon-dice', class: 'normal' }
      ]
    }
  },
  mounted () {
  },
  methods: {
    mouseEnter (idx) {
      this.navBarList[idx].class = 'left-li-actvie'
    },
    mouseLeave (idx) {
      this.navBarList[idx].class = 'normal'
    },
    operate (command) {
      this.$emit('operateNav', command)
    }
  },
}
</script>

<style lang="css" scoped>
.left-container {
  position: absolute;
  top: 25%;
  right: 0;
  z-index: 2000;
}
.left-ul {
  list-style: none;
  text-align: center;
  padding: 10px 6px;
  background: #484848;
  color: #d6d6d6;
  font-size: 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.left-ul .left-li {
  margin-bottom: 12px;
}
.left-ul .left-li.left-li-actvie {
  color: #67c23a;
}
.left-ul .left-li:last-child {
  margin-bottom: 0;
}
.left-ul .left-li i {
  font-size: 18px;
}
</style>