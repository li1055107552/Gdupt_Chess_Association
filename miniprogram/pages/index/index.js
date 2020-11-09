// pages/index/index.js
const app = getApp()
const DEFAULT_PAGE = 1;   //起始卡片
 
Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  canlogin:false,         //是否已授权
  image:[],

  data: {
    toView: `card_${DEFAULT_PAGE}`,
    list: ['比赛', '棋牌协会', '学习更多'],
    knowledge:"早在1956年，象棋就已经成为国家体育项目了哦~",
  },

  onLoad: function () {
    console.log(new Date().getTime())
    var that = this
    wx.getSystemInfo({
      success(res){
        that.setData({
          winHeight:res.windowHeight,
          winWidth:res.windowWidth
        })
      }
    })
    wx.getSetting({         //判断授权状态
      success(res) {
        if (res.authSetting['scope.userInfo'])  //如果已经授权
        {
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo
              that.canlogin = true
              that.setData({
                nickname:res.userInfo.nickName,
                avatarUrl:res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    this.getmsg()
  },

  // onReady(){
  //   var that = this
  //   const db = wx.cloud.database()
  //   var count
  //   db.collection("image").count({
  //     success(res){ count = res.total },
  //     complete(){
  //       for (let i = 0; i < count; i++) {
  //         db.collection("image").skip(i).limit(1).get({
  //           success(res){
  //             that.image.push(res.data[0])
  //           },
  //           complete(){
  //             if (that.image.length == count) {
  //               app.globalData['image'] = that.image
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })

  // },

  onShareAppMessage(){},

  getUserInfo: function (e) {     //获取个人信息
    console.log(e)
    if(e.detail.userInfo){
      console.log("确认授权")
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        nickname:e.detail.userInfo.nickName,
        avatarUrl:e.detail.userInfo.avatarUrl
      })
      if (!this.canlogin) {
        wx.showToast({
          title: '授权成功',
          icon:"none"
        })
        this.canlogin = true
      }
    } else{
      console.log("拒绝授权")
    }
  },
 
  // x轴变化 计算滑动的距离
  touchStart(e) {
    this.startPageX = e.changedTouches[0].pageX;
  },
  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.list.length - 1;
    if (Math.abs(moveX) >= 50){
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }
    this.setData({
      toView: `card_${this.currentView}`
    })
  },
  // 向左向右
  click(e){
    if(e.currentTarget.id == "left"){
      this.currentView = 0 
    }
    else{
      this.currentView = 2 
    }
    this.setData({
      toView: `card_${this.currentView}`
    })
  },

  //获取首页介绍信息
  getmsg(e){
    this.setData({
      introduce:"  棋牌协会成立于2001年11月，是一个以“活跃校园文化，丰富课外活动，引导棋协娱乐，提高棋协水平”为宗旨，以“立足学校，面向社会”为指导思想的学生志愿组织社团。"
    })
    // var that = this
    // const db = wx.cloud.database()
    //   db.collection("admin").doc('index_tips').get({
    //     success: function (res) {
    //       that.setData({
    //         notice: "公告：\n\n" + res.data.notice,
    //         introduce: res.data.introduce,
    //       })
    //     }
    //   })
  },

  login(e){
    console.log(e)
    var that = this
    if (this.canlogin) {
      wx.showModal({
        title:"温馨提示",
        content:"登录/报名",
        cancelText:"点错了",
        confirmText:"确定",
  
        success(res){
          if(res.confirm){
            wx.showModal({
              title:"温馨提示",
              content:"会员或参加过比赛的\n记得登录后再报名哦~",
              cancelText:"登录",
              cancelColor:"#576B95",
              confirmText:"直接报名",
              success(ress){
                if (ress.cancel) {
                  wx.navigateTo({
                    url: '../login/login?canlogin=' + that.canlogin + "&url=index", 
                  })
                }
                else if (ress.confirm) {
                  wx.navigateTo({
                    url: '../active/active',
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  gotoMiniprogram(e){
    switch (e.target.id) {
      case "clock":
        wx.navigateToMiniProgram({
          appId: 'wx4939436d39c4cc62',
        })
        break;
      case "Wegdupt":
        wx.navigateToMiniProgram({
          appId: 'wxd1eacf33b4ed0195',
        })
      default:
        break;
    }
    
  },

  study(e){
    console.log("激情四射")
    wx.showLoading({
      title: '模块加载中',
    })
    wx.navigateTo({
      url:"../study/study",
      complete(){
        wx.hideLoading()
      }
    })
  }

})
