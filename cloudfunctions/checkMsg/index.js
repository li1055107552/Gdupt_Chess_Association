/**
 *  用来检测某一值是否存在
 *  接受三个参数： 字段名：type
 *                查询的信息：msg
 *                集合名称： collectName
 * 
 * 返回该查询结果的总数total
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var type = event.type //字段名
  var msg = event.msg   //查询的信息
  var collectName = event.collectName //集合名称

  const res = await db.collection(collectName).where({
    [type]:_.eq(msg)
  }).count()
   return await res.total
}