<template>
  <div id="app">
    <baberrage></baberrage>
    <router-view />
  </div>
</template>

<script>
import Baberrage from '@/components/baberrage/Baberrage'
export default {
  name: 'App',
  components: {
    Baberrage
  },
  data () {
    return {

    }
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app /deep/ .el-dialog {
  border-radius: 8px;
  margin-top: 6vh;
}
*:focus {
  outline: none;
}
.el-dialog {
  border-radius: 8px;
}
.v-modal {
  opacity: 0.7 !important;
}
.el-message-box__wrapper .el-button--small,
.el-button--small.is-round {
  padding: 6px 12px !important;
}
.el-message-box__wrapper
  .el-message-box
  .el-message-box__content
  .el-message-box__input
  .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.el-message-box__wrapper .el-message-box {
  border-radius: 8px;
}
.el-tooltip__popper.is-light {
  color: #737373;
  border: 0;
}
.el-tooltip__popper[x-placement^="left"] .popper__arrow {
  border-left-color: #fff;
}
.el-tooltip__popper[x-placement^="left"] .popper__arrow:after {
  border-left-color: #fff !important;
  border-width: 7px;
  left: -1px;
  top: -7px;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #fff;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
  border-top-color: #fff !important;
  border-width: 7px;
  top: -6px;
  left: -2px;
}
.el-tooltip__popper {
  padding: 6px 10px;
}
.el-popover {
  padding: 12px 0 !important;
  max-height: 320px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  min-width: 100px;
}
.el-popover::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background: #262626;
}
.baberrage-item {
  z-index: 5000;
  padding: 2px 15px 5px 15px !important;
  font-size: 16px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  /* color: #fff; */
  background: transparent !important;
  /* color: #000 !important; */
}

.baberrage-item.red {
  color: red !important;
}
.baberrage-item.green {
  color: green !important;
}
.baberrage-item.blue {
  color: blue !important;
}
.baberrage-item.orange {
  color: orange !important;
}
.baberrage-item.purple {
  color: purple !important;
}
.baberrage-item.yellow {
  color: yellow !important;
}
.baberrage-item.pink {
  color: pink !important;
}
.baberrage-item.grey {
  color: grey !important;
}

.baberrage-avatar {
  display: none;
}
.baberrage-msg {
  height: 24px;
  vertical-align: middle;
  line-height: 10px;
  padding-left: 0 !important;
}
</style>
