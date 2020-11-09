//admin活动创建

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  await active(event)
  await overview(event)
  await create(event)
  return "finish"
}

async function active(event) {            //更新活动
  var id = event.id
  db.collection('active').doc(id).update({
    data: {
      lastChangeAdmin: event.Admin,         //操作者
      lastChangeTime: db.serverDate(),      //最后修改时间
      ActiveName: event.ActiveName,         //活动名称
      ActiveArea: event.ActiveArea,         //活动地点
      /* 时间 */
      RaceStart:  new Date(event.RaceStart),    //比赛开始时间
      RaceEnd:    new Date(event.RaceEnd),      //比赛结束时间
      EnterStart: new Date(event.EnterStart),   //报名开始时间
      EnterEnd:   new Date(event.EnterEnd),     //报名结束时间
      /* 状态 */
      state: event.state,             //活动状态
      who: event.who,                 //活动对象
      state_enter:  Boolean(event.state_enter),    //报名状态
      state_clock:  Boolean(event.state_clock),    //打卡状态
      memberIsCode: Boolean(event.memberIsCode),   //非会员打卡
      vipIsCode:    Boolean(event.vipIsCode)       //会员打卡
    }
  })
}

async function create(event) {         //更新集合信息
  const id = await db.collection("A" + event.ActiveCode).get()
  await db.collection("A" + event.ActiveCode).doc(id.data[0]._id).update({
    data: {
      lastChangeAdmin: event.Admin,         //操作者
      lastChangeTime: db.serverDate(),      //最后修改时间
      ActiveName: event.ActiveName,         //活动名称
      ActiveArea: event.ActiveArea,         //活动地点
      /* 时间 */
      RaceStart: new Date(event.RaceStart),    //比赛开始时间
      RaceEnd: new Date(event.RaceEnd),      //比赛结束时间
      EnterStart: new Date(event.EnterStart),   //报名开始时间
      EnterEnd: new Date(event.EnterEnd),     //报名结束时间
      /* 状态 */
      state: event.state,             //活动状态
      who: event.who,                 //活动对象
      state_enter: Boolean(event.state_enter),    //报名状态
      state_clock: Boolean(event.state_clock),    //打卡状态
      memberIsCode: Boolean(event.memberIsCode),   //非会员打卡
      vipIsCode: Boolean(event.vipIsCode)       //会员打卡
    }
  })
}

async function overview(event) {         //更新总览目录

  db.collection('active').doc('overview').get({
    success: function (res) {
      var overview = res.data.ActiveOverview
      for (let i = 0; i < overview.length; i++) {
        if (overview[i].ActiveCode == event.ActiveCode) {
          overview[i].ActiveName = event.ActiveName
        }
      }
      updateOverview(event,overview)
    }
  })
}

async function updateOverview(event,overview){
  await db.collection('active').doc('overview').update({
    data: {
      ActiveOverview: _.pullAll(['ActiveCode',event.ActiveCode])
    }
  })
  var active = ({
    ActiveName: event.ActiveName,         //活动名称
    ActiveCode: event.ActiveCode,         //活动编码
  })
  db.collection("active").doc('overview').update({
    data: {
      ActiveOverview: db.command.push(
        active
      )
    }
  })
}

