// test/test.js

Page({

  onLoad:function(){
    var key = 'history.1.state'
    const db = wx.cloud.database()
    db.collection("userList").where({
      number:18034530129
    }).update({
      data:{
          [key]:'已签到'
      },
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
    /* 云函数 test */
    // wx.cloud.callFunction({
    //   name:"activeClock",
    //   data:{
    //     type:"getmsg",
    //     number:wx.getStorageSync('number'),
    //     activeCode:19004
    //   },
    //   success(res){
    //     console.log(res)
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
  },

  set(e){
    console.log(e)
    this.setData({
      nickname:e.detail.value
    })
    console.log(this.data.nickname)
  },
  number(e){
    console.log(e)
    this.setData({
      number:e.detail.value
    })
    console.log(this.data.number)
  },

  onAdd: function (e) {
    var nickname = this.data.nickname
    var number = this.data.number
    wx.cloud.callFunction({
      name:'test',
      data:{
        nickname:nickname,
        name:nickname,
        number:Number(number),
        tel:null,
        campus:   nickname,      //校区
        institute:nickname,      //学院
        major:    nickname,      //专业
        classname:nickname,      //班级
        password: 147896325,
        type:'vip',
        time:"2020-01-01 00:00:00"
      },
      success(res){
        console.log(res)
      }
    })
  }
})