// pages/page_admin/other/other.js
var app = getApp()
Page({
  /* 页面的初始数据 */
  data: {
    /* 静止 */
      show:false,
      search: '',            /* 搜索的学号 */
      id:'',                 /* 用户_id */
      nickname: '',          /* 用户名 */
      password: '********',  /* 密码 */
      number: '',            /* 学号 */

    /* 姓名 */
      name: '',
      name2: '',
      changeName: false,
      namebutton: '修改',
    /* 学院 */
      school: '',       
      school2:'',
      changeSchool:false,
      schoolbutton:'修改',
    /* 班级 */
      classname: '',    
      classname2: '',
      changeClassname: false,
      classnamebutton: '修改',
    /* 类型 */
      type: '',         
      type2:'',
      changeType: false,
      typebutton: '修改',
      choose_vip: '',
      choose_member: '',
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    /* 获取文件存放位置 */
      const fl = wx.cloud.database()
      fl.collection("admin").doc('member').get
        ({
          success: function (res) {
            console.log(res.data.enter)
            app.globalData.file_enter = res.data.enter
          }
        })
  },

  /* 绑定事件 */
    search: function (e) {
      this.setData({
        search: Number(e.detail.value)
      })
      console.log("搜索：" + this.data.search)
    },

    name: function (e) {
      this.setData(
        {
          name2: e.detail.value
        })
      console.log("姓名:" + this.data.name2)
    },

    school:function(e){
      this.setData(
        {
          school2: e.detail.value
        })
      console.log("学院:" + this.data.school2)
    },

    classname: function (e) {
      this.setData(
        {
          classname2: e.detail.value
        })
      console.log("班级:" + this.data.classname2)
    },

    type: function (e) {
      this.setData(
        {
          code: e.detail.value
        })
      console.log("密钥:" + this.data.code)
    },

    radioChange:function(e){
      console.log('radio发生change事件，携带value值为：',e.detail.value)
      this.setData({
        type2:e.detail.value
      })
      console.log(this.data.type2)
    },

  /* 搜索 */
    check_search: function () {
      wx.showLoading({
        title: '查询中...',
      })
      var that = this
      const fl = wx.cloud.database()
      console.log(app.globalData.file_enter)
      fl.collection(app.globalData.file_enter).where({ number: this.data.search }).get
        ({
          success: function (res) {
            console.log(res)
            if (res.data.length == 0) {
              wx.hideLoading()
              wx.showModal({
                content: '用户不存在',
                showCancel: false
              })
              that.setData({
                show:false
              })
            }
            else
            {
              wx.hideLoading()
              that.setData({
                show:true,
                id:res.data[0]._id,
                nickname : res.data[0].nickname,
                name : res.data[0].name,
                number : res.data[0].number,
                school : res.data[0].school,
                classname : res.data[0].classname,
                type : res.data[0].type
              })
            }
          }
        })
    },

  /* 昵称栏 */
    changeName: function () {
      console.log("更改姓名")
      this.setData({
        changeName: (!this.data.changeName),
      })
      if (this.data.namebutton == '修改') {
        this.setData({
          namebutton: '关闭'
        })
      }
      else
        this.setData({
          namebutton: '修改'
        })
    },

    update_name: function () {

      var that = this
      wx.showModal({
        title: '修改姓名',
        content: '确认新姓名为：' + this.data.name2,
        success:res =>{
          if(res.confirm)
          {
            wx.cloud.callFunction({
              name: 'admin-other-updata',
              data: {
                id: that.data.id,
                name: that.data.name2,
                enter:app.globalData.file_enter,
                action:'update_name',
              },
              success: function (res) {
                console.log(res.result)
                that.setData({
                  name: that.data.name2
                })
                wx.showModal({
                  content: '修改成功',
                  showCancel: false
                })
                that.changeName()
              },
              fail: console.error
            })
          }
        }
      })
    
    },

  /* 密码栏 */
    request_password: function () {
      var that = this
      wx.showModal({
        title: '重置密码',
        content:'是否确定重置密码',
        success(res) {
          if (res.confirm) {
            console.log(that.data.id)
            const db = wx.cloud.database()
            db.collection(app.globalData.file_enter).doc(that.data.id).update({
              data: {
                password: that.data.number
              },
              success: res => {
                wx.showModal({
                  content: '重置成功，新密码为学号',
                  showCancel: false,
                })

              },
            })
          }
        }
      })

    },

  /* 学院栏 */
    changeSchool:function(){
      console.log("更改学院")
      this.setData({
        changeSchool: (!this.data.changeSchool),
      })
      if (this.data.schoolbutton == '修改') {
        this.setData({
          schoolbutton: '关闭'
        })
      }
      else
        this.setData({
          schoolbutton: '修改'
        })
    },

    update_school: function () {
      var that = this
      wx.showModal({
        title: '修改学院',
        content: '确认新学院为：' + this.data.school2,
        success: res => {
          if (res.confirm) 
          {
            wx.cloud.callFunction({
              name: 'admin-other-updata',
              data: {
                id: that.data.id,
                school: that.data.school2,
                enter: app.globalData.file_enter,
                action: 'update_school',
              },
              success: function (res) {
                console.log(res.result)
                that.setData({
                  school: that.data.school2
                })
                wx.showModal({
                  content: '修改成功',
                  showCancel: false
                })
                that.changeSchool()
              },
              fail: console.error
            })
          }
        }
      })

    },

  /* 班级栏 */
    changeClassname: function () {
      console.log("更改学院")
      this.setData({
        changeClassname: (!this.data.changeClassname),
      })
      if (this.data.classnamebutton == '修改') {
        this.setData({
          classnamebutton: '关闭'
        })
      }
      else
        this.setData({
          classnamebutton: '修改'
        })
    },

    update_classname: function () {
      var that = this
      wx.showModal({
        title: '修改班级',
        content: '确认新班级为：' + this.data.classname2,
        success: res => {
          if (res.confirm) 
          {
            wx.cloud.callFunction({
              name: 'admin-other-updata',
              data: {
                id: that.data.id,
                classname: that.data.classname2,
                enter: app.globalData.file_enter,
                action: 'update_classname',
              },
              success: function (res) {
                console.log(res.result)
                that.setData({
                  classname: that.data.classname2
                })
                wx.showModal({
                  content: '修改成功',
                  showCancel: false
                })
                that.changeClassname()
              },
              fail: console.error
            })
          }
        }
      })

    },

  /* 类型栏 */
    changeType: function () {
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

      if (this.data.type == 'vip') {
        this.setData({
          choose_vip: true,
          choose_member: false
        })
      }
      else if (this.data.type == 'member') {
        this.setData({
          choose_vip: false,
          choose_member: true
        })
      }
    },

    update_type:function(){
      var that = this
      if(this.data.type == this.data.type2)
        this.changeType()
      else
      {
        wx.showModal({
          title: '修改身份',
          content: '确定将 ' + this.data.name + " 的身份更改为：" + this.data.type2,
          success(res){
            if(res.confirm)
            {
              wx.cloud.callFunction({
                name: 'admin-other-updata',
                data: {
                  id: that.data.id,
                  type: that.data.type2,
                  enter: app.globalData.file_enter,
                  action: 'update_type',
                },
                success: function (res) {
                  console.log(res.result)
                  that.setData({
                    type: that.data.type2
                  })
                  wx.showModal({
                    content: '修改成功',
                    showCancel: false
                  })
                },
                fail: console.error
              })
              that.changeType()
            }
          }
        })
      }

    },

  /* 获取报名数据 */
    getAll:function(e){
      var that = this
      var search_name
      var search_number
      var search_active
      const db = wx.cloud.database()
      db.collection('new-member').get({
        success: function (res) {
          // that.setData({
          //   search:true
          // })
          // for (var i = 0; i <= 20; i++)
          // {
          //   that.setData({
          //     search_name : res.data[i].name,
          //     search_number : res.data[i].number,
          //     search_active : res.data[i].activeType
          //   })
          //   search_name[i] = that.data.search_name
          //   search_number[i] = that.data.search_number
          //   search_active[i] = that.data.search_active
          // }
          // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
          console.log(res.data)
        }
      })
    },

})