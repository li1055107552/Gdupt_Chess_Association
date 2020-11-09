// pages/study/CNchess/CNchess.js
const app = getApp()
const current_directory = app.globalData.directory + "/study_Img/"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: current_directory + "CNchess/",
    background_url: current_directory + "indexBackground.jpg"
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var url = wx.getStorageSync('background_url')
    if (url != "") {
      this.setData({
        background_url:wx.getStorageSync('background_url')
      })
    }
    
  },

  click(e){
    if (e.currentTarget.id == 'advance') {
      wx.showToast({
        title: '敬请期待',
        icon:"none"
      })
    }
    else{
      wx.navigateTo({
        url: e.currentTarget.id + "/" + e.currentTarget.id,
      })
    }
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {}
})