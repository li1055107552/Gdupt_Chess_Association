// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const time = Number(new Date().getTime())

// 云函数入口函数
exports.main = async (event, context) => {
  return "test success"
 
  // var rs = await db.collection("active").where({
  //   "who":_.eq("member"),       //类型
  //   "enterStart":_.lte(time),   // 开始报名时间 < 当前时间
  //   "enterEnd":_.gte(time)      // 当前时间 < 结束报名时间
  // }).count()
  // var total = rs.total
  // return  total
  // const wxContext = cloud.getWXContext()
  // return await db.collection('userList').add({
  //   data:{
  //     _id:event.name,
  //     _openid:wxContext.OPENID,
  //     nickname:event.nickname,
  //     name:event.name,
  //     number:event.number,
  //     tel:event.tel,
  //     campus:event.campus,
  //     institute:event.institute,
  //     major:event.major,
  //     classname:event.classname,
  //     password:event.password,
  //     type:event.type,
  //     time:event.time
  //   }
  // })
}