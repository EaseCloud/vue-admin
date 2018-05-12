import config from '../config'

export default {
  setHtmlTitle (title) {
    window.document.title = title || config.name
  },
  i18nText (text) {
    return text && text.i18n ? window.app.$t(text) : text
  }
}
