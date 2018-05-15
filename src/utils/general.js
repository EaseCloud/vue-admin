// import config from '../config'
import dayjs from 'dayjs'

export default {
  dayjs,
  dateFormat (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).format(format)
  },
  /**
   * 终结计算一个项的值，接受可变参数 arguments 的传入
   * 1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
   * 2. 如果 term 为一个 Promise，直接返回
   * 3. 否则，返回 Promise.resolve(term)
   * @param term
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  async finalize (term) {
    if (!term) return term
    if (term instanceof Function) return this.finalize(term.apply(arguments.slice(1)))
    if (term.then instanceof Function) return term
    return term
  },
  /**
   * 对一个对象级联求值
   * 例如：
   *   evaluate({
   *     a { b: 'BINGO' }
   *   }, 'a.b')
   * 返回：'BINGO'
   * @param item Object
   * @param key String
   */
  evaluate (item, key) {
    // 缺省 key 的时候直接返回 item
    if (!key) return item
    // 执行级联求值
    let value = item
    key.split('.').forEach(k => {
      if (!k) return
      try {
        if (typeof value === 'undefined') value = null
        value = value && value[k]
      } catch (e) {
        console.error('evaluate 求值错误', e)
      }
    })
    return value
  }
}
