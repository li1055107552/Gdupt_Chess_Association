// pages/page_admin/collect/collect.js
Page({

  /* 页面的初始数据 */
  data: {
    collect:[{
      number:'学号',
      name:'姓名',
      code:'验证码',
      state:'签到'
    },
    ],
    total:'',
    number:''
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    let collect = this.data.collect

    wx.cloud.callFunction({
      name:'get_collect',
      success:function(res){
        that.setData({
          total: res.result.data.length
        })
        for (let i = 1; i < res.result.data.length;i++)
        {
            var obj = {}
            obj.name = res.result.data[i].name,
            obj.code = res.result.data[i].code,
            obj.number = res.result.data[i].number
            obj.state = res.result.data[i].state
            collect.push(obj)
        }

        that.setData({
          collect
        })
        console.log(collect)
      },
      fail:console.error
    })

  },

  change:function(e){
    console.log("click")
    console.log(e)
  },

  search:function(e){
    var i;
    for(i=0;i<this.data.length;i++)
    {
      if(Number(this.data.collect[i].number) == Number(this.data.number))
      wx.showModal({
        title: '姓名' + this.data.collect[i].name,
        content: '验证码' + this.data.collect[i].code,
        showCancel:false
      })
      if(i == this.data.length-1)
        wx.showToast({
          title: '用户不存在',
        })
    }
    console.log(this.data.collect[2].number)
  },

  search1:function(e){
    this.setData({
      number:Number(e.detail.value)
    })
    console.log(this.data.number)
  },

  /* 生命周期函数--监听页面卸载 */
  onUnload: function () {

  },


})