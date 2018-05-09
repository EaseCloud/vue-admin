import config from '../config'

export default {
  setTitle (title) {
    window.document.title = title || config.name
  }
}
