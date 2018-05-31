export default {
  install (Vue) {
    Vue.mixin({
      computed: {},
      methods: {
        async $confirm (message, {
          title = '操作确认',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          closable = true,
          scrollable = true,
          method = 'confirm', // info/success/warning/error/confirm
          render
        } = {}) {
          const vm = this
          return new Promise((resolve, reject) => {
            vm.$Modal[method]({
              title,
              content: message,
              width,
              okText,
              cancelText,
              closable,
              scrollable,
              render,
              onOk: resolve,
              onCancel () {
                reject(new Error('用户取消操作'))
              }
            })
          })
        }
        // modalForm ({ title, fields, actions }) {
        //   const vm = this
        //   vm.$Modal
        // }
      }
    })
  }
}
