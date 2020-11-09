// pages/page_vip/clockcard/clockcard.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /* 页面的初始数据 */
    data: {
        id:'',              //报名表id
        member_id:'',       //成员表id
        time:'',
        codeIsTrue:false,
        check_msg:'',
        active_name:'',
        active_code:'',     //输入的编码    code:输入的编码  code_2:校验的验证码
        person_code:'',     //输入的验证码
        iscode:'',          //是否需要验证码
        number:'',
        nickname:'',
        name:'',
        school:'',
        classname:'',
        state:false,
    },

  /* 生命周期函数--监听页面加载 */
    onLoad: function (options) {
      wx.showLoading({
        title: '页面加载中',
      })
      var that = this

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
              wx.showModal({
                title: '温馨提示',
                content: '本学号尚未报名任何活动',
                showCancel:false
              })
            else
            {
              wx.showToast({
                title: '已有报名参加活动',
                icon:'none',
              })
              that.setData({
                id:res.data[0]._id,
                person_code_2:res.data[0].code,       //校验的验证码
                state:res.data[0].state
              })
            }
          },
          fail:console.error
        })
        },600)

      /* 获取缓存 */
        wx.getStorage({
          key: 'name',
          success: function (res) {
            that.setData({
              name: res.data
            })
          },
        })
        wx.getStorage({
          key: 'nickname',
          success: function (res) {
            that.setData({
              nickname: res.data
            })
          },
        })
        wx.getStorage({
          key: 'school',
          success: function (res) {
            that.setData({
              school: res.data
            })
          },
        })
        wx.getStorage({
          key: 'classname',
          success: function (res) {
            that.setData({
              classname: res.data
            })
          },
        })
      wx.hideLoading()
    },

  /* 绑定事件 */
    active_code: function(e){
      this.setData({
        active_code: e.detail.value
      })
      console.log("active_code:" + this.data.active_code)
    },
    person_code:function(e){
      this.setData({
        person_code:e.detail.value
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
              iscode:res.data.iscode
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
      if(this.data.check_msg && this.data.iscode) //活动编码检测成功 && 需要个人验证码
      {
          if (this.data.person_code == '')        //未输入验证码
              wx.showToast({
                title: '请输入验证码',
                icon:'none',
              })
          else                 //已输入验证码
          {
              if (this.data.person_code == this.data.person_code_2 && this.data.state == false){    //验证码正确 && 未打卡
                console.log('“检测”成功')
                wx.showLoading({
                  title: '打卡中',
                })
                
                wx.cloud.callFunction({       //调用云函数修改 打卡状态
                  name: 'active-state',
                  data: {
                    id: that.data.id,
                    enter: app.globalData.file_enter
                  },
                  success:function(res){
                    that.add_memberActive(),      //添加至member历史活动
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
                  fail: function (res) {
                    console.log(res)
                    wx.showToast({
                      title: '打卡失败',
                      icon: 'none'
                    })
                  }
                })
              }
              else if (this.data.state == true)    //已打卡
                wx.showModal({
                  title: '温馨提示',
                  content: '请勿重复打卡',
                  showCancel:false
                })
              else                                //验证码错误 && 未打卡
                wx.showToast({
                  title: '验证码错误',
                  icon:'none',
                })
          }
      }
      else if (this.data.check_msg && !(this.data.iscode))   ////活动编码检测成功 && 不需要个人验证码
      {
        var that = this
        wx.showModal({    //提示打卡信息，确认->打卡+添加记录
          title: '活动打卡',
          content: "确定参加:" + this.data.active_name,
          success:function(res){
            if(res.confirm){
              that.add_active()         //会员未报名直接打卡录入
            }
          }
        })
      }
      else    //未检测活动编码
      {
        wx.showToast({
          title: '请“检测”成功后再打卡 ',
          icon:'none',
        })
      }
    },

  /* 会员未报名直接打卡录入 */
    add_active:function(){
      var that = this
      const db = wx.cloud.database()
      db.collection(app.globalData.file_enter).add({
        data: {
          name: that.data.name,
          number: that.data.number,
          school: that.data.school,
          classname: that.data.classname,
          activeType: that.data.active_name,
          type: 'vip',
          state: true,
        },
        success: res => {
          that.add_memberActive()   //添加至member历史活动
          console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
          wx.showModal({
            content: '打卡成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm)
                setTimeout(function () {
                  /* 成功后跳转 */
                  wx.navigateTo({
                    url: '../page_vip',
                  }, 1600)
                })
            }
          })
        },
        fail:res =>{
          wx.showModal({
            title: '打卡失败',
            content: '请勿重复打卡',
            showCancel:false,
          })
        }
      })

    },

  /* 添加至member历史活动 */
    add_memberActive:function(e){
      var that = this
      var actived = ({
        time:this.data.time,
        active:this.data.active_name
      })
      const db = wx.cloud.database()
      db.collection("userList").doc(that.data.member_id).update({
        data:{
          actived:db.command.push(
            actived
          )
        }
      })
    }

})