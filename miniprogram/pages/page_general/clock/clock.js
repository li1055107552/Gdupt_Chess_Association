// pages/page_general/clock/clock.js
var base = require('../../../utils/base64.js')
Page({

  // 页面的初始数据
  data: {
    showbtnmsg:"确认无误",
    canClock:false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    
  },

  // 扫码
  photo(e){
    var that = this
    wx.scanCode({
      onlyFromCamera:true,
      scanType:'qeCode',
      success(res){
        that.getCode(res.result)
      }
    })
  },

  // 解码
  getCode(str){
    try {
      var decode = base.decode(str)
      var index = decode.indexOf(":")
      var activeCode = decode.substr(index + 1,decode.length)

      if(index == -1 || activeCode == NaN){
        wx.showToast({
          title: '不支持二维码类型',
          icon:"none"
        })
      }
      else{
        wx.showLoading({
          title: '识别中......',
        })
        this.getmsg(activeCode)
      }

    } catch (error) {
      wx.showToast({
        title: '不支持二维码类型',
        icon:"none"
      })
    }
    
  },

  // 获取扫码后 需确认的信息
  getmsg(activeCode){
    var that = this
    wx.cloud.callFunction({
      name:"activeClock",
      data:{
        type:"getmsg",
        number:wx.getStorageSync('number'),
        activeCode:activeCode
      },
      success(res){
        for (let i = 0; i < res.result.length; i++) {
          if(res.result.history[i].activeCode == Number(activeCode)){
            var index = i
            break
          }
        }
        var state = res.result.person.state
        if(state == "已报名"){
          that.setData({
            canClock:true
          })
        }
        else if(state == "已签到"){
          that.setData({
            showbtnmsg:"您已成功签到"
          })
        }
        that.setData({
          success:true,
          activeCode: res.result.active.activeCode,
          activeName: res.result.active.activeName,
          name:     res.result.person.name,
          number:   res.result.person.number,
          major:    res.result.person.major,
          classname:res.result.person.classname,
          index:    index                         //处于个人历史的下标
        })
        wx.hideLoading()
      }

    })
  },

  // 确认签到
  clock(e){
    var that = this
    wx.cloud.callFunction({
      name:"activeClock",
      data:{
        type:"update",
        number:wx.getStorageSync('number'),
        activeCode:that.data.activeCode,
        index:that.data.index
      },
      success(res){
        that.setData({
          showbtnmsg:"您已成功签到",
          canClock:false
        })
        wx.showModal({
          content:"签到成功",
          showCancel:false,
          success(res){
            if(res.confirm){
              wx.navigateBack({
                delta:1
              })
            }
            else{
              wx.navigateBack({
                delta:1
              })
            }
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
  }

})