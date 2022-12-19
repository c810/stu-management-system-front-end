
/* export function checkTillNow(rule, value, callback) {
  var today = new Date()
  var todayNum = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate())
  var date = new Date(value)
  var dateNum = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
  var n = todayNum - dateNum
  if (!value) {
    return callback(new Error('请选择时间'))
  } else if (n < 0) {
    return callback(new Error('不能超过当前时间！'))
  } else {
    callback()
  }
}*/
// 校验QQ号码是否正确
export function checkQQNum(rule, value, callback) {
  const reg = /^[1-9][0-9]{4,10}$/
  if (!value) {
    return callback(new Error('请填写QQ号'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的QQ号码'))
  } else {
    callback()
  }
}
// 校验小数点后最多两位的数字
export function checkNumPot2(rule, value, callback) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请填写数字,最多2位小数'))
  } else {
    callback()
  }
}
// 校验内容是否为空
export function checkNull(rule, value, callback) {
  if (!value) {
    return callback(new Error('内容不能为空'))
  } else {
    callback()
  }
}
// 校验单选框是否为空
export function checkRadio(rule, value, callback) {
  if (value.length < 1) {
    return callback(new Error('必须选择一项'))
  } else {
    callback()
  }
}
// 校验单选框是否为空
export function checkSex(rule, value, callback) {
  if (value.length < 1) {
    return callback(new Error('请选择性别'))
  } else {
    callback()
  }
}
// 校验复选框是否为空
export function checkBoxNull(rule, value, callback) {
  if (value.length < 1) {
    return callback(new Error('请至少选择一项'))
  } else {
    callback()
  }
}
// 校验下拉框是否为空
export function checkSelect(rule, value, callback) {
  if (value.length < 1) {
    return callback(new Error('请下拉选择一项'))
  } else {
    callback()
  }
}
// 校验时间是否为空
export function checkTimeNull(rule, value, callback) {
  if (!value) {
    return callback(new Error('请选择时间'))
  } else {
    callback()
  }
}
// 校验时间是否大于当前时间
/* export function checkTillNow(rule, value, callback) {
  if (!value) {
    return callback(new Error('请选择时间'))
  } else if (value > Date.now()) {
    return callback(new Error('所选时间不能大于当前时间！'))
  } else {
    callback()
  }
}*/
// 校验6位数字验证码
export function checkVerCode(rule, value, callback) {
  const reg = /^\d{6}$/
  if (!value) {
    return callback(new Error('请填写验证码'))
  } else if (!reg.test(value)) {
    return callback(new Error('验证码必须为6位'))
  } else {
    callback()
  }
}
// 校验是否为有效身份证号（/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/）
export function checkIDNum(rule, value, callback) {
  const reg = /^[1-8]{2}[0-9]{4}[0-9]{4}((0[1-9]{1})|(1[0-2]{1}))((0[1-9]{1})|(1[0-9]{1})|(2[0-9]{1})|(3[0-1]{1}))[0-9]{3}[0-9xX]{1}$/
  if (!value) {
    return callback(new Error('请填写身份证号码'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入有效的身份证号码'))
  } else {
    callback()
  }
}
// 校验是否为正整数
export function checkInterNum(rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写整数'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
// 校验是否为至少6位的正整数
export function checkLeastNum(rule, value, callback) {
  const reg = /^\d{n,}$/
  if (!value) {
    return callback(new Error('请填写不少于6位的数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('数字必须多于6位'))
  } else {
    callback()
  }
}
// 校验是否为数字（含正数、负数、0）
export function checkNum(rule, value, callback) {
  const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入数字'))
  } else {
    callback()
  }
}
// 校验money的数目
export function checkMoney(rule, value, callback) {
  const reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/
  if (!value) {
    return callback(new Error('请填写金额'))
  } else if (!reg.test(value)) {
    return callback(new Error('金额的小数位数不超过两位'))
  } else {
    callback()
  }
}
// 校验输入是否为汉字
export function checkCharacter(rule, value, callback) {
  const reg = /^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    return callback(new Error('请填写汉字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入汉字'))
  } else {
    callback()
  }
}
// 校验输入是否为英文和数字
export function checkWordsNum(rule, value, callback) {
  const reg = /^[A-Za-z0-9]+$ 或 ^[A-Za-z0-9]{4,40}$/
  if (!value) {
    return callback(new Error('请填写字母和数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入字母和数字'))
  } else {
    callback()
  }
}
// 校验输入长度是否大于6且少于20
export function checkTwenty(rule, value, callback) {
  const reg = /^.{6,20}$/
  if (!value) {
    return callback(new Error('请填写6-20位数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('数字位数必 须在6-20之间'))
  } else {
    callback()
  }
}
// 校验是否符合密码格式
export function checkPassword(rule, value, callback) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/
  if (!value) {
    return callback(new Error('请填写6-18位密码'))
  } else if (!reg.test(value)) {
    return callback(new Error('密码长度6-18位，必须包含数字和字母，可以包含特殊符号'))
  } else {
    callback()
  }
}

export function checkEmail(rule, value, callback) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!value) {
    return callback(new Error('请填写邮箱'))
  } else if (!reg.test(value)) {
    return callback(new Error('邮箱格式错误'))
  } else {
    callback()
  }
}
// 校验电话号码的格式
export function checkPhone(rule, value, callback) {
  const reg = /^[1][3578][0-9]{9}$/
  if (!value) {
    return callback(new Error('手机号码不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的大陆11位手机号码'))
  } else {
    callback()
  }
}
// 校验年龄的范围
export function checkAge(rule, value, callback) {
  const reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
  if (!value) {
    return callback(new Error('年龄不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入0-120之间的整数'))
  } else {
    callback()
  }
}
export function checkUsername(rule, value, callback) {
  const reg = /^[a-zA-Z0-9_]{4,16}$/
  if (!value) {
    return callback(new Error('用户名不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入4-16位字母、数字或下划线'))
  } else {
    callback()
  }
}
export default {
  QQNum: [{ required: true, validator: checkQQNum, trigger: 'blur' }], // QQ号码
  numPot2: [{ required: true, validator: checkNumPot2, trigger: 'blur' }], // 小数点后两位
  isNull: [{ required: true, validator: checkNull, trigger: 'blur' }], // 为空
  box: [{ required: true, validator: checkBoxNull, trigger: 'blur' }], // 复选框
  radio: [{ required: true, validator: checkRadio, trigger: 'blur' }], // 单选框
  sex: [{ required: true, validator: checkSex, trigger: 'blur' }], // 性别
  select: [{ required: true, validator: checkSelect, trigger: 'blur' }], // 下拉框
  time: [{ required: true, validator: checkTimeNull, trigger: 'blur' }], // 时间是否为空
  verCode: [{ required: true, validator: checkVerCode, trigger: 'blur' }], // 验证码
  IDNum: [{ required: true, validator: checkIDNum, trigger: 'blur' }], // 身份证号码
  interNum: [{ required: true, validator: checkInterNum, trigger: 'blur' }], // 是否为正整数，包含0
  leastNum: [{ required: true, validator: checkLeastNum, trigger: 'blur' }], // 是否为不小于6位的正整数，包含多个0
  isNum: [{ required: true, validator: checkNum, trigger: 'blur' }], // 是否为数字,包含正数，0，负数，小数
  phone: [{ required: true, validator: checkPhone, trigger: 'blur' }], // 电话号码
  money: [{ required: true, validator: checkMoney, trigger: 'blur' }], // 金额，小数点后最多两位
  character: [{ required: true, validator: checkCharacter, trigger: 'blur' }], // 汉字
  wordsNum: [{ required: true, validator: checkWordsNum, trigger: 'blur' }], // 字母和数字
  twenty: [{ required: true, validator: checkTwenty, trigger: 'blur' }], // 6-20位数字
  password: [{ required: true, validator: checkPassword, trigger: 'blur' }], // 6-18位密码，必须含字母数字，可以含特殊字符
  email: [{ required: true, validator: checkEmail, trigger: 'blur' }], // 邮箱
  age: [{ required: true, validator: checkAge, trigger: 'blur' }] // 年龄
}
