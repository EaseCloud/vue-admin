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
         * @param actions
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
          actions = [],
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
              supportEnter: true,
              actions,
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
          type = 'text',
          placeholder = '',
          supportEnter = true,
          actions = []
        } = {}) {
          const vm = this
          let value = defaultValue
          let $input
          const promise = new Promise((resolve, reject) => {
            vm.openDialog({
              title,
              width,
              okText,
              cancelText,
              supportEnter,
              actions,
              render (h) {
                $input = h('i-input', {
                  props: {value, placeholder, type},
                  on: {
                    input (val) {
                      value = val
                    }
                  }
                })
                return h('i-form', {
                  style: {marginTop: '16px'},
                  props: {labelPosition: 'top'}
                }, [h('form-item', {props: {label: message}}, [$input])])
              },
              onOk: () => resolve(value),
              onCancel: reject
            })
          })
          // 打开提示框之后马上获取焦点
          vm.$nextTick(() => $input.componentInstance.focus())
          return promise
        },
        async modalEditView (editViewOptions, {
          title = '编辑模型',
          width = 540,
          okText = '确认',
          cancelText = '取消',
          deleteText = '删除',
          scrollable = true,
          canDelete = false,
          actions = [],
          dialogOptions = {}
        } = {}) {
          const vm = this
          // 把 editViewOptions 转换成 Vue 的响应式对象，否则 Vue 不会检测到 options 的更新
          Vue.observable(editViewOptions)
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
                dialog.close()
                reject()
              },
              actions: [...actions, {
                label: deleteText,
                buttonType: 'error',
                position: 'start',
                display: canDelete,
                async action () {
                  await vm.$confirm('确定删除？', {width: 350})
                  await el.componentInstance.deleteItem()
                  resolve(null)
                  dialog.close()
                }
              }],
              ...dialogOptions
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
          item = null,
          maskClosable = true,
          actions = []
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
              maskClosable,
              actions,
              render (h) {
                el = h('embed-form', {
                  style: {marginTop: '16px'},
                  props: {
                    ...formOptions,
                    noInit: !!item
                  },
                  on: {
                    init () {
                      const $form = el.componentInstance
                      $form.setItem(item)
                    }
                  }
                })
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
        async pickFile (multi = false, accept = '*') {
          return new Promise((resolve, reject) => {
            const elFile = document.getElementById('_vue_admin_file_picker')
              || document.createElement('input')
            elFile.id = '_vue_admin_file_picker'
            elFile.setAttribute('type', 'file')
            elFile.setAttribute('accept', accept)
            elFile.setAttribute('style', 'opacity:0;position:absolute;z-index:-1;left:0;top:0')
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
