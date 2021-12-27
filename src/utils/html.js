import moment from 'moment'
import config from '../config'

export default {
  setHtmlTitle (title) {
    window.document.title = title || config.name
  },
  i18nText (text) {
    return text && text.i18n ? window.app.$t(text) : text
  },
  /**
   * 输入一个日期，返回一个友好的时间显示（例如：刚刚/5分钟前）
   * @param dt
   * @param lang
   * @returns {string}
   */
  dateFromNow (dt, lang='zh-cn') {
    return moment(dt).locale(lang).fromNow()
  },
  /**
   * Strip tags from a html markup input string.
   * Example: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
   * https://stackoverflow.com/a/46483672/2544762
   * @param input
   * @param allowed
   * @returns {*}
   */
  stripTags (input, allowed) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
    const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
  }
}
