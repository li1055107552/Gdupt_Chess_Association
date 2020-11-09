// pages/page_vip/usermsg/usermsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nickname:'',
      name:'',
      number:'',
      school:'',
      classname:'',
      type:'会员',
      time:'',
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'nickname',
      success: function(res) {
        console.log(res)
        that.setData({
          nickname: res.data
        })
        console.log("nickname:" + that.data.nickname)
      },
    })
    wx.getStorage({
      key: 'name',
      success: function(res) {
        console.log(res)
        that.setData({
          name: res.data
        })
        console.log("name:" + that.data.name)
      },
    })
    wx.getStorage({
      key: 'number',
      success: function (res) {
        console.log(res)
        that.setData({
          number: res.data
        })
        console.log("number:" + that.data.number)
      },
    })
    wx.getStorage({
      key: 'school',
      success: function (res) {
        console.log(res)
        that.setData({
          school: res.data
        })
        console.log("school:" + that.data.school)
       },
    })
    wx.getStorage({
      key: 'classname',
      success: function (res) {
        console.log(res)
        that.setData({
          classname: res.data
        })
        console.log("classname:" + that.data.classname)
      },
    })
    wx.getStorage({
      key: 'time',
      success: function (res) {
        console.log(res)
        that.setData({
          time: res.data
        })
        console.log("time:" + that.data.time)
      },
    })
  }

})