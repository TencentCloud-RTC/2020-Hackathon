<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  },
  methods: {
    getQuery () {
      let query = this.$route.query
      this.$store.commit('setRoomID', query.roomID)
    },
    isMobile () {
      var userAgentInfo = navigator.userAgent
      var osTypes = ["Android", "iPhone", "iPad", "iPod"]
      var find = false
      for (var n = 0; n < osTypes.length; n++) {
        if (userAgentInfo.indexOf(osTypes[n]) > 0) {
          find = true
          break
        }
      }
      return find
    }
  },
  mounted () {
    this.getQuery()

    let isMobile = this.isMobile()
    if (isMobile) {
      this.$router.replace({ path: '/mLogin', query: this.$route.query })
    } else {
      this.$router.replace({ path: '/login', query: this.$route.query })
    }
  }
}
</script>