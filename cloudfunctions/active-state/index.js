// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  var id = event.id
  var enter = event.enter
  try {
    return await db.collection(enter).doc(id).update({
      data: {
        state: true
      }
    })
  }
  catch (e) {
    console.log(e)
  }
}