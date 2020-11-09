// pages/page_admin/active/see/see.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:[
      // {
      //   ActiveName:'',
      //   ActiveCode:'',
      //   ActiveArea:'',
      //   state:'',
      //   RaceStart:'',
      //   who:'',
      // }
    ],
    total:'',
    become:'',
    ing:'',
    before:''
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    let active = this.data.active
    wx.cloud.callFunction({
      name: 'seeActive',
      success: function (res) {
        console.log(res)
        that.setData({
          total: res.result.data.length
        })
        var before = 0;
        var ing = 0;
        var become = 0;
        for (let i = 1; i < res.result.data.length; i++) {
          /* 时间设置 */
            var time = String(res.result.data[i].RaceStart)
            time = time.substr(0, 10) + ' ' + time.substr(11, 5)

          if(res.result.data[i].state == "未开始") become++;
          else if (res.result.data[i].state == "进行中") ing++;
          else if (res.result.data[i].state == "已结束") before++;
          var obj = {}
          obj.ActiveArea = res.result.data[i].ActiveArea
          obj.ActiveCode = res.result.data[i].ActiveCode
          obj.ActiveName = res.result.data[i].ActiveName
          obj.state = res.result.data[i].state
          obj.RaceStart = time
          obj.who = res.result.data[i].who
          active.push(obj)
        }

        that.setData({
          active,
          become,
          ing,
          before
        })
        console.log(active)
      },
      fail: console.error
    })
  },

  onShow:function(e){
    
  },

  /* 用户点击右上角分享 */
  onShareAppMessage: function () {

  }
})