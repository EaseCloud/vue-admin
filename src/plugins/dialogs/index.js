export default {
  install (Vue) {
    Vue.mixin({
      computed: {},
      methods: {
        /**
         * Promise 形式实现，类似于原声 confirm 方法
         * @param message
         * @param title
         * @param width
         * @param okText
         * @param cancelText
         * @param scrollable
         * @param method
         * @param render
         * @returns {Promise<any>}
         */
        async $confirm (message, {
          title = '操作确认',
          width = 540,
          okText = '确认',
          cancelText = '取消',
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
              scrollable,
              render,
              onOk: resolve,
              onCancel: reject
            })
          })
        },
        async $prompt (message = '', {
          title = '参数输入',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          defaultValue = '',
          placeholder = ''
        } = {}) {
          const vm = this
          let value = defaultValue
          return new Promise((resolve, reject) => {
            vm.$Modal.confirm({
              title,
              width,
              okText,
              cancelText,
              render (h) {
                return h('i-form', {
                  style: { marginTop: '16px' },
                  props: { labelPosition: 'top' }
                }, [h('form-item', {
                  props: { label: message }
                }, [h('i-input', {
                  props: { value, autofocus: true, placeholder },
                  on: {
                    input (val) {
                      value = val
                    }
                  }
                })])])
              },
              onOk: () => resolve(value),
              onCancel: reject
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
