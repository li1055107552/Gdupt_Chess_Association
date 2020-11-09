//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    avatarUrl: '../../img/logo.jpg',
    motto:'\n\n\r广 油 棋 牌 协 会',
    canlogin:false,         //是否已授权
    getuserinfo:'去授权',

    showDialog: false,      //当前蒙版状态
    notice:'',              //公告
    introduce:'',           //简介
    isShow_newcomers:'',
  },

  onLoad: function () {
    var that = this
    wx.getSetting({         //判断授权状态
      success(res) {
        if (res.authSetting['scope.userInfo'])  //如果已经授权
        {
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo
              that.setData({
                canlogin:true,
                getuserinfo:'',
                nickname:res.userInfo.nickName,
                avatarUrl:res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    this.getmsg()
  },

  getUserInfo: function (e) {     //获取个人信息
    console.log(e)
    if(e.detail.userInfo){
      console.log("确认授权")
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        canlogin:true,
        getuserinfo:'',
        nickname:e.detail.userInfo.nickName,
        avatarUrl:e.detail.userInfo.avatarUrl
      })
    } else{
      console.log("拒绝授权")
    }
  },

  login: function (e) {           //跳转至登录界面
      wx.navigateTo({
        url: '../login/login?canlogin=' + this.data.canlogin + "&url=index", 
      })
  },

  active: function (e) {          //跳转至报名界面
      wx.navigateTo({
        url: '../active/active',  
      })
  },

  msg(e) {                      //简介模块
    if(e.target.id == "notice")
      var url = this.data.notice
    else
      var url = this.data.introduce

    this.setData({
      showDialog: !this.data.showDialog,
      text:url
    })
  },

  getmsg(e){
    var that = this
    const db = wx.cloud.database()
      db.collection("admin").doc('index_tips').get({
        success: function (res) {
          that.setData({
            notice: "公告：\n\n" + res.data.notice,
            introduce: res.data.introduce,
          })
        }
      })
  },

  newcomers: function (e) {
    wx.navigateTo({
      url: '../newcomers/newcomers',
    })
  },

  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },

  /* 用户点击右上角分享 */
  onShareAppMessage: function () { }
})


