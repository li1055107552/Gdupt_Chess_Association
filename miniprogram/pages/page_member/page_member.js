// pages/vipPage/vipPage.js
Page({

  /* 页面的初始数据 */
  data: {
    userInfo:{
      _id:"",           
      avatarUrl:"",     //头像
      nickName:"",      //昵称
      nickname:"",      //设置的昵称
    },
    title:"亲爱的成员：",

  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    /* 获取用户信息 */
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          /* 获取用户信息 */
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              var avatarUrl = "userInfo.avatarUrl";
              var nickName = "userInfo.nickName";
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl,
                [nickName]: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
    that.pageData();

  },

  pageData:function(){
    var that = this
    wx.setNavigationBarTitle({ title: that.data.title })
    wx.getStorage({
      key: 'name',
      success: function(res) {
        console.log(res)
        that.setData({
          title : " 成员："+res.data,
          'userInfo.avatarUrl': '../index/logo.jpg',
        })
        console.log("title:"+that.data.title)
      },
    })
  },

  usermsg:function(){
      wx.navigateTo({
        url: 'usermsg/usermsg',
      })
  },
  
  changemsg: function () {
    wx.navigateTo({
      url: 'changemsg/changemsg',
    })
  },

  active:function(){
      wx.navigateTo({
        url: 'active/active',
      })
  },

  clockcard:function(){
      wx.navigateTo({
        url: 'clockcard/clockcard',
      })
  },

  other:function(){
      wx.showToast({
        title: '功能尚未开发',
        icon:'none',
      })
  },

  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'nickname',
      success: function (res) {
        console.log(res)
        that.setData({
          'userInfo.nickName': res.data,
        })
      },
    })
  },

  /*生命周期函数--监听页面卸载 */
  onUnload: function () {
    wx.navigateBack({
      delta:2
    })
  }

})