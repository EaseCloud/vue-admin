export default {
  mobile (str) {
    return /^1[3456789]\d{9}$/
  },
  id_card (str) {
    const code = str.toString()

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    const pattern =
      /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

    // 判断格式是否正确
    if (!pattern.test(code)) return false

    // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
    // 详情查看javascript的数值范围
    // 加权因子
    const w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    // 校验码
    const checksum = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    let num = 0
    for (let i = 0; i < 17; i++) num = (num + code[i] * w[i]) % 11

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return code[17] === checksum[num]
  }
}
