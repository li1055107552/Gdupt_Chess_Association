// pages/study/study.js
const app = getApp()
const current_directory = app.globalData.directory + "/study_Img/"
Page({
  // 页面的初始数据
  data: {
    list:[
      {
        name:"CNchess",
        image: current_directory + "CNchess.png",
        // image:"https://6764-gdupt-qx-1300020785.tcb.qcloud.la/study_Img/CNchess.png?sign=d47852dad22945122174aac9b26d8da4&t=1587004662",
        CN:"中国象棋",
        EN:"Chinese Chess"
      },
      {
        name:"INTchess",
        image: current_directory + "INTchess.png",
        // image:"https://6764-gdupt-qx-1300020785.tcb.qcloud.la/study_Img/INTchess.png?sign=8efae8eedc6109aea37c2b3f3ed24205&t=1587004695",
        CN:"国际象棋",
        EN:"International Chess"
      },
      {
        name:"weiqi",
        image: current_directory + "weiqi.png",
        // image:"https://6764-gdupt-qx-1300020785.tcb.qcloud.la/study_Img/weiqi.png?sign=907fcb8cdded4b42c4ca8b45e86bf32c&t=1587004713",
        CN:"围棋",
        EN:"The Game Of Go"
      },
      {
        name:"gobang",
        image: current_directory + "gobang.png",
        // image:"https://6764-gdupt-qx-1300020785.tcb.qcloud.la/study_Img/gobang.png?sign=5cd096ba7761132a268e69fe3d8891e7&t=1587004735",
        CN:"五子棋",
        EN:"Gobang"
      },
      {
        name:"sgs",
        image: current_directory + "sgs.png",
        // image:"https://6764-gdupt-qx-1300020785.tcb.qcloud.la/study_Img/sgs.png?sign=723d4d7f0b1b7bad635975833cd835ec&t=1587004751",
        CN:"三国杀",
        EN:"Killers Of Three Kingdom"
      }
    ],
    background_url: current_directory + "indexBackground.jpg"
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success(res){
        that.setData({
          winHeight:res.screenHeight + 25,
          winWidth:res.windowWidth
        })
      }
    })
    var urlB = wx.getStorageSync('background_url')
    if(urlB == ""){
      wx.downloadFile({
        url: current_directory + "indexBackground.jpg",
        success(res){
          const fs = wx.getFileSystemManager()
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res){
              wx.setStorageSync("background_url",res.savedFilePath)
              that.setData({ background_url: res.savedFilePath })
            }
          })
        },
        fail:function(e){
          wx.showToast({
            title: '背景下载失败',
            icon:"none"
          })
        }
      })
    }
    else{
      this.setData({
        background_url:urlB
      })
    }
  },

  onReady(){
    var list = this.data.list
    var listname = []
    var savedFilePath = []
    for (let i = 0; i < list.length; i++) {
      listname[i] = list[i].name
    }

    var icon = wx.getStorageSync('study_icon')

    if(icon.length < 5 || icon.indexOf(null) != -1 ){
      // 删除原有文件
      const fs = wx.getFileSystemManager()
      for (let i = 0; i < icon.length; i++) {
        if (icon[i] != null) {
          console.log("删除" + i + ":" + icon[i])
          fs.unlinkSync(icon[i])
        }
      }
      // 重新下载
      console.log("download icon")
      for (let i = 0; i < listname.length; i++) {
        wx.downloadFile({
          url: current_directory + listname[i] + ".png",
          success(res){
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              success(res){
                savedFilePath[i] = res.savedFilePath
                console.log("第" + i + "个：" + savedFilePath[i])
              },
              fail:console.error
            })
          },
          fail:console.error
        })
      }
      setTimeout(() => {
        console.log(savedFilePath)
        wx.setStorageSync('study_icon', savedFilePath)
      }, 10000);
      
    }
    else{
      for (let i = 0; i < list.length; i++) {
        list[i].image = icon[i]
      }
      this.setData({
        list:list
      })
    }
    
  },

  // 用户点击右上角分享
  onShareAppMessage(){},

  click(e){
    switch (e.currentTarget.id) {
      case "CNchess":{
        wx.navigateTo({
          url: "page/" + e.currentTarget.id + "/" + e.currentTarget.id,
        })
        break
      }
      case "INTchess":
      case "weiqi":
      case "gobang":
      case "sgs":
        wx.showToast({
          title: '敬请期待',
          icon:"none"
        })
      break;
    }
    
  }

})
