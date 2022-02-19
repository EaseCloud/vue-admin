import _ from 'lodash'

/**
 *@description 观察者模式 全局监听富文本编辑器
 */
export const QuillWatch = {
  watcher: {},  // 登记编辑器信息
  active: null,  // 当前触发的编辑器
  on: function (imageExtendId, ImageExtend) {  // 登记注册使用了ImageExtend的编辑器
    if (!this.watcher[imageExtendId]) {
      this.watcher[imageExtendId] = ImageExtend
    }
  },
  emit: function (activeId, type = 1) {  // 事件发射触发
    this.active = this.watcher[activeId]
    if (type === 1) {
      imgHandler()
    }
  }
}

/**
 * @description 图片功能拓展： 增加上传 拖动 复制
 */
export class ImageExtend {
  /**
   * @param quill {Quill}富文本实例
   * @param config {Object} options
   * config  keys: action, headers, editForm start end error  size response
   */
  constructor (quill, config = {}) {
    const self = this
    window.quill = quill
    window.ext = self
    self.id = Math.random()
    self.quill = quill
    self.quill.id = self.id
    self.config = config
    self.file = ''  // 要上传的图片
    self.imgURL = ''  // 图片地址
    self.selection = null
    // https://quilljs.com/docs/api/#editor-change
    // quill.on('editor-change', function (eventName, ...args) {
    //   console.log('editor-change', eventName, args)
    //   console.log('select', quill.getSelection())
    //   self.selection = quill.getSelection() || self.selection
    // })
    quill.root.addEventListener('paste', self.pasteHandle.bind(self), false)
    quill.root.addEventListener('drop', self.dropHandle.bind(self), false)
    quill.root.addEventListener('dropover', function (e) {
      e.preventDefault()
    }, false)
    self.cursorIndex = 0
    QuillWatch.on(self.id, self)
  }

  /**
   * 处理粘贴事件，几种情况
   * 1. 粘贴截图，仅有一个元素：
   *    dataTransfer.items = [{kind: 'file', type: 'image/png'}]
   * 2. 粘贴多个文件，几个文件就有几个元素，全部的 kind 都是 file：
   *    dataTransfer.item = [{kind: 'file', type: '实际MIMIE'}, ...]
   * 3. 粘贴纯文本，仅有一个元素：
   *    dataTransfer.item = [{kind: 'string', type: 'text/plain'}]
   * 4. 粘贴富文本内容（网页内容），有且仅有两个元素：
   *    dataTransfer.item = [{kind: 'string', type: 'text/plain'},
   *                         {kind: 'string', type: 'text/html'}]
   *    4.1. 第一个为 html 内容强制转换为纯文本的内容结果
   *    4.2. 第二个为 html 内容的 Markup
   * 5. 粘贴RTF内容（Word内容），有且仅有三个元素：
   *    dataTransfer.item = [{kind: 'string', type: 'text/plain'},
   *                         {kind: 'string', type: 'text/html'},
   *                         {kind: 'string', type: 'text/rtf'}]
   *    5.1. 第一个为 html 内容强制转换为纯文本的内容结果
   *    5.2. 第二个为 html 内容的 Markup（一个 html markup，但是标签好怪）
   *    5.3. 第三个为 RTF 实际内容为一个 rtf 文件的 markup（不懂不处理）
   * 6. 粘贴RTF内容（Excel内容），有且仅有四个元素：
   *    dataTransfer.item = [{kind: 'string', type: 'text/plain'},
   *                         {kind: 'string', type: 'text/html'},
   *                         {kind: 'string', type: 'text/rtf'},
   *                         {kind: 'file', type: 'image/png'}]
   *    6.1. 第一个为 html 内容强制转换为纯文本的内容结果
   *    6.2. 第二个为 html 内容的 Markup（一个 html markup，格式：html.head.style/html.body.table）
   *    6.3. 第三个为 RTF 实际内容为一个 rtf 文件的 markup（不懂不处理）
   *    6.4. 第四个为图片，应该是 Excel 的选中区域截图
   * 获取内容几种情况：
   * 1. 如果是文件，通过 dataTransfer.items[i].getAsFile()
   * 2. 如果是其他类型内容，通过 dataTransfer.getData(dataTransfer.items[i].type)
   *
   * @param e
   * @param dataTransfer
   */
  handleData (e, dataTransfer) {
    // console.log('>>> handleData')
    let self = this
    QuillWatch.emit(self.quill.id, 0)
    if (!dataTransfer.items.length) return
    // 第一第二种粘贴图片的分支
    // TODO: 可以考虑集成文件的上传
    if (dataTransfer.items[0].kind === 'file') {
      _.forEach(dataTransfer.items, item => {
        if (item.kind === 'file' && item.type.match(/^image\//i)) {
          self.file = item.getAsFile()
          // 如果图片限制大小
          if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
            if (self.config.sizeError) {
              self.config.sizeError()
            }
            return
          }
          if (self.config.action) {
            self.uploadImg()
          } else {
            self.toBase64()
          }
        }
        e.preventDefault()
      })
    } else if (dataTransfer.items[0].kind === 'string') {
      // TODO: 精细化的复合处理
      // 可以预期的第三第四第五种情况
      self.quill.insertText(self.selection.index, dataTransfer.getData(items[0].type))
      e.preventDefault()
    } else {
      // TODO: 未预期的其他情况，直接默认处理
    }
  }

