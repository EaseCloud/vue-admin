// import config from '../config'
import _ from 'lodash'
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
   * @param args
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  async finalize (term, ...args) {
    if (!term) return term
    if (term instanceof Function) {
      return this.finalize(term.apply(this, args))
    }
    if (term.then instanceof Function) return term
    return term
  },
  /**
   * [同步调用版本，不支持 Promise]
   * 终结计算一个项的值，接受可变参数 arguments 的传入
   * 1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
   * 2. 否则，返回 Promise.resolve(term)
   * @param term
   * @param args
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  finalizeSync (term, ...args) {
    return term instanceof Function ? this.finalizeSync(term.apply(this, args)) : term
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
   * @param defaultValue 默认值，如果求值结果是 undefined，返回这个值
   */
  evaluate (item, key, defaultValue = void 0) {
    // 缺省 key 的时候直接返回 item
    if (!key) return item
    // 执行级联求值
    let value = item
    key.split('.').forEach(k => {
      if (!k) return
      try {
        if (value === void 0) value = void 0
        value = value && value[k]
      } catch (e) {
        console.error('evaluate 求值错误', e)
      }
    })
    return value === void 0 ? defaultValue : value
  },
  /**
   * 级联写入一个属性值，使用 vm.$set
   * 例如
   * @param item
   * @param key
   * @param value
   * @returns {*}
   */
  setProperty (item, key, value) {
    const vm = this
    // 缺省 keyStr 的时候直接返回 item
    if (!key) return item
    const index = key.indexOf('.')
    if (index > -1) {
      const k = key.substr(0, index)
      if (!item[k]) {
        if (vm.$set) {
          vm.$set(item, k, {})
        } else {
          item[k] = {}
        }
      }
      vm.setProperty(item[k], key.substr(index + 1), value)
    } else {
      if (vm.$set) {
        vm.$set(item, key, value)
      } else {
        item[key] = value
      }
    }
    return item
  },
  /**
   * 输出对象到 Console
   * @param obj
   * @param method
   */
  echo (obj, method = 'log') {
    console[method](obj)
  },
  async waitFor (item, key, timeout = 5000, interval = 50) {
    const vm = this
    const deadline = Date.now() + timeout
    return new Promise((resolve, reject) => {
      const check = () => {
        let value = item instanceof Function ? item.apply(vm, [key]) : vm.evaluate(item, key)
        if (value) resolve(value)
        if (Date.now() > deadline) reject(new Error('waitFor timed out'))
        setTimeout(check, interval)
      }
      check()
    })
  },
  wrapChoices (choices) {
    if (choices instanceof Array || !(choices instanceof Object)) return choices
    return _.map(choices, (value, key) => ({value: key, text: value}))
  },
  async doAction (action, args) {
    return action.apply(this, args)
  },
  /**
   * 刷新当前的组件，重新替换默认的 data
   */
  reinit () {
    const vm = this
    Object.assign(vm.$data, vm.$options.data.apply(vm))
  }
}
