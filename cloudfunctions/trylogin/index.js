/**
 * 用于尝试一键登录 
 * pages/login/login.js  中调用
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  wxContext.OPENID
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