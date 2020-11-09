// pages/login/login.js
var app = getApp()
Page({

  data: {
    number:'',
    password:"",
  },

  onLoad:function(e){
    console.log(e)
    this.setData({
      canlogin:e.canlogin
    })
    // 入口检测
    const st = wx.cloud.database()
    st.collection("admin").doc('member').get
    ({
      success: function (res) {
        if (res.data.state == false) {    //判断结果
          wx.showModal({
            content: '登陆入口暂时关闭',
            showCancel: false,
            success(res) {
              if (res.confirm)
                wx.navigateTo({
                  url: '../index/index',  //返回主页
                })
              else
                wx.navigateTo({
                  url: '../index/index',  //返回主页
                })
            }
          })
        }
      },
      fail:console.error
    })

    wx.clearStorage()
    wx.setStorageSync('from', e.url)
  },

  onShow:function(){
    if(wx.getStorageSync('from') == "index"){
      var that = this
      wx.cloud.callFunction({
        name:'login',
        data:{
          action:"trylogin"
        },
        success:function(res){
          if(res.result != false){
            that.inquiry(res);  //进入询问
          }
        },
        fail:console.error
      })
    }
  },

  /* 绑定事件 */
    number: function (e) {
      this.setData(
        {
          long: e.detail.value.length,
          number: Number(e.detail.value)
        })
    },
    password:function(e){
      this.setData({
        password:e.detail.value
      })
    },

    // 注册新用户
    newUsers:function(){
      wx.navigateTo({
        url: '../news/news',
      })
    },

    // 本地校验
    check_submit:function(){
        if(this.data.number == 18034530129 && this.data.password == 92103543081)
          wx.navigateTo({
            url: '../admin/admin',
          })

        if (this.data.number == null || this.data.number == "")
          wx.showToast({
            icon: "none",
            title: '请输入学号',
          })

        else if (this.data.long != 11)
          wx.showToast({
            icon: "none",
            title: '请正确填写学号',
          })

        else if (this.data.password == "")
          wx.showToast({
            icon: "none",
            title: '请输入密码',
          })
        else
          this.check()
    },

    // 云端校验
    check:function(){
      var that = this
      wx.showLoading({
        title: '校验中',
      })

      wx.cloud.callFunction({
          name: "login",
          data: {
            action: "login",
            number: that.data.number,
            password: that.data.password,
          },
          success: function (res) {
            console.log("login success" + res)
            if (res.result == "T"){
              that.saveMsg(that.data.number);
            }
            else if (res.result == "F"){
              wx.hideLoading()
              wx.showModal({
                title: '温馨提示',
                content: '帐号密码错误',
                showCancel:false
              })
            }
            else if (res.result == "N"){
              wx.hideLoading()
              wx.showModal({
                title: '温馨提示',
                content: '用户不存在',
                showCancel: false
              })
            }
          },
          fail: console.error
      })
    },

  // 跳转前保存信息 并且跳转页面
  saveMsg(e){
    var that = this
    const db = wx.cloud.database()
    console.log("saveMsg")
    db.collection("userList").where({ number:e }).get({
      success:function(res){
        console.log(res)
        /* 跳转前，信息保存至本地缓存 */
        {
          wx.setStorageSync('id', res.data[0]._id)              //id
          wx.setStorageSync('name', res.data[0].name)           //名称
          wx.setStorageSync('nickname', res.data[0].nickname)   //昵称
          wx.setStorageSync('number', res.data[0].number)       //学号
          wx.setStorageSync('password', res.data[0].password)   //密码
          wx.setStorageSync('campus', res.data[0].campus)       //校区
          wx.setStorageSync('institute', res.data[0].institute) //学院
          wx.setStorageSync('major', res.data[0].major)         //专业
          wx.setStorageSync('classname', res.data[0].classname) //班级
          wx.setStorageSync('tel', res.data[0].tel)             //电话
          wx.setStorageSync('qq', res.data[0].qq)               //QQ
          wx.setStorageSync('time', res.data[0].time)           //时间
          wx.setStorageSync('type', res.data[0].type)           //类型
        }
        wx.showToast({
          title: '登陆成功',
          duration:600
        })
        /* 判断跳转页面 */
        if (res.data[0].type == 'member' || res.data[0].type == 'vip' || res.data[0].type == 'secretary') {
          setTimeout(function () {
            wx.navigateTo({
              url: '../page_general/page_general?canlogin=' + that.data.canlogin,
            })
          }, 600)
        }
        else if (res.data[0].type == 'admin') {
          setTimeout(function () {
            wx.reLaunch({
              url: '../page_admin/my/my?canlogin=' + that.data.canlogin,
            })
            // that.tab()
          }, 600)                    
        }
      },
      fail:console.error
    })
  },
  
  inquiry(e){
    var that = this
    wx.showModal({
      title:'提示',
      content:'是否登录:' + e.result.nickname,
      confirmText:'一键登录',
      confirmColor:'#04BE02',
      cancelText:'暂不登录',
      success(res){
        if(res.confirm){
          that.saveMsg(e.result.number)
        }
      }
    })
  },

  /* 用户点击右上角分享 */
   onShareAppMessage: function () { },
   
   /*生命周期函数--监听页面卸载 */
   onUnload: function () {
     // wx.clearStorageSync()
   }

})