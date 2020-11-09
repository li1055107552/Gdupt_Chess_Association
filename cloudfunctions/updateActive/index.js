/**
 * 用于更新活动设置
 * 调用：
 *    pages/page_admin/active/change/change.js
 * 
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  switch(event.action){
    case "get":{
      return getactive(event)
    }
    case "update":{
      await active(event)
      await overview(event)
      await create(event)
      return "finish"
    }
  }
}

// 获取活动信息
async function getactive(event){
  var result = await db.collection('active').where({ 
    activeCode:event.msg
  }).get()
  if(result.data.length != 0){
    return{
      length:1,
      data:await result.data[0]
    }
  }
  else
    return {
      length:0
    }
}

// 更新总览表记录
async function active(event) {         //更新活动
  await db.collection('active').doc(event.id).update({
    data: {
      lastChangeAdmin: event.admin,         //操作者
      lastChangeTime: db.serverDate(),      //最后修改时间
      activeName: event.activeName,         //活动名称
      activeArea: event.activeArea,         //活动地点
      /* 时间 */
      raceStart:  event.raceStart,    //比赛开始时间
      raceEnd:    event.raceEnd,      //比赛结束时间
      enterStart: event.enterStart,   //报名开始时间
      enterEnd:   event.enterEnd,     //报名结束时间
      /* 状态 */
      state: event.state,             //活动状态
      who: event.who,                 //活动对象
      state_enter:  Boolean(event.state_enter),    //报名状态
      state_clock:  Boolean(event.state_clock),    //打卡状态
    }
  })
}

async function create(event) {         //更新集合信息
  await db.collection("A" + event.activeCode).doc("first").update({
    data: {
      lastChangeAdmin: event.admin,         //操作者
      lastChangeTime: db.serverDate(),      //最后修改时间
      activeName: event.activeName,         //活动名称
      activeArea: event.activeArea,         //活动地点
      /* 时间 */
      raceStart:  event.raceStart,    //比赛开始时间
      raceEnd:    event.raceEnd,      //比赛结束时间
      enterStart: event.enterStart,   //报名开始时间
      enterEnd:   event.enterEnd,     //报名结束时间
      /* 状态 */
      state: event.state,             //活动状态
      who: event.who,                 //活动对象
      state_enter: Boolean(event.state_enter),    //报名状态
      state_clock: Boolean(event.state_clock),    //打卡状态
    }
  })
}

async function overview(event) {       //更新总览目录
  // 获取活动总览里的活动列表
  var overview = await db.collection('active').doc('overview').get()
  overview = overview.data.ActiveOverview
  // 找出该活动所在的数组下标
  for (let i = 0; i < overview.length; i++) {
    if(overview[i].activeCode == event.activeCode){
      var index = i
      break
    }
  }
  var key = "ActiveOverview." + index + ".activeName"
  db.collection('active').doc('overview').update({
    data:{
      [key]:event.activeName
    }
  })

}


