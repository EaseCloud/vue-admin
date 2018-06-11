import HtmlViewer from './HtmlViewer.vue'

const el = document.createElement('div')
el.innerHTML = '<html-viewer></html-viewer>'
document.body.appendChild(el)

export default {
  install (Vue) {
    const HtmlViewerComponent = Vue.extend(HtmlViewer)
    const htmlViewer = new HtmlViewerComponent({ el })
    Vue.mixin({
      components: { HtmlViewer },
      computed: {},
      methods: {
        previewHtml (url, width = 375, height = 667) {
          htmlViewer.url = url
          htmlViewer.width = width
          htmlViewer.height = height
        }
      }
    })
  }
}
