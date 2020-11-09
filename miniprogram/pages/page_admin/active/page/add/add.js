// pages/page_admin/active/add/add.js
var util = require("../../../../../utils/util.js")
Page({

  /* 页面的初始数据 */
  data: {
    /* 时间 */
      raceStartdate:'',   //比赛开始时间
      raceStarttime:'',
      raceEnddate:'',     //比赛结束时间
      raceEndtime:'',
      enterStartdate:'',  //报名开始时间
      enterStarttime:'',
      enterEnddate:'',    //报名结束时间
      enterEndtime:'',
    text: "活动编码：建议由5位数字组成，如\'19001\'\n\n" + 
          "是否允许报名：是否允许他人进行报名\n\n" + 
          "是否允许签到：当前时间是否允许签到\n\n" + 
          "'报名时间'和'是否允许报名'的区别：\n" +
          "前者是当处于报名时间段时，将会在'活动报名'中显示该活动，是否能报名，由后者决定\n",
    showDialog:false
  },

  onLoad:function(e){
    // 设置时间
      var timeString = util.formatTime(new Date()).split(" ")
      var date = timeString[0]
      var time = timeString[1].slice(0,timeString[1].length-3)
      this.setData({
        raceStartdate:date,
        raceEnddate:date,
        enterStartdate:date,
        enterEnddate:date,
        raceStarttime:time,
        raceEndtime:time,
        enterStarttime:time,
        enterEndtime:time
      })
  },

  /* 时间选择 */
    timeChange:function(e){
      // console.log(e.target.id + ":" + e.detail.value)
      var id = e.target.id
      this.setData({
        [id]: e.detail.value
      })
    },
  
  /* 创建 */
    check:function(e){
      console.log(e)
      if(e.detail.value.activeCode == "")
        this.tips('请输入本次活动的名称')
      else if(e.detail.value.activeCode == "")
        this.tips('请设置唯一的活动编码')
      else if(e.detail.value.activeArea1 == "" && e.detail.value.activeArea2 == "")
        this.tips('请输入本次活动的举办地点')
      else{
        wx.showLoading({
          title: '检测中...',
        })
        const db = wx.cloud.database()
        var that = this
        db.collection("active").where({ activeCode: Number(e.detail.value.activeCode) }).get({
            success:function(res){
              if(res.data.length == 0){
                wx.showLoading({
                  title: '创建中...',
                })
                that.addFunction(e);
              }                
              else
                that.tips('该活动编码已被设置！')
            },
            fail:console.error
        })
      }
    },

    addFunction:function(e){
        var raceStart  = e.detail.value.raceStartdate  + " " + e.detail.value.raceStarttime      //比赛开始时间
        var raceEnd    = e.detail.value.raceEnddate    + " " + e.detail.value.raceEndtime        //比赛结束时间
        var enterStart = e.detail.value.enterStartdate + " " + e.detail.value.enterStarttime     //报名开始时间
        var enterEnd   = e.detail.value.enterEnddate   + " " + e.detail.value.enterEndtime       //报名结束时间
        wx.cloud.callFunction({
            name:'addActive',
            data:{
              admin:      wx.getStorageSync('name'),         //管理员的姓名
              activeName: e.detail.value.activeName,         //活动名称
              activeCode: Number(e.detail.value.activeCode), //活动编码
              activeArea: "官渡：" + e.detail.value.activeArea1 + "\n西城：" + e.detail.value.activeArea2,         //活动地点
              /* 时间 */
              raceStart:  new Date(raceStart).getTime(),    //比赛开始时间
              raceEnd:    new Date(raceEnd).getTime(),      //比赛结束时间
              enterStart: new Date(enterStart).getTime(),   //报名开始时间
              enterEnd:   new Date(enterEnd).getTime(),     //报名结束时间
              /* 状态 */
              state:        e.detail.value.state,            //活动状态
              who:          e.detail.value.who,              //活动对象
              state_enter:  e.detail.value.enterstate,       //报名状态
              state_clock:  e.detail.value.clockstate,       //打卡状态
            },
            success:function(res){
              wx.hideLoading()
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '活动创建成功',
                showCancel:false,
                success:function(res){
                  if(res.confirm)
                    wx.navigateBack({
                      delta:1
                    })
                  else
                    wx.navigateBack({
                      delta: 1
                    })
                }
              })
            },
            fail:console.error
        })
    },

    tips(e){
      wx.showToast({
        title: e,
        icon:'none'
      })
    },

  /* 蒙版 */
    notice() {                      //简介模块
      this.setData({
        showDialog: !this.data.showDialog
      })
    },
    introduce() {                    //公告模块
      this.setData({
        showDialog: !this.data.showDialog
      })
    },
    toggleDialog() {
      this.setData({
        showDialog: !this.data.showDialog
      })
    },
})