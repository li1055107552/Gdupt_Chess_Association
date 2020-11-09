// pages/page_vip/clockcard/clockcard.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /* 页面的初始数据 */
  data: {
      id:'',
      member_id:'',
      codeIsTrue:false,
      check_msg:'',
      active_name:'',
      active_code:'',     //输入的编码    code:输入的编码  code_2:校验的验证码
      person_code:'',     //输入的验证码
      number:'',
      isregister:false,
      state:false,
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '页面加载中...',
      icon:'none',
    })
    /* 获取文件存放位置 */
      const fl = wx.cloud.database()
      fl.collection("admin").doc('active').get
        ({
          success: function (res) {
            console.log(res.data.enter)
            app.globalData.file_enter = res.data.enter
          }
        })
    /* 获取时间 */
      var TIME = util.formatTime(new Date());
      this.setData({
        time: TIME
      })
      console.log("onload:" + this.data.time)
    /* 获取当前学号 */
      wx.getStorage({
        key: 'number',
        success: function (res) {
          that.setData({
            number: res.data,
          })
          console.log(that.data.number)
        },
      })

    /* 查询当前学号 */
      setTimeout(function(){
      const db = wx.cloud.database()
      db.collection(app.globalData.file_enter).where({ number:that.data.number }).get
      ({
        success:function(res){
          console.log(res)
          if(res.data.length == 0)
          {  wx.showModal({
              title: '温馨提示',
              content: '本学号尚未报名任何活动',
              showCancel:false,
              success(res){
                if(res.confirm)
                  wx.navigateBack({
                    delta:1
                  })
                else
                  wx.navigateBack({
                    delta: 1
                  })
              }
            })
          }
          else
          {
            wx.showToast({
              title: '已有报名参加活动',
              icon:'none',
            })
            that.setData({
              id:res.data[0]._id,
              person_code_2:res.data[0].code,       //校验的验证码
              state:res.data[0].state,
            })
          }
        },
        fail:console.error
      })
      },600)
    wx.hideLoading()
  },

  /* 事件绑定 */
    active_code: function(e){
      this.setData({
        active_code: e.detail.value
      })
      console.log("active_code:" + this.data.active_code)
    },
    person_code:function(e){
      this.setData({
        person_code:Number(e.detail.value)
      })
      console.log("person_code:" + this.data.person_code)
    },

  /* 校验 */
    check_code:function(){
      var that = this
      if(this.data.active_code == '')
        wx.showToast({
          title: '请先输入活动编码',
          icon:'none',
        })
      else
      {
        const file = wx.cloud.database()
        file.collection("userList").where({ number: that.data.number }).get
        ({
          success: function (res) {
            console.log(res)
            that.setData({
              member_id: res.data[0]._id
            })
          }
        })

        const db = wx.cloud.database()
        db.collection(app.globalData.file_enter).doc( 'active_code' ).get
        ({
          success: function (res) {
            console.log(res)
            that.setData({
              active_name:res.data.name,
              active_code_2:res.data.code,           //校验的活动编码
            })
            console.log(that.data.active_name)
          },
          fail: console.error
        })

        setTimeout(function(){

          if (that.data.active_code == that.data.active_code_2)   //输入的编码 = 活动的编码
          {    
            that.setData({
              codeIsTrue:true,
              check_msg:true,
            })

          }
          else
          { 
            wx.showToast({
              title: '活动编码错误',
              icon:'none'
            })

            that.setData({
              codeIsTrue: false
            })
          }
        },600)

      }
      
    },

    register:function(){
      var that = this
      if (this.data.check_msg)
      {
        if (this.data.person_code == '')
            wx.showToast({
              title: '请输入验证码',
              icon:'none',
            })
          else
          {
            if(this.data.person_code == this.data.person_code_2 && this.data.state == false)
            {
              console.log('“检测”成功')
              wx.showLoading({
                title: '打卡中',
              })
              wx.cloud.callFunction({   //调用云函数修改 打卡状态
                name:'active-state',
                data:{
                  id:that.data.id,
                  enter:app.globalData.file_enter
                },
                success:function(res){
                  that.add_memberActive()   //添加至member历史活动
                  console.log(res)
                  wx.hideLoading()
                  wx.showModal({
                    content: '打卡成功',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm)
                        wx.navigateBack({
                          delta: 1,
                        })
                    }
                  })
                },
                fail:function(res){
                  console.log(res)
                  wx.showToast({
                    title: '打卡失败',
                    icon:'none'
                  })
                }
              })
              // console.log('id:' + this.data.id)
              // db.collection(app.globalData.file_enter).doc(this.data.id).update({
              //   data: {
              //     state: true
              //   },
              //   success: function(res){
              //     console.log
              //     wx.hideLoading()
              //   },
              //   fail: console.error,
              // })
            }
            else if(this.data.state == true)
              wx.showModal({
                title: '温馨提示',
                content: '请勿重复打卡',
                showCancel:false
              })
            else
              wx.showToast({
                title: '验证码错误',
                icon:'none',
              })
          }

      }
      else
      {
        wx.showToast({
          title: '请“检测”成功后再打卡 ',
          icon:'none',
        })
      }
    },

  /* 添加至member历史活动 */
    add_memberActive: function (e) {
      var that = this

      var actived = ({
        time: this.data.time,
        active: this.data.active_name
      })

      const db = wx.cloud.database()
      db.collection("userList").doc(that.data.member_id).update({
        data: {
          actived: db.command.push(
            actived
          )
        }
      })
  }

})