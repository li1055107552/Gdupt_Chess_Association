// pages/page_vip/changemsg/changemsg.js
var app = getApp()
Page({

  /* 页面的初始数据 */
    data: {
        id: '',
        code:'',
        nickname:'',
        nickname2:'',
        password:'********',
        password1:'',
        password2:'',
        changeNickname:false,
        nicknamebutton:'修改',
        changePassword:false,
        passwordbutton:'修改',
        showbutton:'显示',
        type:'',
        changeType:false,
        typebutton:'修改',
    },

  /* 生命周期函数--监听页面加载 */
    onLoad: function (options) {
      wx.showLoading({
        title: '页面加载中',
      })
      var that = this
      wx.getStorage({
        key: 'password',
        success: function (res) {
          that.setData({
            password1: res.data
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
        key: 'type',
        success: function (res) {
          that.setData({
            type: '普通成员'
          })
        },
      })
      wx.getStorage({
        key: 'id',
        success: function (res) {
          that.setData({
            id: res.data
          })
        },
      })
      /* 获取缓存中的唯一id */
      wx.getStorage({
        key: 'id',
        success: function (res) {
          console.log(res)
          that.setData({
            id: res.data
          })
          console.log(that.data.id)
        },
      })
      /* 获取文件存放位置 */
      const fl = wx.cloud.database()
      fl.collection("admin").doc('member').get
        ({
          success: function (res) {
            console.log(res.data.enter)
            app.globalData.file_enter = res.data.enter
          }
        })
      wx.hideLoading()
    },

  /* 绑定事件 */
  nickname: function (e) {
      this.setData(
        {
          nickname2: e.detail.value
        })
      console.log("用户名:" + this.data.nickname2)
    },

    password: function (e) {
      this.setData(
        {
          password2: e.detail.value
        })
      console.log("新密码:" + this.data.password2)
    },

    type:function(e){
      this.setData(
        {
          code: e.detail.value
        })
      console.log("密钥:" + this.data.code)
    },

  /* 昵称栏 */
    changeNickname: function () {
      console.log("改昵称")
      this.setData({
        changeNickname: (!this.data.changeNickname),
      })
      if (this.data.nicknamebutton == '修改') {
        this.setData({
          nicknamebutton: '关闭'
        })
      }
      else
        this.setData({
          nicknamebutton: '修改'
        })
    },

    check_nickname: function (e) {
      var that = this
      if (this.data.nickname2 == "")
        wx.showToast({
          icon: 'none',
          title: '请先填写新昵称',
        })
      else {
        /* 判断昵称 */
        const db = wx.cloud.database()
        db.collection(app.globalData.file_enter).where({ nickname: that.data.nickname2 }).get
          ({
            success: function (res) {
              console.log(res.data.length)
              if (res.data.length != 0) {
                wx.showModal({
                  content: '该昵称已被注册',
                  showCancel: false,
                })
              }
              else
                that.update_nickname();
            },
          })
      }
    },

    update_nickname: function () {

      var that = this
      console.log(that.data.id)
      const nickname = that.data.nickname2
      const db = wx.cloud.database()
      db.collection(app.globalData.file_enter).doc(that.data.id).update({
        data: {
          nickname: nickname
        },
        success: res => {
          that.setData({
            nickname: nickname
          })
          wx.setStorage({
            key: 'nickname',
            data: nickname,
          })
          wx.showModal({
            content: '修改成功',
            showCancel: false
          })
          that.changeNickname()
        },
      })
    },

  /* 密码栏 */
    changePassword: function () {
      console.log("改密码")
      this.setData({
        changePassword: (!this.data.changePassword),
      })
      if (this.data.passwordbutton == '修改') {
        this.setData({
          passwordbutton: '关闭'
        })
      }
      else
        this.setData({
          passwordbutton: '修改'
        })
    },

    showPassword:function(){
      console.log("显示密码")
      if (this.data.showbutton == '显示') {
        this.setData({
          showbutton: '隐藏'
        })
        this.setData({
          password:this.data.password1
        })
      }
      else
      {  
        this.setData({
          showbutton: '显示'
        })
        this.setData({
          password: '********'
        })
      }
    },

    update_password: function () {
      if(this.data.password2 == '')
      {  wx.showToast({
          icon: 'none',
          title: '请先填写新密码',
        })
      }
      else if(this.data.password1 == this.data.password2)
      {
        wx.showToast({
          icon: 'none',
          title: '不能与旧密码相同',
        })
      }
      else
      {
        var that = this

        wx.showModal({
          title: '修改密码',
          content: '新密码：' + that.data.password2,
          success(res) {
            if (res.confirm) 
            {
              console.log(that.data.id)
              const password = that.data.password2
              const db = wx.cloud.database()
              db.collection(app.globalData.file_enter).doc(that.data.id).update({
                data: {
                  password: password
                },
                success: res => {
                  that.setData({
                    password1: password
                  })
                  wx.showModal({
                    content: '修改成功,请重新登录',
                    showCancel: false,
                    success:function(res){
                      if (res.confirm)
                        wx.navigateTo({
                          url: '../../login/login',
                        })
                    }
                  })

                },
              })
            }
          }
        })
      }

    },

  /* 类型栏 */
    changeType:function(){
      console.log("改类型")
      this.setData({
        changeType: (!this.data.changeType),
      })
      if (this.data.typebutton == '修改') {
        this.setData({
          typebutton: '关闭'
        })
      }
      else
        this.setData({
          typebutton: '修改'
        })
    },

    update_type:function(){
      var that = this
      if (this.data.code == "")
        wx.showToast({
          icon: 'none',
          title: '请先填写密钥',
        })
      else
      {
        const db = wx.cloud.database()
        db.collection('admin').doc('update_code').get
        ({
          success: function (res) 
          {
            console.log(res.data)
            if (res.data.to_admin == that.data.code)
            {
              console.log(that.data.id)
              const db = wx.cloud.database()
              db.collection(app.globalData.file_enter).doc(that.data.id).update({
                data: {
                  type: 'admin'
                },
                success: res => {
                    wx.showModal({
                      content: '修改成功,请重新登录',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm)
                          wx.navigateTo({
                            url: '../../login/login',
                          })
                      }
                    })
                  
                  }
                })
            }
            else if(res.data.to_vip == that.data.code)
            {
              console.log(that.data.id)
              const db = wx.cloud.database()
              db.collection(app.globalData.file_enter).doc(that.data.id).update({
                data: {
                  type: 'vip'
                },
                success: res => {
                  wx.showModal({
                    content: '修改成功,请重新登录',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm)
                        wx.navigateTo({
                          url: '../../login/login',
                        })
                    }
                  })
                }
              })
            }
            else if (res.data.to_member == that.data.code) 
            {
              console.log(that.data.id)
              const password = that.data.password2
              const db = wx.cloud.database()
              db.collection(app.globalData.file_enter).doc(that.data.id).update({
                data: {
                  type: 'member'
                },
                success: res => {
                  wx.showModal({
                    content: '修改成功,请重新登录',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm)
                        wx.navigateTo({
                          url: '../../login/login',
                        })
                    }
                  })
                }
              })
            }
            else
              wx.showModal({
                content: '密钥不匹配',
                showCancel:false
              })
          }
        })
      }
    },

})