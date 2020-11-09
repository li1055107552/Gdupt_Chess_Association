/**
 * 用于登录验证
 * pages/login/login.js 中调用
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event) => {
  var number = Number(event.number)
  var password = String(event.password)
  const res = await db.collection("userList").where({ number: number }).get()
  if (res.data.length == 0) //用户不存在
    last = "N"
  else if (String(res.data[0].password) != password) //密码错误
    last = "F"
  else
    last = "T"

  return await last
}
