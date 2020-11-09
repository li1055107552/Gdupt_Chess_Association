// pages/page_admin/my/my.js

const app = getApp()
Page({

  /* 页面的初始数据 */
  data: {

    userInfo: {
      _id: "",
      avatarUrl: "",     //头像
      nickName: "admin", //昵称
      nickname: "",      //设置的昵称
    },
    title: "至高无上的管理员：",

  },

  /* 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          /* 获取用户信息 */
          wx.getUserInfo({
            success: function (res) {
              var avatarUrl = "userInfo.avatarUrl";
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    that.pageData();
  },
  
  pageData: function () {
    var that = this
    wx.setNavigationBarTitle({ title: that.data.title })
    wx.getStorage({
      key: 'name',
      success: function (res) {
        that.setData({
          title: " 管理员 & vip：" + res.data,
          'userInfo.avatarUrl': '../../../img/logo.jpg',
        })
      },
    })
    wx.getStorage({
      key: 'nickname',
      success: function (res) {
        that.setData({
          'userInfo.nickName': res.data,
        })
      },
    })
  },

  usermsg: function () {
    wx.navigateTo({
      url: 'usermsg/usermsg',
    })
  },

  history: function () {
    wx.navigateTo({
      url: 'history/history',
    })
  },

  active: function () {
    wx.navigateTo({
      url: 'active/active',
    })
  },

  clockcard: function () {
    wx.navigateTo({
      url: 'clockcard/clockcard',
    })
  },

  other: function () {
    wx.navigateTo({
      url: 'other/other',
    })
  },

  collect: function () {
    wx.navigateTo({
      url: 'collect/collect',
    })
  },

  back:function(e){
    wx.reLaunch({
      url: '../../index/index'
    })
  },

  /*生命周期函数--监听页面卸载 */
  onUnload: function () {

  }

})