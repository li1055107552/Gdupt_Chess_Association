// pages/page_general/page_general.js
const app = getApp()
Page({

  data: {
    welcome:'',   //标题栏
    title:'',     //欢迎词
    avatarUrl:"../../img/logo.jpg",    //头像url
  },

  onLoad: function (options) {
    var name = wx.getStorageSync('name')
    var nickname = wx.getStorageSync('nickname')
    var type = wx.getStorageSync('type')
    var title
    var welcome
    if(options.canlogin){
      this.setData({
        avatarUrl:app.globalData.userInfo.avatarUrl
      })
    }
    
    if(type == 'admin'){
      welcome = '至高无上的管理员'
      title = ' 管理员&vip: ' + name
    } 
    else if(type == 'secretary'){
      welcome = "尊敬的干事"
      title = " 干事： " + name
    }
    else if(type == 'vip'){
      welcome = "尊敬的会员"
      title = " vip： " + name
    }
    else{
      welcome = "亲爱的用户"
      title = " 用户: " + name
    }

    this.setData({
      name:name,
      nickname:nickname,
      title:title
    })

    wx.setNavigationBarTitle({
      title: welcome,
    })
    
  },

  click(e){
    wx.navigateTo({
      url: e.target.id + "/" + e.target.id,
    })
  },

  onUnload: function () {
    wx.removeStorageSync('from')
    wx.navigateBack({
      delta:5
    })
  }
})