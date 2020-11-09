// pages/page_vip/active/active.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({

  /* 页面的初始数据 */
  data: {
    name: "",
    tel: "",
    number: "",
    school: "",
    classname: "",
    activeType: "",
    formId: "",
    counterId:'',
    code:'',
  },

  onLoad: function () {
    wx.showLoading({
      title: '页面加载中',
    })
    /* 入口检测 */
      const st = wx.cloud.database()
      st.collection("admin").doc('active').get
        ({
          success: function (res) {
            console.log('state_vip:' + res.data.state_vip)
            if (res.data.state_vip == false) {
              wx.showModal
              ({
                content: '报名入口关闭',
                showCancel: false,
                success(res) {
                  if (res.confirm)
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
          }
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
      var that = this
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
        key: 'number',
        success: function (res) {
          that.setData({
            number: res.data
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
    /* 生成验证码 */
      var codelength = 4;
      var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
      for (var i = 0; i < codelength; i++) {
        if (i == 0)
          var index = Math.floor(Math.random() * 9 + 1)
        else
          var index = Math.floor(Math.random() * 10)
        this.data.code += random[index];
      }
      console.log("code:" + this.data.code)
    wx.hideLoading()
  },

  /* 绑定事件 */
    tel: function (e) {
      this.setData(
        {
          tel: e.detail.value
        })
      console.log("电话:" + this.data.tel)
    },

    other: function (e) {
      this.setData(
        {
          other: e.detail.value
        })
      console.log("其他:" + this.data.classname)
    },

    checkboxChange: function (e) {
      this.setData({
        checkbox: e.detail.value
      })
      console.log('checkbox发生change事件,携带value值为：', e.detail.value)
    },

  /* 校验目标 */
  check_number: function (e) {
    const bd = wx.cloud.database()
    bd.collection(app.globalData.file_enter).where({ number: this.data.number }).get
      ({
        success: function (res) {
          console.log(res.data[0].number)
          if (res.data[0].number != null) {
            wx.hideLoading()
            wx.showModal
              ({
                content: '学号已被登记',
                showCancel: false,
              })
          }
        }
      })
  },

  check_submit: function (e) {
    this.setData({
      formId: e.detail.formId,
    })

    if (this.check_number());

    if (this.data.tel == "") {
      wx.showToast({
        title: '请填写联系方式',
        icon: 'none',
      })
      return false;
    }

    if (this.data.tel.length != 11) {
      wx.showToast({
        title: '请正确填写电话',
        icon: 'none',
      })
      return false;
    }

    var mobile = /^1[3456789]\d{9}$/;
    var isMobile = mobile.exec(this.data.tel)
    if (!isMobile) {
      wx.showToast({
        title: '请正确填写电话',
        icon: 'none',
      })
      return false;
    }

    if (this.data.checkbox == "other" && this.data.other == null) {
      wx.showModal({
        title: '提示',
        content: '请备注“其他”',
        icon: 'none',
        showCancel: false,
      })
      return false;
    }

    if (this.data.checkbox == null || this.data.checkbox.length == 0) {
      wx.showToast({
        title: '请选择活动',
        icon: 'none',
      })
      return false;
    }

    else {
      wx.showLoading({
        title: '校验中',
      })
      var join = this.data.checkbox[0];
      for (var i = 1; i < 4; i++) {
        if (this.data.checkbox[i] != undefined)
          join += "、" + this.data.checkbox[i]
      }
      this.setData({
        activeType: join
      })

      setTimeout(this.onAdd, 500)
      return true;
    }

  },

  onAdd: function () {
    var that = this
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'active-add',
      data: {
        enter: app.globalData.file_enter,
        name: that.data.name,
        tel: Number(that.data.tel),
        number: Number(that.data.number),
        school: that.data.school,
        classname: that.data.classname,
        activeType: that.data.activeType,
        remark: that.data.other,
        type: 'vip',
        time: that.data.time,
        code: Number(that.data.code),
        state: false,
      },
      success: function (res) {             //在返回结果中会包含新创建的记录的 _id
        that.setData({
          counterId: res._id,
          count: 1,
        })
        wx.showToast({
          title: '报名成功',
        })
        that.submitTemplateMessageForm()    //模版信息
      },
      fail: function (res) {
        wx.showToast({
          icon: 'fail',
          title: '报名失败',
        })
      }
    })
  },

  /* 模版信息 */
  submitTemplateMessageForm: function (e) {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: this.data.formId,
        name: this.data.name,
        number: this.data.number,
        school: this.data.school,
        classname: this.data.classname,
        tel: this.data.tel,
        active: this.data.activeType,
        time: this.data.time
      },
      success: res => {
        wx.showModal({
          title: '报名成功',
          content: '请返回微信主界面查看',
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
      }
    })
  }
})