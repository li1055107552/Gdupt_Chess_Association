// pages/page_admin/active/active.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {

  },

  activeAdd:function(e){
    wx.navigateTo({
      url: 'add/add'
    })
  },

  activeDel:function(e){
    wx.navigateTo({
      url: 'del/del'
    })
  },

  activeChange:function(e){
    wx.navigateTo({
      url: 'change/change'
    })
  },

  activeSee:function(e){
    wx.navigateTo({
      url: 'see/see'
    })
  }

})