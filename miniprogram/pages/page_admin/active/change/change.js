// pages/page_admin/active/change/change.js
var app = getApp()
var util = require("../../../../utils/util.js")
Page({

  /* 页面的初始数据 */
  data: {
    active: [],
    show:false,
    /* 时间 */
    RaceStartdate: '',   //比赛开始时间
    RaceStarttime: '',
    RaceEnddate: '',     //比赛结束时间
    RaceEndtime: '',
    EnterStartdate: '',  //报名开始时间
    EnterStarttime: '',
    EnterEnddate: '',    //报名结束时间
    EnterEndtime: '',
    i:'',
  },

  onLoad: function (e) {
      var that = this
    /* 获取活动列表 */
      let active = this.data.active
      wx.cloud.callFunction({
        name: 'seeActive',
        success: function (res) {
          console.log(res)
          for (let i = 1; i < res.result.data.length; i++) {
            var obj = {}
            /* 时间设置 */
              for(let j =0 ; j<4 ; j++){
                switch(j){
                  case 0: {
                    var time = String(res.result.data[i].RaceStart)
                    obj.RaceStartdate = time.substr(0,10)
                    obj.RaceStarttime = time.substr(11, 5)
                    break
                  }
                  case 1:{
                    var time = String(res.result.data[i].RaceEnd)
                    obj.RaceEnddate = time.substr(0, 10)
                    obj.RaceEndtime = time.substr(11, 5)
                    break
                  }
                  case 2: {
                    var time = String(res.result.data[i].EnterStart)
                    obj.EnterStartdate = time.substr(0, 10)
                    obj.EnterStarttime = time.substr(11, 5)
                    break
                  }
                  case 3: {
                    var time = String(res.result.data[i].EnterEnd)
                    obj.EnterEnddate = time.substr(0, 10)
                    obj.EnterEndtime = time.substr(11, 5)
                    break
                  }
                }
              }

            /* 数组聚合 */
              obj.id = res.result.data[i]._id
              obj.ActiveArea = res.result.data[i].ActiveArea
              obj.ActiveCode = res.result.data[i].ActiveCode
              obj.ActiveName = res.result.data[i].ActiveName
              obj.state_clock = res.result.data[i].state_clock
              obj.state_enter = res.result.data[i].state_enter
              obj.memberIsCode = res.result.data[i].memberIsCode
              obj.vipIsCode = res.result.data[i].vipIsCode
              obj.state = res.result.data[i].state
              obj.who = res.result.data[i].who
              active.push(obj)
          }
          that.setData({
            active
          })
        },
        fail: console.error
      })
  },
  
  /* 活动搜索 */
    search:function(e){
      console.log(e)
      console.log(Number(e.detail.value.search))
      for(let i=0;i<this.data.active.length;i++){
        console.log(this.data.active[i].ActiveCode)
        if(Number(e.detail.value.search) == this.data.active[i].ActiveCode){
          this.setData({
            RaceStartdate: this.data.active[i].RaceStartdate,     //比赛开始时间
            RaceStarttime: this.data.active[i].RaceStarttime,
            RaceEnddate: this.data.active[i].RaceEnddate,         //比赛结束时间
            RaceEndtime: this.data.active[i].RaceEndtime,
            EnterStartdate: this.data.active[i].EnterStartdate,   //报名开始时间
            EnterStarttime: this.data.active[i].EnterStarttime,
            EnterEnddate: this.data.active[i].EnterEnddate,       //报名结束时间
            EnterEndtime: this.data.active[i].EnterEndtime,
            show:true,
            i:i
          })
          break;
        }
        else if(i == this.data.active.length-1){
          wx.showToast({
            title: '活动不存在',
            icon:'none'
          })
          this.setData({
            show:false
          })
        }
      }
    },

  /* 时间选择 */
    timeChange: function (e) {
      console.log(e.target.id + ":" + e.detail.value)
      var id = e.target.id
      if (id == 'raceStartdate')          // 比赛开始时间
        this.setData({
          RaceStartdate: e.detail.value
        })
      else if (id == 'raceStarttime')
        this.setData({
          RaceStarttime: e.detail.value
        })
      else if (id == 'raceEnddate')       // 比赛结束时间
        this.setData({
          RaceEnddate: e.detail.value
        })
      else if (id == 'raceEndtime')
        this.setData({
          RaceEndtime: e.detail.value
        })
      else if (id == 'enterStartdate')    // 报名开始时间
        this.setData({
          EnterStartdate: e.detail.value
        })
      else if (id == 'enterStarttime')
        this.setData({
          EnterStarttime: e.detail.value
        })
      else if (id == 'enterEnddate')       // 报名结束时间
        this.setData({
          EnterEnddate: e.detail.value
        })
      else if (id == 'enterEndtime')
        this.setData({
          EnterEndtime: e.detail.value
        })
    },

  /* 更新 */
    updateActive: function (e) {
      console.log(e)
      if (e.detail.value.ActiveCode == "")
        wx.showToast({
          title: '请输入本次活动的名称',
          icon: 'none'
        })
      else if (e.detail.value.ActiveArea == "")
        wx.showToast({
          title: '请输入本次活动的举办地点',
          icon: 'none'
        })
      else {
        var that = this
        wx.showLoading({
          title: '设置更新中...',
        })
        wx.getStorage({
          key: 'name',
          success: function(res) {
            console.log(res)
            that.updateFunction(e,res.data)
          },
        })
      }
    },
    updateFunction: function (e,name) {
      var that = this
      var raceStart  = new Date(e.detail.value.raceStartdate  + " " + e.detail.value.raceStarttime)     //比赛开始时间
      var raceEnd    = new Date(e.detail.value.raceEnddate    + " " + e.detail.value.raceEndtime)       //比赛结束时间
      var enterStart = new Date(e.detail.value.enterStartdate + " " + e.detail.value.enterStarttime)    //报名开始时间
      var enterEnd   = new Date(e.detail.value.enterEnddate   + " " + e.detail.value.enterEndtime)      //报名结束时间
      var id = that.data.active[that.data.i].id
      console.log(id)
      wx.cloud.callFunction({
        name: 'updateActive',
        data: {
          id:id,          //需要更新的集合的_id
          Admin: name,                                  //管理员的姓名
          ActiveName: e.detail.value.ActiveName,        //活动名称
          ActiveCode: e.detail.value.ActiveCode,        //活动编码
          ActiveArea: e.detail.value.ActiveArea,        //活动地点
          /* 时间 */
          RaceStart: raceStart.toString(),              //比赛开始时间
          RaceEnd: raceEnd.toString(),                  //比赛结束时间
          EnterStart: enterStart.toString(),            //报名开始时间
          EnterEnd: enterEnd.toString(),                //报名结束时间
          /* 状态 */
          state: e.detail.value.state,                  //活动状态
          who: e.detail.value.who,                      //活动对象
          state_enter: e.detail.value.enterstate,       //报名状态
          state_clock: e.detail.value.clockstate,       //打卡状态
          memberIsCode: e.detail.value.memberIsCode,    //非会员打卡
          vipIsCode: e.detail.value.vipIsCode,          //会员打卡
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