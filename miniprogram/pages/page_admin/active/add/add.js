// pages/page_admin/active/add/add.js

Page({

  /* 页面的初始数据 */
  data: {
    name:'',    //管理员名称
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
          "活动报名状态：是否允许他人进行报名\n\n" + 
          "打卡签到状态：是否允许签到\n\n" + 
          "打卡是否需要验证码：即在“活动打卡”处打卡时，是否需要输入验证码 以确认到达现场签到",
    showDialog:false
  },

  onLoad:function(e){
    /* 设置时间 */
    {
      var date = new Date();
      var dates = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
      var times = date.getHours() + ":" + "00"
      this.setData({
        raceStartdate:dates,
        raceEnddate:dates,
        enterStartdate:dates,
        enterEnddate:dates,
        raceStarttime:times,
        raceEndtime:times,
        enterStarttime:times,
        enterEndtime:times
      })
    }
    var that = this
    // 获取 管理员 名字
    wx.getStorage({
      key: 'name',
      success: function(res) {
        that.setData({
          name:res.data
        })
      },
    })
  },

  /* 时间选择 */
    timeChange:function(e){
      console.log(e.target.id + ":" + e.detail.value)
      var id = e.target.id
      this.setData({
        [id]: e.detail.value
      })
    },
  
  /* 创建 */
    check:function(e){
      
      if(e.detail.value.activeCode == "")
        this.tips('请输入本次活动的名称')
      else if(e.detail.value.activeCode == "")
        this.tips('请设置唯一的活动编码')
      else if(e.detail.value.activeArea == "")
        this.tips('请输入本次活动的举办地点')
      else{
        wx.showLoading({
          title: '创建中...',
        })
        const db = wx.cloud.database()
        var that = this
        db.collection("active").where({ activeCode: e.detail.value.activeCode}).get({
            success:function(res){
              console.log(res)
              if(res.data.length == 0)
                that.addFunction(e);
              else
                that.tips('该活动编码已被设置！')
            },
            fail:console.error
        })
      }
    },
    addFunction:function(e){
        var that = this
        var raceStart  = new Date(e.detail.value.raceStartdate  + " " + e.detail.value.raceStarttime  ).getTime()     //比赛开始时间
        var raceEnd    = new Date(e.detail.value.raceEnddate    + " " + e.detail.value.raceEndtime    ).getTime()     //比赛结束时间
        var enterStart = new Date(e.detail.value.enterStartdate + " " + e.detail.value.enterStarttime ).getTime()     //报名开始时间
        var enterEnd   = new Date(e.detail.value.enterEnddate   + " " + e.detail.value.enterEndtime   ).getTime()     //报名结束时间
        console.log(that.data.name)
        console.log(e.detail.value.activeName)
        console.log(Number(e.detail.value.activeCode))
        console.log(e.detail.value.activeArea)
        console.log(Number(raceStart))
        console.log(Number(raceEnd))
        console.log(Number(enterStart))
        console.log(Number(enterEnd))
        console.log(e.detail.value.state)
        console.log(e.detail.value.who)
        console.log(e.detail.value.enterstate)
        console.log(e.detail.value.clockstate)
        console.log(e.detail.value.code_member)
        console.log(e.detail.value.code_vip)
        wx.cloud.callFunction({
            name:'addActive',
            data:{
              admin:that.data.name,                          //管理员的姓名
              activeName: e.detail.value.activeName,         //活动名称
              activeCode: Number(e.detail.value.activeCode), //活动编码
              activeArea: e.detail.value.activeArea,         //活动地点
              /* 时间 */
              raceStart:  Number(raceStart),    //比赛开始时间
              raceEnd:    Number(raceEnd),      //比赛结束时间
              enterStart: Number(enterStart),   //报名开始时间
              enterEnd:   Number(enterEnd),     //报名结束时间
              /* 状态 */
              state:        e.detail.value.state,            //活动状态
              who:          e.detail.value.who,              //活动对象
              state_enter:  e.detail.value.enterstate,       //报名状态
              state_clock:  e.detail.value.clockstate,       //打卡状态
              code_member:  e.detail.value.code_member,      //非会员打卡
              code_vip:     e.detail.value.code_vip,         //会员打卡
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