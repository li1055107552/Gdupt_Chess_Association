// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('userList').add({
    data:{
      _id:event.name,
      _openid:wxContext.OPENID,
      nickname:event.nickname,
      name:event.name,
      number:event.number,
      tel:event.tel,
      campus:event.campus,
      institute:event.institute,
      major:event.major,
      classname:event.classname,
      password:event.password,
      type:event.type,
      time:event.time
    }
  })
}