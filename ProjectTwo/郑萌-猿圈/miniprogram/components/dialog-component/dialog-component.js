// components/dialog-component/dialog-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    code: null,
    sureCallback: function () {},
    cancelCallback: function () {},
    title: '',
    content: '',
    cancelText: '取消',
    sureText: '确定',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dialogCancel() {
      this.data.cancelCallback && this.data.cancelCallback();
      this.hide();
    },

    dialogOk() {
      this.data.sureCallback && this.data.sureCallback();
      this.hide();
    },

    show({
      title,
      content,
      cancelText,
      sureText
    }, sure = function () {}, cancel = function () {}) {
      // if (this.data.isShow) {
      //   return;
      // }
      this.setData({
        title,
        content,
        cancelText,
        sureText,
        sureCallback: sure,
        cancelCallback: cancel,
        isShow: true
      });
    },

    hide() {
      setTimeout(() => {
        this.setData({
          title: '',
          content: '',
          cancelText: null,
          sureText: null,
          sureCallback: function () {},
          cancelCallback: function () {},
          isShow: false
        });
      }, 100);
    }
  }
})