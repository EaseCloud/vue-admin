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
          return new ModalComponent({el, propsData: {options}})
        },
        /**
         * Promise 形式实现，类似于原生 confirm 方法
         * TODO: 实际上当
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
              width,
              content: message,
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
            const dialog = vm.openDialog({
              title,
              width,
              okText,
              cancelText,
              render (h) {
                return h('i-form', {
                  style: {marginTop: '16px'},
                  props: {labelPosition: 'top'}
                }, [h('form-item', {
                  props: {label: message}
                }, [h('i-input', {
                  props: {value, autofocus: true, placeholder},
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
                  style: {marginTop: '16px'},
                  props: editViewOptions
                })
                return el
              },
              async onOk () {
                const $form = el.componentInstance
                await $form.validate()
                const item = await $form.save()
                resolve(item)
                dialog.close()
              },
              async onCancel () {
                reject()
                dialog.close()
              }
            })
          })
        },
        async modalForm (formOptions, {
          title = '填写表单',
          width = 540,
          onOk = null,
          onCancel = null,
          okText = '确认',
          cancelText = '取消',
          scrollable = true,
          loading = false,
          item = null
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
              loading,
              render (h) {
                el = h('embed-form', {
                  style: {marginTop: '16px'},
                  props: formOptions,
                  noInit: !!item
                })
                if (item) {
                  vm.$nextTick(function () {
                    const $form = el.componentInstance
                    $form.setItem(item)
                  })
                }
                return el
              },
              async onOk () {
                const $form = el.componentInstance
                await $form.validate()
                let result = JSON.parse(JSON.stringify($form.item))
                // 支持自定义的异步处理函数
                result = onOk ? (await onOk(result, {dialog, resolve, reject})) : result
                if (!loading) resolve(result)
              },
              async onCancel () {
                const $form = el.componentInstance
                let result = JSON.parse(JSON.stringify($form.item))
                if (onCancel) await onCancel(result, {dialog, resolve, reject})
                if (!loading) reject()
              }
            })
          })
        },
        async pickFile (multi = false) {
          return new Promise((resolve, reject) => {
            const elFile = document.getElementById('_vue_admin_file_picker')
              || document.createElement('input')
            elFile.id = '_vue_admin_file_picker'
            elFile.setAttribute('type', 'file')
            elFile.setAttribute('style', 'opacity:0;position:absolute;z-index:0;left:0;top:0')
            elFile.value = null
            if (multi) elFile.setAttribute('multi', true)
            document.body.appendChild(elFile)
            elFile.onchange = event => {
              if (!event.target.files.length) reject()
              resolve(multi ? event.target.files : event.target.files[0])
            }
            elFile.click()
          })
        },
        async downloadFile (url, filename = '') {
          const a = document.createElement('a')
          a.href = url
          if (filename) a.download = filename
          a.click()
        }
      }
    })
  }
}