  /**
   * @description 粘贴
   * @param e
   */
  pasteHandle (e) {
    // console.log('>>> pasteHandle')
    this.handleData(e, e.clipboardData)
  }

  /**
   * 拖拽
   * @param e
   */
  dropHandle (e) {
    // console.log('>>> dropHandle')
    this.handleData(e, e.dataTransfer)
  }

  /**
   * @description 将图片转为base4
   */
  toBase64 () {
    // console.log('>>> toBase64')
    const self = this
    const reader = new FileReader()
    reader.onload = (e) => {
      // 返回base64
      self.imgURL = e.target.result
      self.insertImg()
    }
    reader.readAsDataURL(self.file)
  }

  /**
   * @description 上传图片到服务器
   */
  uploadImg () {
    // console.log('>>> uploadImg')
    const self = this
    let quillLoading = self.quillLoading
    let config = self.config
    // 构造表单
    let formData = new FormData()
    formData.append(config.name, self.file)
    // 自定义修改表单
    if (config.editForm) {
      config.editForm(formData)
    }
    // 创建ajax请求
    let xhr = new XMLHttpRequest()
    xhr.open('post', config.action, true)
    // 如果有设置请求头
    if (config.headers) {
      config.headers(xhr)
    }
    if (config.change) {
      config.change(xhr, formData)
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          //success
          let res = JSON.parse(xhr.responseText)
          self.imgURL = config.response(res)
          QuillWatch.active.uploadSuccess()
          self.insertImg()
          if (self.config.success) {
            self.config.success()
          }
        } else {
          //error
          if (self.config.error) {
            self.config.error()
          }
          QuillWatch.active.uploadError()
        }
      }
    }
    // 开始上传数据
    xhr.upload.onloadstart = function (e) {
      QuillWatch.active.uploading()
      if (config.start) {
        config.start()
      }
    }
    // 上传过程
    xhr.upload.onprogress = function (e) {
      let complete = (e.loaded / e.total * 100 | 0) + '%'
      QuillWatch.active.progress(complete)
    }
    // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
    xhr.upload.onerror = function (e) {
      QuillWatch.active.uploadError()
      if (config.error) {
        config.error()
      }
    }
    // 上传数据完成（成功或者失败）时会触发
    xhr.upload.onloadend = function (e) {
      if (config.end) {
        config.end()
      }
    }
    xhr.send(formData)
  }

  /**
   * @description 往富文本编辑器插入图片
   */
  insertImg () {
    // console.log('>>> insertImg')
    const self = QuillWatch.active
    const selection = self.quill.getSelection()
    self.quill.insertEmbed(selection.index, 'image', self.imgURL)
    self.quill.update()
    // self.quill.setSelection(self.cursorIndex + 1);
    self.quill.setSelection(selection.index + 1);
  }

  /**
   * @description 显示上传的进度
   */
  progress (pro) {
    // console.log('>>> progress')
    // 下面这句 replace 会干扰 selection，还不如干掉
    // pro = '[' + 'uploading' + pro + ']'
    // QuillWatch.active.quill.root.innerHTML
    //   = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, pro)
  }

  /**
   * 开始上传
   */
  uploading () {
    // console.log('>>> uploading')
    // 下面这句 replace 会干扰 selection，还不如干掉
    // let length = (QuillWatch.active.quill.getSelection() || {}).index || QuillWatch.active.quill.getLength()
    // QuillWatch.active.cursorIndex = length
    // QuillWatch.active.quill.insertText(QuillWatch.active.cursorIndex, '[uploading...]', {'color': 'red'}, true)
    // const self = QuillWatch.active
    // self.quill.insertText(self.selection.index, '[uploading...]', {'color': 'red'}, true)
  }

  /**
   * 上传失败
   */
  uploadError () {
    // console.log('>>> uploadError')
    // TODO: 插入位置处理有问题
    // const self = QuillWatch.active
    // self.quill.root.innerHTML
    //   = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, '[upload error]')
  }

  uploadSuccess () {
    // console.log('>>> uploadSuccess')
    // TODO: 插入位置处理有问题
    // const self = QuillWatch.active
    // self.quill.root.innerHTML
    //   = QuillWatch.active.quill.root.innerHTML.replace(/\[uploading.*?\]/, '')
  }
}

/**
 * @description 点击图片上传
 */
export function imgHandler () {
  // console.log('>>> imgHandler')
  let fileInput = document.querySelector('.quill-image-input');
  if (fileInput === null) {
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    fileInput.classList.add('quill-image-input');
    fileInput.style.display = 'none'
    // 监听选择文件
    fileInput.addEventListener('change', function () {
      let self = QuillWatch.active
      self.file = fileInput.files[0]
      fileInput.value = ''
      // 如果图片限制大小
      if (self.config.size && self.file.size >= self.config.size * 1024 * 1024) {
        if (self.config.sizeError) {
          self.config.sizeError()
        }
        return
      }
      if (self.config.action) {
        self.uploadImg()
      } else {
        self.toBase64()
      }
    })
    document.body.appendChild(fileInput);
  }
  fileInput.click();
}

/**
 *@description 全部工具栏
 */
export const container = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{'header': 1}, {'header': 2}],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],
  [{'direction': 'rtl'}],
  [{'size': ['small', false, 'large', 'huge']}],
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['clean'],
  ['link', 'image', 'video']
]



