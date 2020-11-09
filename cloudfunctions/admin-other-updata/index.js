// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case 'update_name': {
      return name(event)
    }
    case 'update_school': {
      return school(event)
    }
    case 'update_classname': {
      return classname(event)
    }
    case 'update_type':{
      return type(event)
    }
    default: {
      return
    }
  }
}

  async function name(event) {
    var id = event.id
    var enter = event.enter
    var name = event.name
    try {
      return await db.collection(enter).doc(id).update({
        data: {
          name: name
        }
      })
    }
    catch (e) {
      console.log(e)
    }
}

  async function school(event) {
    var id = event.id
    var enter = event.enter
    var school = event.school
    try {
      return await db.collection(enter).doc(id).update({
        data: {
          school: school
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  async function classname(event) {
    var id = event.id
    var enter = event.enter
    var classname = event.classname
    try {
      return await db.collection(enter).doc(id).update({
        data: {
          classname: classname
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  async function type(event) {
    var id = event.id
    var enter = event.enter
    var type = event.type
    try {
      return await db.collection(enter).doc(id).update({
        data: {
          type: type
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }
