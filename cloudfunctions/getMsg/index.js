/**
 * 用于获取一个集合/一条记录信息
 *    
 * 调用：
 *    pages/page_admin/active/change/change.js
 *    pages/page_admin/active/QRcode/QRcode.js
 * 
 * 字段名：
 *    action: 获取一条记录"single"、获取一个集合"batch"
 *    collectName:集合名称
 *    key:字段名
 *    msg:信息
 * 
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.action){
    case "single":{
      return await getSingle(event)
    }
    case "batch":{
      return await getBatch(event)
    }
  }

}

// 获取一条记录的数据
async function getSingle(event){
  var result = await db.collection(event.collectName).where({ 
    [event.key]:event.msg
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

// 获取一个集合的数据
async function getBatch(event){
  const countResult = await db.collection(event.collectName).count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)

  const tasks = []
  for(let i = 0;i < batchTimes; i++){
    const promise = await db.collection(event.collectName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc,cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg:acc.errMsg,
      length:total
    }
  })

}