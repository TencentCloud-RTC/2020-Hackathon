<template>
  <vue-baberrage :isShow="showBaberrage" :barrageList="baberrageList" :loop="barrageLoop"></vue-baberrage>
</template>

<script>
import { MESSAGE_TYPE } from 'vue-baberrage'
export default {
  data () {
    return {
      barrageLoop: false
    }
  },
  computed: {
    showBaberrage: {
      get () {
        return this.$store.state.showBaberrage
      },
      set () {
        this.$store.commit('setBaberrageShow', this.showBaberrage)
      }
    },
    baberrageList: {
      get () {
        return this.$store.state.baberrageList
      },
      set () { }
    }
  },
  watch: {
    showBaberrage (newVal, oldVal) {
      this.showBaberrage = newVal
    },
    baberrageList (newVal, oldVal) {
      this.baberrageList = newVal
    }
  },
  methods: {

  }
}
</script>