/**
 * 用户活动打卡
 * 调用：
 *    pages/page_general/clock/clock.js
 * 
 * 参数：
 *    type: “getmsg”:获取活动数据   “updata”:打卡并更新数据
 *    activeCode：活动编码
 *    number:学号
 *    index:处于个人历史的下标
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
var code

// 云函数入口函数
exports.main = async (event) => {
  switch(event.type){
    case "getmsg":{
      return await checkmsg(event)
    }
    case "update":{
      await Uactive(event)
      await Upeople(event)
      return "finish"
    } 
  }

  return "finish"
}

async function checkmsg(event){

  var total = await cloud.callFunction({
    name:"checkMsg",
    data:{
      collectName:"A" + event.activeCode,
      type:"number",
      msg:event.number
    }
  })
  if(total.result == 0)
    return false
  else
    return await getmsg(event)
}

async function getmsg(event){
  var active = await db.collection("A" + event.activeCode).doc('first').get()
  var person = await db.collection("A" + event.activeCode).where({ number:event.number }).get()
  var history = await db.collection('userList').where({ number:event.number }).get()
  active = active.data
  person = person.data[0]
  history = history.data[0].history
  var length = history.length
  return {
    active,
    person,
    history,
    length
  }
}

// 该活动的集合 首条记录 打卡人数自增1 
// 该活动下的个人记录 已报名--→已签到
async function Uactive(event){
  //活动集合
  await db.collection("A" + event.activeCode).doc('first').update({
    data:{
      clocked:_.inc(1)
    }
  })
  //活动总览
  await db.collection('active').doc(event.activeCode).update({
    data:{
      clocked:_.inc(1)
    }
  })
  //更新活动集合中的个人state
  await db.collection("A" + event.activeCode).where({ number:event.number }).update({
    data:{
      state:"已签到"
    }
  })
}

//更新个人活动历史中
async function Upeople(event){
  var key = "history." + event.index + ".state"
  await db.collection('userList').where({ 
    number:event.number 
  }).update({
    data:{
      [key]:"已签到"
    }
  })
}