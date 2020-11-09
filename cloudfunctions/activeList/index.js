/**
 * 用于获取对应用户 可报名的活动列表
 * pages/active/active.js 中调用
 * 
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const time = Number(new Date().getTime())

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  var data;
  switch(event.type){
    case "member":    data = await member();    break;
    case "vip":       data = await vip();       break;
    case "secretary": data = await secretary(); break;
    case "admin":     data = await secretary(); break;
  }

  return await data
}

async function member(event){
  // 获取总数
  const rs = await db.collection("active").where({
    "who":_.eq("member"),       //类型
    "enterStart":_.lte(time),   // 开始报名时间 < 当前时间
    "enterEnd":_.gte(time)      // 当前时间 < 结束报名时间
  }).count()
  const total = rs.total
  if (total == 0) {
    return {
      length:0
    }
  }
  else{
    // 计算取得次数
    const batchTimes = Math.ceil(total / 100)

    // 获取数据
    const task = []
    for(let i = 0; i < batchTimes; i++){
      const promise = await db.collection("active").where({
        "who":_.eq("member"),       // 类型 == member（全校师生）
        "enterStart":_.lte(time),   // 开始报名时间 < 当前时间
        "enterEnd":_.gte(time)       // 当前时间 < 结束报名时间
      }).get()
      task.push(promise)
    }
    // 等待所有并返回
    return (await Promise.all(task)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }
  

}

async function vip(event){
  // 获取总数
  const rs = await db.collection("active").where({
    "who":_.eq("member").or(_.eq("vip")),       //类型
    "enterStart":_.lte(time),
    "enterEnd":_.gte(time)
  }).count()
  const total = rs.total
  if (total == 0) {
    return {
      length:0
    }
  }
  else{
    // 计算取得次数
    const batchTimes = Math.ceil(total / 100)

    // 获取数据
    const task = []
    for(let i = 0; i < batchTimes; i++){
      const promise = await db.collection("active").where({
        "who":_.eq("member").or(_.eq("vip")),       //类型
        "enterStart":_.lte(time),
        "enterEnd":_.gte(time)
      }).get()
      task.push(promise)
    }
    
    // 等待所有并返回
    return (await Promise.all(task)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }

}

async function secretary(event){
  // 获取总数
  const rs = await db.collection("active").where({
    "who":_.eq("member").or(_.eq("vip")).or(_.eq("secretary")),       //类型
    "enterStart":_.lte(time),
    "enterEnd":_.gte(time)
  }).count()
  const total = rs.total
  if (total == 0) {
    return {
      length:0
    }
  }
  else{
    // 计算取得次数
    const batchTimes = Math.ceil(total / 100)

    // 获取数据
    const task = []
    for(let i = 0; i < batchTimes; i++){
      const promise = await db.collection("active").where({
        "who":_.eq("member").or(_.eq("vip")).or(_.eq("secretary")),      //类型
        "enterStart":_.lte(time),
        "enterEnd":_.gte(time)
      }).get()
      task.push(promise)
    }
    
    // 等待所有并返回
    return (await Promise.all(task)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }
  

}