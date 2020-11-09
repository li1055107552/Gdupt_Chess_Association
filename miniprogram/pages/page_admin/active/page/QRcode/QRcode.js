// pages/page_admin/active/QRcode/QRcode.js

const QRCode = require('../../../../../utils/weapp-qrcode.js')
const base64 = require('../../../../../utils/base64.js')
import rpx2px from '../../../../../utils/rpx2px.js'
let qrcode;
const qrcodeWidth = rpx2px(300)

Page({

  // 页面的初始数据
  data: {
    image: '',
    // 用于设置wxml里canvas的width和height样式
    qrcodeWidth: qrcodeWidth,
    imgsrc: '',
    code:19001
  },

  onReady() {
    const z = this
    qrcode = new QRCode('canvas', {
      usingIn: this, 
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "black",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },

  code(e){
    this.setData({
      code:Number(e.detail.value)
    })
  },

  search(e){
    var that = this
    wx.showLoading({
      title: '搜索中...',
    })
    that.setData({
      show:false,
      showQR:false
    })
    wx.cloud.callFunction({
      name:'getMsg',
      data:{
        action:"single",
        collectName:"active",
        key:"activeCode",
        msg:this.data.code
      },
      success(res){
        console.log(res)
        if (res.result.length != 0) {
          wx.hideLoading()
          that.setData({
            show:true,
            activeCode:res.result.data.activeCode,
            activeArea:res.result.data.acticeArea,
            activeName:res.result.data.activeName,
            who:res.result.data.who
          })
        }
        else{
          wx.hideLoading()
          wx.showModal({
            title:"温馨提示",
            content:"活动编码不存在",
            showCancel:false
          })
          that.setData({
            show:false
          })
        }
      },
      fail:console.error
    })
  },

  confirmHandler: function(e) {
    let {
      value
    } = e.detail
    this.renderCode(value)
  },
  renderCode(value) {
    const z = this
    wx.showLoading({
      title: '生成中...',
    })
    qrcode.makeCode(value, () => {
      wx.hideLoading()
      qrcode.exportImage(function(path) {
        // console.log(path)    //二维码存储位置
        z.setData({
          imgsrc: path
        })
      })
    })
  },
  get(e){
    this.setData({
      showQR:true
    })
    var text = base64.encode("activeCode:" + this.data.code)
    this.renderCode(text)
  },

  // 长按保存
  save: function() {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function(path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
            })
          })
        }
      }
    })
  }

})