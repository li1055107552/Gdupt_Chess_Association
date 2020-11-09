// test/test.js
Page({

  onLoad: function () {
    // var that = this
    // const db = wx.cloud.database()
    // var total
    // db.collection('A19001').count({
    //   success(res){
    //     total = 1
    //     console.log(res)
    //   },
    //   fail(res){
    //     console.log("集合不存在")
    //     total = -1
    //   },
    //   complete(res){
    //     console.log(total)
    //     if(total == 1){
    //       that.test()
    //     }
    //   }
    // })


    // var key = 'history.1.state'
    // const db = wx.cloud.database()
    // db.collection("userList").where({
    //   number:18034530129
    // }).update({
    //   data:{
    //       [key]:'已签到'
    //   },
    //   success(res){
    //     console.log(res)
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
    /* 云函数 test */
    // var that = this
    // wx.cloud.callFunction({
    //   name:"test",
    //   success(res){
    //     console.log(res)
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
    // wx.cloud.callFunction({
    //   name:'activeList',
    //   data:{
    //     type:'member'
    //   },
    //   success:function(res){
    //     console.log(res)
    //     if(res.result.length != 0){
    //       that.setData({
    //         activeList:res.result.data,
    //         isshow:true
    //       })
    //     } else{
    //       wx.showToast({
    //         title: 'no',
    //         icon:"none"
    //       })
    //     }

    //   },
    //   fail:console.error

    // })

  },
  onShow(){
    // this.promisetest();
  },

  test(e) {
    console.log("enter")
  },

  action(e) {
    console.log(e)
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['ph4wTjTOU4bIh8BUojs_NPutyf0b4SBl0mMeozB1Ty4'],
      success(res) {
        console.log(res)
        that.send()
      },
      fail: console.error
    })
  },

  send(e) {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendSubscribeMessage',
        name: '细粒丁',
        activeName: '测试类',
        activeArea: '图书馆门前',
        activeTime: '2020-01-01 8:00:00'
      },
      success(res) {
        console.log(res)
      },
      fail: console.error
    })
  },

  set(e){
    this.setData({
      name:e.detail.value
    })
  },
  exchange() {
    var that = this
    wx.chooseImage({
      success: res => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            var base64 = 'data:image/png;base64,' + res.data
            console.log(base64)
            that.callFunction(base64)
          }
        })

        //以下两行注释的是同步方法，不过我不太喜欢用。
        //let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64') 
        //console.log(base64)
      }
    })

    // wx.chooseImage({
    //   success: function (res) {
    //     console.log(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"))
    //   },
    // })

  },

  callFunction(base64){
    var name = this.data.name
    wx.cloud.callFunction({
      name:"Img-Base64",
      data:{
        name:name,
        url:base64
      },
      success(res){
        console.log(res)
      },
      fail:console.error
    })
  },

  onAdd: function (e) {
    var nickname = this.data.nickname
    var number = this.data.number
    wx.cloud.callFunction({
      name: 'test',
      data: {
        nickname: nickname,
        name: nickname,
        number: Number(number),
        tel: null,
        campus: nickname, //校区
        institute: nickname, //学院
        major: nickname, //专业
        classname: nickname, //班级
        password: 147896325,
        type: 'vip',
        time: "2020-01-01 00:00:00"
      },
      success(res) {
        console.log(res)
      }
    })
  },

  promisetest(){
    var list = ["CNchess.png","INTchess.png","weiqi.png","gobang.png","sgs.png"]
    var url = "https://cloud.tenyding.cn/photo/miniprogram/edupt/study_Img/"
    link(list,url).then(
      (res) => {
        console.log(res)
      }
    ).catch(
      (res) => {
        console.log(res)
      }
    )
  }

})

function link(list,url){
  return new Promise(function (resolve,reject) {
    var path = []
    for (let i = 0; i < list.length; i++) {
      getphoto(url + list[i]).then(
        (res) => {
          console.log("第" + i + "个： " + res)
          path[i] = res
        }
      ).catch(
        (res) => {
          console.log(res)
        }
      )
      console.log("next")
    }

    
  })
}

function getphoto(url) {
  return new Promise(function (resolve,reject) {
    wx.downloadFile({
      url: url,
      success(res){

        save(res.tempFilePath).then(
          (ress) => {
            resolve(ress)
          }
        ).catch(
          (ress) => {
            console.log(ress)
          }
        )
        
      },
      fail:(error) =>{
        reject(error)
      }
    })
  })
}

function save(tempFilePath){
  return new Promise(function (resolve,reject) {
    const fs = wx.getFileSystemManager()
    fs.saveFile({
      tempFilePath: tempFilePath,
      success(res){
        resolve(res.savedFilePath)
      },
      fail:(error) => {
        reject(error)
      }
    })
  })
}
