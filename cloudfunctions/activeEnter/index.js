/**
 * 用于活动报名
 * 调用：
 *    pages/active/active.js
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  await input(event)
  await selfinc(event)
  await history(event)
  return 'finish'
}

//写入该活动集合
async function input(event){
  const wxContext = cloud.getWXContext()
  var enter = "A" + event.activeCode   //集合名称

  await db.collection(enter).add({
    data: {
      _openid:wxContext.OPENID,
      _id: new Date(event.time).getTime() + event.number,
      name: event.name,
      tel: event.teltel,
      number: event.number,
      campus: event.campus,
      institute: event.institute,
      major: event.major,
      classname: event.classname,
      remark: event.remark,
      type: event.type,
      time: event.time,
      code: event.code,
      state: '已报名'
    }
  })
}

//相应的集合 报名人数自增
async function selfinc(event){
  var enter = "A" + event.activeCode

  await db.collection(enter).where({ activeCode:event.activeCode}).update({
    data:{
      enrolment:_.inc(1)
    }
  })

  await db.collection('active').where({ activeCode:event.activeCode}).update({
    data:{
      enrolment:_.inc(1)
    }
  })

  return 'finish'
}

//写入该人的历史记录中
async function history(event){
  var actived = ({
    activeName:event.activeName,
    activeCode:event.activeCode,
    state:'已报名',
    time:event.time
  })
  await db.collection("userList").where({ number: event.number}).update({
    data:{
      history:db.command.push(actived)
    }
  })
}