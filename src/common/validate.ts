// 用户名验证
export function usernameValidater(rule: any, value: string, callback: Function): void {
  if (!value) {
    callback(new Error('用户名不能为空'))
  } else if (!/^[a-zA-Z]{1}\w{5,15}$/.test(value)) {
    callback(new Error('请输入6-16位以字母开头的字母或数字'))
  } else {
    callback()
  }
}
// 密码验证
export function passwordValidater(rule: any, value: string, callback: Function): void {
  if (!value) {
    callback(new Error('密码不能为空'))
  } else if (/[\u4e00-\u9fa5]+/.test(value)) {
    callback(new Error('密码不能为汉字'))
  } else if (value.length > 16 || value.length < 6) {
    callback(new Error(`输入长度限制在6-16个字符内`))
  } else {
    callback()
  }
}
