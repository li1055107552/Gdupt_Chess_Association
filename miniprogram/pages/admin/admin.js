// miniprogram/pages/active/active.js
var app = getApp()
Page({

  data: {
    name: "",
    state:"",
    active_code:'',
    member_code:'',
    vip_code:'',
    admin_code:'',
  },

  onLoad:function(){
    const fl = wx.cloud.database()
    fl.collection("admin").where({ _id: "active-enter" }).get
      ({
        success: function (res) {
          console.log(res.data[0].type)
          app.globalData.file_enter = res.data[0].type
        }
      }
      )
  },

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('active').add({
      data: {
        name:"admin",
        state:"able",
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '注册失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /* admin */
  changecode1:function(e){
    this.data.admin_code = ""
    var codelength = 24;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'n', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z')
    for (var i = 0; i < codelength; i++) {
      if (i != 0 && i % 4 == 0)
        this.data.admin_code += '-'

      if (i == 0)
        var index = Math.floor(Math.random() * 61 + 1)
      else
        var index = Math.floor(Math.random() * 62)
      this.data.admin_code += random[index];
    }
    console.log(this.data.admin_code)
    this.setData({
      admin_code: this.data.admin_code
    })

    const db = wx.cloud.database()
    db.collection('admin').doc('update_code').update({
      data: {
        to_admin: this.data.admin_code
      },
      success: console.log,
      fail: console.error,
    })
    module.exports.changecode1 = changecode1
  },
  
  /* vip */
  changecode2: function () {
    this.data.vip_code = ""
    var codelength = 16;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
    for (var i = 0; i < codelength; i++) {
      if(i!=0 && i%4==0)
        this.data.vip_code += '-'

      if (i == 0)
        var index = Math.floor(Math.random() * 35 + 1)
      else
        var index = Math.floor(Math.random() * 36)
      this.data.vip_code += random[index];
    }
    console.log(this.data.vip_code)
    this.setData({
      vip_code:this.data.vip_code
    })

    const db = wx.cloud.database()
    db.collection('admin').doc('update_code').update({
      data: {
        to_vip: this.data.vip_code
      },
      success: console.log,
      fail: console.error,
    })
    module.exports.changecode2 = changecode2
  },
  
  /* member */
  changecode3: function () {
    this.data.member_code = ""
    var codelength = 8;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F')
    for (var i = 0; i < codelength; i++) {
      if (i != 0 && i % 4 == 0)
        this.data.member_code += '-'

      if (i == 0)
        var index = Math.floor(Math.random() * 15 + 1)
      else
        var index = Math.floor(Math.random() * 16)
      this.data.member_code += random[index];
    }
    console.log(this.data.member_code)
    this.setData({
      member_code: this.data.member_code
    })

    const db = wx.cloud.database()
    db.collection('admin').doc('update_code').update({
      data: {
        to_member: this.data.member_code
      },
      success: console.log,
      fail: console.error,
    })
    module.exports.changecode3 = changecode3
  },

  /* active */
  changecode4:function(){
    /* 生成验证码 */
    this.data.active_code = ""
    var codelength = 8;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z')
    for (var i = 0; i < codelength; i++) {
      if (i == 0)
        var index = Math.floor(Math.random() * 35 + 1)
      else
        var index = Math.floor(Math.random() * 36)
      this.data.active_code += random[index];
    }
    console.log(this.data.active_code)
    this.setData({
      active_code: this.data.active_code
    })

    const db = wx.cloud.database()
    db.collection(app.globalData.file_enter).doc('active_code').update({
      data: {
        code: this.data.active_code
      },
      success:console.log,
      fail:console.error,
    })
    module.exports.changecode4 = changecode4
  },

  newcollection:function(){
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name:"test02",
      data:{
        collection:"19001"
      },
      success:function(res){
        console.log(res)
      },
      fail:console.error

    })
  },
})

