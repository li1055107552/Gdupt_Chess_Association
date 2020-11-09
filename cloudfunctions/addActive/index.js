/**
 * admin活动创建
 * pages/pge_admin/active/add/add.js 中调用
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const time = new Date().getTime()
// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  await add(event)
  await update(event)
  await db.createCollection("A" + event.activeCode)
  await create(event)
  return "finish"
}

  async function add(event){            //添加活动
    db.collection('active').add({
      data: {
        _id:event.activeCode,
        admin: event.admin,                   //操作者
        lastChangeAdmin:event.admin,          //最后修改的管理员
        activeName: event.activeName,         //活动名称
        activeCode: event.activeCode,         //活动编码
        activeArea: event.activeArea,         //活动地点
        /* 时间 */
        time:       time,               //创建时间
        lastChangeTime:time,            //最后修改时间
        raceStart:  event.raceStart,    //比赛开始时间
        raceEnd:    event.raceEnd,      //比赛结束时间
        enterStart: event.enterStart,   //报名开始时间
        enterEnd:   event.enterEnd,     //报名结束时间
        /* 状态 */
        state: event.state,            //活动状态
        who:   event.who,              //活动对象
        state_enter:  Boolean(event.state_enter),    //报名状态
        state_clock:  Boolean(event.state_clock),    //打卡状态
        code_member:  Boolean(event.code_member),    //非会员打卡
        code_vip:     Boolean(event.code_vip),       //会员打卡
        /* 数量 */
        enrolment:  0,                 //已报名人数
        clocked:    0                  //已打卡人数
      }
    })
  }

  async function update(event){         //添加总览目录
    var active = ({
      activeName: event.activeName,         //活动名称
      activeCode: event.activeCode,         //活动编码
    })
    db.collection("active").doc('overview').update({
      data: {
        ActiveOverview: db.command.push(
          active
        )
      }
    })
  }

  async function create(event){         //添加集合信息
    await db.collection("A" + event.activeCode).add({
      data: {
        _id:"first",
        admin: event.admin,                   //操作者
        lastChangeAdmin:event.admin,          //最后修改的管理员
        activeName: event.activeName,         //活动名称
        activeCode: event.activeCode,         //活动编码
        activeArea: event.activeArea,         //活动地点
        /* 时间 */
        time:       time,              //创建时间
        lastChangeTime:time,           //最后修改时间
        raceStart: event.raceStart,    //比赛开始时间
        raceEnd:   event.raceEnd,      //比赛结束时间
        enterStart:event.enterStart,   //报名开始时间
        enterEnd:  event.enterEnd,     //报名结束时间
        /* 状态 */
        state:event.state,            //活动状态
        who:  event.who,              //活动对象
        state_enter: Boolean(event.state_enter),     //报名状态
        state_clock: Boolean(event.state_clock),     //打卡状态
        code_member: Boolean(event.code_member),     //非会员打卡
        code_vip:    Boolean(event.code_vip),        //会员打卡
        /* 数量 */
        enrolment:  0,                 //已报名人数
        clocked:    0                  //已打卡人数
      }
    })
  }