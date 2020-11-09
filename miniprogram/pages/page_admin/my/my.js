// pages/page_admin/my/my.js
const app = getApp()
Page({

  /* 页面的初始数据 */
  data: {

    avatarUrl: "../../../img/logo.jpg",     //头像
    nickname: "",      //昵称

  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.setData({
      title:" 管理员 & vip：" + wx.getStorageSync('name'),
      nickname:wx.getStorageSync('nickname')
    })
    if(options.canlogin){
      this.setData({
        avatarUrl:app.globalData.userInfo.avatarUrl
      })
    }
  },

  click(e){
    wx.navigateTo({
      url: "page/" + e.target.id + "/" + e.target.id,
    })
  },

  back:function(e){
    wx.reLaunch({
      url: '../../index/index'
    })
  },

  /*生命周期函数--监听页面卸载 */
  onUnload: function () {
    // wx.clearStorageSync()
  }


})