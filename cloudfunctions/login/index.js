/**
 * 用于登录验证
 * pages/login/login.js 中调用
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event) => {
  switch(event.action){
    case "login":    return await login(event)
    case "trylogin": return await trylogin(event)
  }
}

async function login(event){
  const wxContext = cloud.getWXContext()
  var number = Number(event.number)
  var password = String(event.password)
  const res = await db.collection("userList").where({ number: number }).get()
  if (res.data.length == 0) //用户不存在
    last = "N"
  else if (String(res.data[0].password) != password) //密码错误
    last = "F"
  else {
    await db.collection("userList").where({ number: number }).update({
      data:{
        _openid:wxContext.OPENID
      }
    })
    last = "T"
  }

  return await last
}

async function trylogin(event) {
  const wxContext = cloud.getWXContext()
  const res = await db.collection("userList").where({ _openid: wxContext.OPENID }).get()
  if(res.data.length == 1 ){
    if(res.data[0].type != 'admin'){
      var rs = {
        number:res.data[0].number,
        nickname:res.data[0].nickname
      }
      return rs
    }
    else
      return false
  }
  else
    return false
}
