// pages/page_admin/active/change/change.js
var app = getApp()
var util = require("../../../../../utils/util.js")
Page({

  /* 页面的初始数据 */
  data: {
    show:false,
    /* 时间 */
    raceStartdate:'',   //比赛开始时间
    raceStarttime:'',
    raceEnddate:'',     //比赛结束时间
    raceEndtime:'',
    enterStartdate:'',  //报名开始时间
    enterStarttime:'',
    enterEnddate:'',    //报名结束时间
    enterEndtime:'',
  },

  // 输入活动编码
  code(e){
    this.setData({
      search:Number(e.detail.value)
    })
  },
  
  /* 活动搜索 */
  search:function(e){
    if(this.data.search != ""){
      wx.showLoading({
        title: '查询中...',
      })
      var that = this
      console.log(this.data.search)
      wx.cloud.callFunction({
        name:'updateActive',
        data:{
          action:'get',
          msg:that.data.search
        },
        success(res){
          console.log(res)
          if(res.result.length == 1){
            console.log(res.result.data.raceStart)
            var raceStart   = util.formatTime(new Date(res.result.data.raceStart))    //比赛开始时间
            var raceEnd     = util.formatTime(new Date(res.result.data.raceEnd))      //比赛结束时间
            var enterStart  = util.formatTime(new Date(res.result.data.enterStart))   //报名开始时间
            var enterEnd    = util.formatTime(new Date(res.result.data.enterEnd))     //报名结束时间
            var activeArea = res.result.data.activeArea.split("：")
            var activeArea1 = activeArea[1].split("西城")[0]
            var activeArea2 = activeArea[2]
            that.setData({
              activeName:res.result.data.activeName,
              activeCode:res.result.data.activeCode,
              activeArea1:activeArea1,
              activeArea2:activeArea2,
              raceStartdate:  raceStart.split(" ")[0],   //比赛开始时间
              raceStarttime:  raceStart.split(" ")[1].slice(0,raceStart.split(" ")[1].length-3),
              raceEnddate:    raceEnd.split(" ")[0],     //比赛结束时间
              raceEndtime:    raceEnd.split(" ")[1].slice(0,raceStart.split(" ")[1].length-3),
              enterStartdate: enterStart.split(" ")[0],  //报名开始时间
              enterStarttime: enterStart.split(" ")[1].slice(0,raceStart.split(" ")[1].length-3),
              enterEnddate:   enterEnd.split(" ")[0],    //报名结束时间
              enterEndtime:   enterEnd.split(" ")[1].slice(0,raceStart.split(" ")[1].length-3),
              state:  res.result.data.state,
              who:    res.result.data.who,
              state_enter:res.result.data.state_enter,
              state_clock:res.result.data.state_clock,
              show:true
            })
            wx.hideLoading()
          }
          else{
            that.setData({
              show:false
            })
            wx.showToast({
              title: '活动编码不存在',
              icon:"none"
            })
          }
        },
        fail:console.error
      })
    }
    else{
      wx.showToast({
        title: '活动编码不能为空',
        icon:"none"
      })
    }

  },

  /* 时间选择 */
    timeChange:function(e){
      // console.log(e.target.id + ":" + e.detail.value)
      var id = e.target.id
      this.setData({
        [id]: e.detail.value
      })
    },

  /* 更新 */
    check: function (e) {
      console.log(e)
      if (e.detail.value.activeName == "")
        wx.showToast({
          title: '请输入本次活动的名称',
          icon: 'none'
        })
      else if (e.detail.value.activeArea1 == "" && e.detail.value.activeArea2 == "")
        wx.showToast({
          title: '请输入本次活动的举办地点',
          icon: 'none'
        })
      else {
        var that = this
        wx.showLoading({
          title: '设置更新中...',
        })
        that.updateFunction(e)
      }
    },
    updateFunction: function (e) {
      var that = this
      wx.cloud.callFunction({
        name: 'updateActive',
        data: {
          action:"update",
          id:         that.data.activeCode,             //需要更新的集合的_id
          admin:      wx.getStorageSync('name'),        //管理员的姓名
          activeName: e.detail.value.activeName,        //活动名称
          activeCode: that.data.activeCode,             //活动编码
          activeArea: "官渡：" + e.detail.value.activeArea1 + "\n西城：" + e.detail.value.activeArea2,         //活动地点
          /* 时间 */
          raceStart:  new Date(e.detail.value.raceStartdate  + " " + e.detail.value.raceStarttime).getTime(),       //比赛开始时间
          raceEnd:    new Date(e.detail.value.raceEnddate    + " " + e.detail.value.raceEndtime).getTime(),         //比赛结束时间
          enterStart: new Date(e.detail.value.enterStartdate + " " + e.detail.value.enterStarttime).getTime(),      //报名开始时间
          enterEnd:   new Date(e.detail.value.enterEnddate   + " " + e.detail.value.enterEndtime).getTime(),        //报名结束时间
          /* 状态 */
          state:      e.detail.value.state,             //活动状态
          who:        e.detail.value.who,               //活动对象
          state_enter:e.detail.value.enterstate,        //是否允许报名
          state_clock:e.detail.value.clockstate         //是否允许打卡
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          wx.showModal({
            title: '提示',
            content: '活动更新成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm)
                wx.navigateBack({
                  delta: 1
                })
              else
                wx.navigateBack({
                  delta: 1
                })
            }
          })
        },
        fail: console.error
      })
    },
  
})