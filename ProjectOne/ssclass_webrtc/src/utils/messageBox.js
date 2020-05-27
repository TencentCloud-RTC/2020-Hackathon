class MessageBox {
  constructor() {}

  /**
   * 通知提示
   * @param vue vue实例
   * @param type 类型 string success/warning/info/error/notify
   * @param message 文字信息
   */
  notify(vue, type, message, duration) {
    let label = 'system.' + type
    let title = window.i18n.t(label)
    if (type === "error") {
      duration = 3000
    } else if (type === "notify") {
      type = "success"
      duration = 1500
    }
    const h = vue.$createElement
    vue.$notify({
      title: title,
      offset: 28,
      duration: duration == null ? 3000 : duration,
      type: type || 'info',
      message: h('i', {
        style: 'color: teal'
      }, message)
    })
  }

  // this.$message.prompt(
  //   this,
  //   this.$t('clouddesk.createFolder'),
  //   this.$t('clouddesk.createFolderHint'),
  // ).then(value => {

  /**
   * 提示
   * @param {*} vue 
   * @param {*} title 
   * @param {*} inputHint 
   */
  prompt(vue, title, inputHint) {
    return new Promise((resolve) => {
      vue.$prompt(inputHint, title, {
        confirmButtonText: window.i18n.t('system.okText'),
        cancelButtonText: window.i18n.t('system.cancelText'),
        cancelButtonClass: 'el-button--danger',
        roundButton: true
      }).then(({
        value
      }) => {
        if (value) {
          resolve(value)
        }
      }).catch(() => {})
    })
  }

  /**
   * 警告通知
   * @param vue vue实例
   * @param message 文字信息
   * @param type default/okcancel
   */
  alert(vue, message, type) {
    if (arguments.length === 3 && type === 'okcancel') {
      return new Promise((resolve) => {
        vue.$alert(message, window.i18n.t('system.alert'), {
          confirmButtonText: window.i18n.t('system.okText'),
          showCancelButton: true,
          cancelButtonText: window.i18n.t('system.cancelText'),
          cancelButtonClass: 'el-button--danger',
          confirmButtonClass: 'el-button--primary',
          roundButton: true,
          callback: action => {
            resolve(action)
          }
        })
      })
    } else {
      return new Promise((resolve) => {
        vue.$alert(message, window.i18n.t('system.alert'), {
          confirmButtonText: window.i18n.t('system.okText'),
          roundButton: true,
          callback: action => {
            resolve(action)
          }
        })
      })
    }
  }
}

const message = new MessageBox()
export default message