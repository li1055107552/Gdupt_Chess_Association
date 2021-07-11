// pages/page_admin/active/see/see.js
const util = require("../../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:[],
    showBtn:[],
    total:'',
    become:'',
    ing:'',
    before:''
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    let active = this.data.active
    var showBtn = []
    wx.cloud.callFunction({
      name: 'getMsg',
      data:{
        action:"batch",
        collectName:"active"
      },
      success: function (res) {
        console.log(res);
        var before = 0;
        var ing = 0;
        var become = 0;
        var total = res.result.data.length-1

        for (let i = 1; i < res.result.data.length; i++) {
          // 统计
          if(res.result.data[i].state == "未开始") become++;
          else if (res.result.data[i].state == "进行中") ing++;
          else if (res.result.data[i].state == "已结束") before++;
          // 将活动信息提取出来
          var obj = {}
          var enterStart  = String(util.formatTime(new Date(res.result.data[i].enterStart)))   //报名开始时间
          var enterEnd    = String(util.formatTime(new Date(res.result.data[i].enterEnd))  )   //报名结束时间
          var raceStart   = String(util.formatTime(new Date(res.result.data[i].raceStart)) )   //比赛开始时间
          var raceEnd     = String(util.formatTime(new Date(res.result.data[i].raceEnd))   )   //比赛结束时间
          
          obj.activeName  = res.result.data[i].activeName   //活动名称
          obj.activeCode  = res.result.data[i].activeCode   //活动编码
          obj.activeArea  = res.result.data[i].activeArea   //活动地点
          obj.clocked     = res.result.data[i].clocked      //打卡人数
          obj.enrolment   = res.result.data[i].enrolment    //报名人数
          obj.enterStart  = enterStart.slice(0,enterStart.length-3)     //报名开始时间
          obj.enterEnd    = enterEnd.slice  (0,enterEnd.length-3  )     //报名结束时间
          obj.raceStart   = raceStart.slice (0,raceStart.length-3 )     //比赛开始时间
          obj.raceEnd     = raceEnd.slice   (0,raceEnd.length-3   )     //比赛结束时间
          obj.state       = res.result.data[i].state        //活动状态
          obj.state_clock = res.result.data[i].state_clock  //是否允许签到
          obj.state_enter = res.result.data[i].state_enter  //是否允许报名
          obj.who         = res.result.data[i].who          //活动对象
          //数组头部插入
          showBtn.unshift([false,"详情"])
          active.unshift(obj)
        }

        that.setData({
          active,
          showBtn,
          total,
          become,
          ing,
          before
        })
      },
      fail: console.error
    })
  },

  click(e){
    let showBtn = this.data.showBtn
    if(!showBtn[e.target.id][0]){
      showBtn[e.target.id] = [true,"收起"]
    }
    else if(showBtn[e.target.id]){
      showBtn[e.target.id] = [false,"详情"]
    }
    this.setData({
      showBtn:showBtn
    })
  },

  clock(e){
    console.log(e)
    wx.showToast({
      title: '功能尚未开发',
      icon:"none"
    })
  },

  enter(e){
    console.log(e)
    wx.showToast({
      title: '功能尚未开发',
      icon:"none"
    })
  }

})