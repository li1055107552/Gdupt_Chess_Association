// pages/newcomers/newcomers.js
var app = getApp()
var util = require('../../utils/util.js')
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
    counterId: '',
    code: '',
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    /* 获取成员保存位置 */
      const fl = wx.cloud.database()
      fl.collection("admin").where({ _id: "member" }).get
      ({
        success: function (res) {
          console.log(res.data[0].enter)
          app.globalData.file_enter = res.data[0].enter
        }
      })
    /* 获取时间 */
      var TIME = util.formatTime(new Date());
      this.setData({
        time: TIME
      })
      console.log("onload:" + this.data.time)
      
  },

  /* 绑定事件 */
    name: function (e) {
      this.setData({
        name: e.detail.value
      })
      console.log("name:" + this.data.name)
    },
    tel: function (e) {
      this.setData(
        {
          tel: e.detail.value
        })
      console.log("电话:" + this.data.tel)
    },
    number: function (e) {
      this.setData({
        number: e.detail.value
      })
      console.log("number:" + this.data.number)
    },
    school: function (e) {
      this.setData({
        school: e.detail.value
      })
      console.log("school:" + this.data.school)
    },
    classname: function (e) {
      this.setData({
        classname: e.detail.value
      })
      console.log("classname:" + this.data.classname)
    },
    other: function (e) {
      this.setData(
        {
          other: e.detail.value
        })
      console.log("other:" + this.data.other)
    },

    checkboxChange: function (e) {
      this.setData({
        checkbox: e.detail.value
      })
      console.log('checkbox发生change事件,携带value值为：', e.detail.value)
    },

  /* 检测 */
    check_submit: function (e) {
      this.setData({
        formId: e.detail.formId,
      })
      if (this.data.name == "") {
        wx.showToast({
          title: '请填写姓名',
          icon: 'none',
        })
        return false;
      }

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

      if (this.data.number == "") {
        wx.showToast({
          title: '请填写学号',
          icon: 'none',
        })
        return false;
      }

      if (this.data.number.length != 11) {
        wx.showToast({
          title: '请正确填写学号',
          icon: 'none',
        })
        return false;
      }

      if (this.data.school == "") {
        wx.showToast({
          title: '请填写学院',
          icon: 'none',
        })
        return false;
      }

      if (this.data.classname == "") {
        wx.showToast({
          title: '请填写班级',
          icon: 'none',
        })
        return false;
      }

      if (this.data.checkbox == "其他" && this.data.other == null) {
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
        var join = this.data.checkbox[0];
        for (var i = 1; i <= 4; i++) {
          if (this.data.checkbox[i] != undefined)
            join += "、" + this.data.checkbox[i]
        }
        this.setData({
          activeType: join
        })

        wx.showLoading({
          title: '校验中',
        })
        this.check_number();

      }
    },

    check_number: function (e) {
      var that = this
      const bd = wx.cloud.database()
      bd.collection("new-member").where({ number: Number(this.data.number) }).get
        ({
          success: function (res) {
            console.log(res.data.length)
            if (res.data.length != 0) {
              wx.hideLoading()
              wx.showModal({
                content: '学号已被登记',
                showCancel: false
              })
            }
            else
              that.onAdd()

          },
          fail: function (res) {
            wx.hideLoading()
            console.error
          }
        })
    },

  onAdd: function () {
    var that = this
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'active-add',
      data: {
        enter: 'new-member',
        name: that.data.name,
        tel: Number(that.data.tel),
        number: Number(that.data.number),
        school: that.data.school,
        classname: that.data.classname,
        activeType: that.data.activeType,
        remark: that.data.other,
        type: 'member',
        time: that.data.time,
        code: Number(that.data.code),
      },
      success: function (res) {
        console.log(res)
        // 在返回结果中会包含新创建的记录的 _id
        that.setData({
          counterId: res.result._id,
          count: 1,
        })
        wx.showToast({
          title: '申请成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res.result._id)
        that.submitTemplateMessageForm()
        that.newBulid();
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          icon: 'fail',
          title: '报名失败',
        })
      }
    })
  },

  newBulid:function(){
    
    /* 创建成员 */
      var that = this
      const db = wx.cloud.database()
      db.collection(app.globalData.file_enter).add({
        data: {
          nickname: that.data.name,
          name: that.data.name,
          number: Number(that.data.number),
          school: that.data.school,
          classname: that.data.classname,
          password: that.data.number,
          time: that.data.time,
          type: 'member',
          code: Number(),
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
  },

  submitTemplateMessageForm: function (e) {
    var that = this
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        formId: that.data.formId,
        name: that.data.name,
        number: that.data.number,
        school: that.data.school,
        classname: that.data.classname,
        tel: that.data.tel,
        active: that.data.activeType,
        time: that.data.time
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '申请成功',
          content: '请返回微信主界面查看',
          showCancel: false,
          success: function (res) {
            if (res.confirm)
              /* 成功后跳转 */
              wx.navigateBack({
                delta:2
              })
          },
          fail:console.error
        })
      }
    })
  },
  
  /* 用户点击右上角分享 */
  onShareAppMessage: function () {}
})