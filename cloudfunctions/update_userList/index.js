/**
 * 用于更新用户的某一个字段
 * 调用：
 *  pages/page_general/usermsg.js
 *  pages/page_admin/my/usermsg/usermsg.js
 *  pages/page_admin/manage/changeType/changeType.js
 * 
 * 接收参数：
 *    唯一id:id
 *    字段:key
 *    值:data
 * 
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {

  return await db.collection("userList").doc(event.id).update({
    data:{
      [event.key]:event.data
    }
  })

}