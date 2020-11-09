// pages/page_vip/active/active.js
var app = getApp()
var util = require('../../../../utils/util.js')
Page({

  /* 页面的初始数据 */
  data: {
    index: 0,
    multiArray: [
      ['官渡校区', '西城校区'], 
      ['机电工程学院', '自动化学院', '电子信息工程学院', '计算机学院', '建筑工程学院','理学院','文法学院','体育学院','艺术与设计学院'], 
      ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程','安全工程'],
      ['16-1','16-2','17-1','17-2','18-1','18-2']
    ],
    
    multiIndex: [0, 0, 0, 0],

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

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log('test:' + data.multiIndex)
    switch (e.detail.column) {
      case 0:   //官渡校区
        switch (data.multiIndex[0]) { //校区
          case 0:   //官渡校区
            data.multiArray[1] = ['机电工程学院', '自动化学院', '电子信息工程学院', '计算机学院', '建筑工程学院', '理学院', '文法学院', '体育学院', '艺术与设计学院'];
            data.multiArray[2] = ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程', '安全工程'];
            data.multiArray[3] = ['16-1', '16-2', '17-1', '17-2', '18-1', '18-2'];
            break;
          case 1:   //西城校区
            data.multiArray[1] = ['石油工程学院', '化学工程学院', '化学学院', '材料科学与工程学院', '环境科学与工程学院', '生物与食品工程学院', '经济管理学院','外国语学院'];
            data.multiArray[2] = ['油气储运工程', '石油工程','资源勘测工程'];
            data.multiArray[3] = ['16-1', '16-2', '17-1', '17-2', '18-1', '18-2'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0
        break;
      case 1:
        switch (data.multiIndex[0]) {   //校区
          case 0:   //官渡校区
            switch (data.multiIndex[1]) {   //学院
              case 0:   //机电工程学院
                data.multiArray[2] = ['机械设计制造及自动化', '过程装备与控制工程', '材料成型及控制工程', '工业设计', '工业工程', '能源与动力工程', '焊接技术与工程', '安全工程'];
                break;
              case 1:   //自动化学院
                data.multiArray[2] = ['电气工程及其自动化（卓越班）', '电气工程及其自动化', '测控技术与仪器', '智能科学与技术', '自动化'];
                break;
              case 2:   //电子信息工程学院
                data.multiArray[2] = ['电子信息工程', '电子信息科学与技术'];
                break;
              case 3:   //计算机学院
                data.multiArray[2] = ['计算机科学与技术', '网络工程', '物联网工程'];
                break;
              case 4:   //建筑工程学院
                data.multiArray[2] = ['建筑学', '土木工程'];
                break;
              case 5:   //理学院
                data.multiArray[2] = ['教育技术学', '数学与应用数学', '信息与计算科学', '物理学', '地理科学','新能源科学与工程'];
                break;
              case 6:   //文法学院
                data.multiArray[2] = ['法学', '汉语言文学', '历史学', '学前教育（师范）'];
                break;
              case 7:   //体育学院
                data.multiArray[2] = ['社会体育指导与管理'];
                break;
              case 8:   //艺术与设计学院
                data.multiArray[2] = ['音乐表演', '音乐学', '环境设计'];
                break;
            }
            break;
          case 1:   //西城校区
            switch (data.multiIndex[1]) {    //班级
              case 0:   //石油工程学院
                data.multiArray[2] = ['油气储运工程', '石油工程','资源勘测工程'];
                break;
              case 1:   //化学工程学院
                data.multiArray[2] = ['化学工程与工艺（卓越班）', '化学工程与工艺','能源化学工程'];
                break;
              case 2:   //化学学院
                data.multiArray[2] = ['应用化学'];
                break;
              case 3:   //材料科学与工程学院
                data.multiArray[2] = ['高分子材料与工程'];
                break;
              case 4:   //环境科学与工程学院
                data.multiArray[2] = ['环境工程', '环保设备工程', '给排水科学与工程'];
                break;
              case 5:   //生物与食品工程学院
                data.multiArray[2] = ['食品科学与工程', '生物技术', '生物工程'];
                break;
              case 6:   //经济管理学院
                data.multiArray[2] = ['市场营销', '会计学', '国际经济与贸易'];
                break;
              case 7:   //外国语学院
                data.multiArray[2] = ['英语'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },

  onLoad: function () {
    wx.showLoading({
      title: '页面加载中',
    })
    var that = this
    /* 入口检测 */
      const st = wx.cloud.database()
      st.collection("admin").doc('active').get
      ({
        success: function (res) {
          console.log(res.data.state_admin)
          if (res.data.state_admin == false) {
            wx.showModal
              ({
                content: '报名入口关闭',
                showCancel: false,
                success(res) {
                  if (res.confirm)
                    wx.navigateBack({
                      delta: 1
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

    /* 获取时间 */
      var TIME = util.formatTime(new Date());
      this.setData({
        time: TIME
      })
      console.log("onload:" + this.data.time)

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
      console.log(this.data.code)
    wx.hideLoading()
  },

  /* 绑定事件 */
    tel: function (e) {
      this.setData(
        {
          tel: e.detail.value
        })
    },

    other: function (e) {
      this.setData(
        {
          other: e.detail.value
        })
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
      success: function (res) {
        console.log(res)
        // 在返回结果中会包含新创建的记录的 _id
        that.setData({
          counterId: res._id,
          count: 1,
        })
        wx.showToast({
          title: '报名成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        that.submitTemplateMessageForm()
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
          console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
          wx.showModal({
            title: '报名成功',
            content: '请返回微信主界面查看',
            showCancel: false,
            success: function (res) {
              if (res.confirm)
                setTimeout(function () {
                  /* 成功后跳转 */
                  wx.navigateTo({
                    url: '../page_admin',
                  }, 1600)
                })
            }
          })
        }
      })
    }

})