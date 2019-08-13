// miniprogram/pages/active/active.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    name:"",
    tel:"",
    number:"",
    school:"",
    classname:"",
    activeType:"",
    formId:"",
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 入口检测 */
  onLoad:function(){
    const st = wx.cloud.database()
    st.collection("admin").where({ _id: "active-state"}).get
      ({
        success: function (res) {
          console.log(res.data[0].state)
          if (res.data[0].state == false)
           { wx.showModal
              ({
                content: '报名入口关闭',
                showCancel: false,
              success(res){
                if(res.confirm)
                  wx.navigateTo({
                    url: '../index/index',
                  })
              }
              })
           }
        }
      })
    
    /* 获取文件存放位置 */  
    const fl = wx.cloud.database()
    fl.collection("admin").where({ _id: "active-enter" }).get
      ({
        success: function (res) {
          console.log(res.data[0].type)
            app.globalData.file_enter = res.data[0].type
          }
        }
      )

    /* 获取时间 */
    var TIME = util.formatTime(new Date());
    this.setData({
      time:TIME
    })
    console.log("onload:"+this.data.time)
  },
    
  /* 绑定事件 */
    name: function(e) {
      this.setData(
        {
          name: e.detail.value
        })
      console.log("姓名:" + this.data.name)
    },
    tel: function (e) {
      this.setData(
        {
          tel: e.detail.value
        })
      console.log("电话:" + this.data.tel)
    },
    number: function (e) {
      this.setData(
        {
          number: e.detail.value
        })
      console.log("学号:" + this.data.number)
    },
    school: function (e) {
      this.setData(
        {
          school: e.detail.value
        })
      console.log("学院:" + this.data.school)
    },
    classname: function (e) {
      this.setData(
        {
          classname: e.detail.value
        })
      console.log("班级:" + this.data.classname)
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
      bd.collection("active").where({ number: this.data.number }).get
        ({
          success: function (res) {
            console.log(res.data[0].number)
            if (res.data[0].number != null)
              wx.showModal
                ({
                  content: '学号已被登记',
                  showCancel: false,
                })
          }
        })
    },

    check_submit: function (e) {

      if (this.check_number());
      if (this.data.name == "") 
      {
          wx.showToast({
            title: '请填写姓名',
            icon: 'none',
          })
          return false;
      }

      if (this.data.tel == "") 
      {
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

      if (this.data.number == "") 
      {
          wx.showToast({
            title: '请填写学号',
            icon: 'none',
          })
          return false;
      }

      if (this.data.number.length != 11) 
      {
          wx.showToast({
            title: '请正确填写学号',
            icon: 'none',
          })
          return false;
      }

      if (this.data.school == "") 
      {
          wx.showToast({
            title: '请填写学院',
            icon: 'none',
          })
          return false;
      }

      if (this.data.classname == "") 
      {
          wx.showToast({
            title: '请填写班级',
            icon: 'none',
          })
          return false;
        }

      if (this.data.checkbox == "other" && this.data.other == null) 
      {
          wx.showModal({
            title:'提示',
            content:'请备注“其他”',
            icon: 'none',
            showCancel: false,
          })
          return false;
        }

      if (this.data.checkbox == null) 
      {
          wx.showToast({
            title: '请选择活动',
            icon: 'none',
          })
          return false;
      }
        
      else
      {
        console.log(this.data.checkbox[0] + " " + this.data.checkbox[1] + " " + this.data.checkbox[2])
          setTimeout(this.onAdd,500)
          return true;
      }
      
    },

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection(app.globalData.file_enter).add({
      data: {
        name: this.data.name,
        tel: this.data.tel,
        number: this.data.number,
        school: this.data.school,
        classname: this.data.classname,
        activeType: this.data.checkbox,
        time:this.data.time,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1,
        })
        wx.showToast({
          title: '报名成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        /* 成功后跳转 */
        setTimeout(function () {
          wx.navigateTo({
            url: '../index/index',
          })
        }, 1600)
      }
    })
  },
  
  /* 模版信息 */
  submitTemplateMessageForm:function(e) {
        if(this.check_submit() == true){
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'sendTemplateMessage',
            formId: e.detail.formId,
            name:this.data.name,
            number:this.data.number,
            school:this.data.school,
            classname:this.data.classname,
            tel:this.data.tel,
            active: this.data.checkbox[0] + " " + this.data.checkbox[1] ,
            time:this.data.time
          },
          success: res => {
            console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
            wx.showModal({
              title: '报名成功',
              content: '请返回微信主界面查看',
              showCancel: false,
            })
            wx.showToast({
              title: '报名成功，请返回微信主界面查看',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '报名失败-云',
            })
            console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
          }
        })
      }
  }

})

