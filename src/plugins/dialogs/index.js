import Dialog from './Dialog.vue'

export default {
  install (Vue) {
    Vue.mixin({
      computed: {},
      methods: {
        openDialog (options = {}) {
          const el = document.createElement('div')
          document.body.appendChild(el)
          const ModalComponent = Vue.extend(Dialog)
          return new ModalComponent({ el, propsData: { options } })
        },
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
            vm.openDialog({
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
            // vm.$Modal[method]({
            //   title,
            //   content: message,
            //   width,
            //   okText,
            //   cancelText,
            //   scrollable,
            //   render,
            //   onOk: resolve,
            //   onCancel: reject
            // })
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
            const dialog = vm.openDialog({
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
                    },
                    'on-keydown' (event) {
                      if (event.keyCode === 13) {
                        // Enter
                        resolve(value)
                        dialog.close()
                        event.preventDefault()
                      } else if (event.keyCode === 27) {
                        // Escape
                        reject(new Error('用户取消了操作'))
                        dialog.close()
                        event.preventDefault()
                      }
                    }
                  }
                })])])
              },
              onOk: () => resolve(value),
              onCancel: reject
            })
          })
        },
        async modalEditView (editViewOptions, {
          title = '编辑模型',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          method = 'confirm', // info/success/warning/error/confirm
          scrollable = true
        } = {}) {
          const vm = this
          return new Promise((resolve, reject) => {
            let el
            const dialog = vm.openDialog({
              title,
              width,
              okText,
              cancelText,
              loading: true,
              scrollable,
              render (h) {
                el = h('edit-view-form', {
                  style: { marginTop: '16px' },
                  props: editViewOptions
                })
                return el
              },
              async onOk () {
                const $Modal = this
                const form = el.componentInstance
                await form.save().then(() => {
                  resolve()
                  dialog.close()
                }, err => {
                  $Modal.buttonLoading = false
                  reject(err)
                })
              },
              onCancel: reject
            })
          })
        },
        async modalForm (formOptions, {
          title = '填写表单',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          scrollable = true
        } = {}) {
          const vm = this
          return new Promise((resolve, reject) => {
            let el
            const dialog = vm.openDialog({
              title,
              width,
              okText,
              cancelText,
              scrollable,
              render (h) {
                el = h('embed-form', {
                  style: { marginTop: '16px' },
                  props: formOptions
                })
                return el
              },
              async onOk () {
                const $form = el.componentInstance
                await $form.validate()
                const result = JSON.parse(JSON.stringify($form.item))
                resolve(result)
              },
              onCancel: reject
            })
          })
        }
      }
    })
  }
}
