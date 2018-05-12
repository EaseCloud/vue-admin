// import config from '../config'

export default {
  /**
   * 终结计算一个项的值，接受可变参数 arguments 的传入
   * 1. 如果 term 为函数，调用函数（传入 arguments 的后续变量），然后递归调用 finalize
   * 2. 如果 term 为一个 Promise，直接返回
   * 3. 否则，返回 Promise.resolve(term)
   * @param term
   * @returns Promise<Any> 获取最终结果的 Promise，不保证同步
   */
  finalize (term) {
    if (!term) return Promise.resolve(term)
    if (term instanceof Function) return this.finalize(term.apply(arguments.slice(1)))
    if (term.then instanceof Function) return term
    return Promise.resolve(term)
  }
}
