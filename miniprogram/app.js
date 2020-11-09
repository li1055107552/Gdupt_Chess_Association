//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } 
    else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 小程序开发大赛 开启Debug
    // wx.setEnableDebug({
    //   enableDebug: true,
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
      }),
    

    this.globalData = {

      /**
       * 同时还需修改两个背景链接
       *  pages/index/index.wxss 
       * .backgroundImage{}
       * .card_2_background{}
       * 
       */ 
      directory:"https://tenyding.cn/photo/miniprogram/gdupt",

      userInfo:{
        // avatarUrl:"/miniprogram/img/logo.jpg"
      }
    }
    
    
  }
})
    

// "pages/study/study",

// "pages/index/index",
// "pages/login/login",
// "pages/news/news",
// "pages/active/active",
// "pages/admin/admin",
// "test/test",

// "pages/newcomers/newcomers",

// "pages/page_general/page_general",
//     "pages/page_general/usermsg/usermsg",
//     "pages/page_general/history/history",
//     "pages/page_general/active/active",
//     "pages/page_general/clock/clock",

// "pages/page_admin/my/my",
//   "pages/page_admin/my/usermsg/usermsg",
//   "pages/page_admin/my/history/history",
//   "pages/page_admin/my/active/active",
//   "pages/page_admin/my/clock/clock",

// "pages/page_admin/active/active",
//   "pages/page_admin/active/add/add",
//   "pages/page_admin/active/change/change",
//   "pages/page_admin/active/see/see",      
//   "pages/page_admin/active/QRcode/QRcode",

// "pages/page_admin/manage/manage",
//   "pages/page_admin/manage/changeMsg/changeMsg",
//   "pages/page_admin/manage/changeType/changeType",


//   "pages/study/CNchess/CNchess",
//   "pages/study/INTchess/INTchess",
//   "pages/study/weiqi/weiqi",
//   "pages/study/gobang/gobang",
//   "pages/study/sgs/sgs"