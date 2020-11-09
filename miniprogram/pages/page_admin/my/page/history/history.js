// pages/page_admin/my/history/history.js

Page({

  // 页面的初始数据
  data: {
    number:wx.getStorageSync('number')
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    const db = wx.cloud.database()
    db.collection("userList").where({ number:wx.getStorageSync('number') }).get({
      success:function(res){
        var history = res.data[0].history
        for(var i=0;i<history.length;i++){
          var time = new Date(history[i].time)
          var Stime = time.getFullYear() + "年" + time.getMonth() + "月" + time.getDay() + "日"
          history[i].time = Stime
        }
        that.setData({
          history:res.data[0].history,
          total:history.length
        })
      }
    })

  }
})