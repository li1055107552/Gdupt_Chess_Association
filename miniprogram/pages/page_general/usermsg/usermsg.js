// pages/page_general/usermsg/usermsg.js
Page({

  // 页面的初始数据
  data: {
    show:"显示",
    Cnickname:[false,"修改"],
    Cpassword:[false,"修改"],
    Ctel:[false,"修改"],
    Cqq:[false,"修改"]
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var type = wx.getStorageSync('type')
    if(type == "admin"){
      type = "管理员"
    } else if(type == "secretary"){
      type = "干事"
    } else if(type == "vip"){
      type = "会员"
    } else if(type == "member"){
      type = "普通成员"
    }
    this.setData({
      type:wx.getStorageSync('type'),
      nickname:wx.getStorageSync('nickname'),
      name:wx.getStorageSync('name'),
      number:wx.getStorageSync('number'),
      password:"******",
      campus:wx.getStorageSync('campus'),
      institute:wx.getStorageSync('institute'),
      major:wx.getStorageSync('major'),
      classname:wx.getStorageSync('classname'),
      tel:wx.getStorageSync('tel'),
      qq:wx.getStorageSync('qq'),
      time:wx.getStorageSync('time'),
      type:type
    })
  },

  // 修改按钮
  click(e){
    if(e.target.id == "show"){  //显示密码
      if(this.data.show == "显示"){
        this.setData({
          show:"隐藏",
          password:wx.getStorageSync('password')
        })
      } else{
        this.setData({
          show:"显示",
          password:"******"
        })
      }
    }
    else{
      switch(e.target.id){
        case "Cnickname":{
          if(this.data.Cnickname[0]){
            this.setData({
              Cnickname:[false,"修改"]
            })
          } else{
            this.setData({
              Cnickname:[true,"关闭"]
            })
          }
          break;
        }
        case "Cpassword":{
          if(this.data.Cpassword[0]){
            this.setData({
              Cpassword:[false,"修改"]
            })
          } else{
            this.setData({
              Cpassword:[true,"关闭"]
            })
          }
          break;
        }
        case "Ctel":{
          if(this.data.Ctel[0]){
            this.setData({
              Ctel:[false,"修改"]
            })
          } else{
            this.setData({
              Ctel:[true,"关闭"]
            })
          }
          break;
        }
        case "Cqq":{
          if(this.data.Cqq[0]){
            this.setData({
              Cqq:[false,"修改"]
            })
          } else{
            this.setData({
              Cqq:[true,"关闭"]
            })
          }
          break;
        }
      }
    }

  },

  // 输入新信息
  setnew(e){
    if(e.target.id == "Nnickname" || e.target.id == "Npassword"){
      this.setData({
        [e.target.id]:[e.detail.value,e.detail.value.length]
      })
    }
    else {
      this.setData({
        [e.target.id]:[Number(e.detail.value),e.detail.value.length]
     })
    }
  },

  // 提交按钮
  submit(e){
    var that = this
    switch(e.target.id){
      case "Snickname":{
        if(this.data.Nnickname){
          if(this.data.Nnickname[0] == this.data.nickname){
            this.showToast('不能与原昵称相同')
          }
          else{
            wx.showModal({
              title:"修改昵称",
              content:"新昵称: " + this.data.Nnickname[0] ,
              success(res){
                if(res.confirm){    // 点击确认
                  // 调用云更新数据库
                  that.cloudCheck()
                  // 
                }
              }
            })

          }
        }
      } break
      case "Spassword":{
        if(this.data.Npassword){
          if(this.data.Npassword[0] == this.data.password){
            this.showToast('不能与原密码相同')
          }
          else if(this.data.Npassword[1] < 6){
            this.showToast('密码长度不得小于6位哦')
          }
          else{
            wx.showModal({
              title:"修改密码",
              content:"新密码: " + this.data.Npassword[0],
              success(res){
                if(res.confirm){    // 点击确认
                  // 调用云更新数据库
                  that.updatemsg("password",that.data.Npassword[0],"psw")
                }
              }
            })

          }
        }
      } break
      case "Stel":{
        if(this.data.Ntel){
          var mobile = /^1[3456789]\d{9}$/;
          var isMobile = mobile.exec(this.data.Ntel[0])
          if(this.data.Ntel[0] == this.data.tel){
            this.showToast('不能与原来的号码的相同')
          }
          else if(this.data.Ntel[1] != 11 || !isMobile){
            this.showToast('请正确填写号码')
          }
          else{
            wx.showModal({
              title:"修改电话",
              content:"新电话: " + this.data.Ntel[0],
              success(res){
                if(res.confirm){    // 点击确认
                  // 调用云更新数据库
                  that.updatemsg("tel",Number(that.data.Ntel[0]),"tel")
                }
              }
            })

          }
        }
      } break
      case "Sqq":{
        if(this.data.Nqq){
          if(this.data.Nqq[0] == this.data.qq){
            this.showToast('不能与原来的QQ号相同')
          }
          else if(this.data.Nqq[1] < 6){
            this.showToast('请输入正确的QQ号')
          }
          else{
            wx.showModal({
              title:"修改QQ",
              content:"新QQ号: " + this.data.Nqq[0],
              success(res){
                if(res.confirm){    // 点击确认
                  // 调用云更新数据库
                  that.updatemsg("qq",Number(that.data.Nqq[0]),"qq")
                }
              }
            })

          }
        } break
      }
    }
  },

  // 调用云函数 更新个人信息
  updatemsg(key,data,type){   //key:数据库字段名  data:值   type:更新的类型
    var that = this
    wx.showLoading({
      title: '更新中...',
    })
    wx.cloud.callFunction({
      name:"update_userList",
      data:{
        id:wx.getStorageSync('id'),
        key:key,
        data:data
      },
      success(res){
        // 提示修改成功
        wx.hideLoading()
        wx.showModal({
          title:"温馨提示",
          content:"修改成功",
          showCancel:false
        })
        switch(type){
          case "qq": {
            // 更新缓存信息
            wx.setStorageSync('qq', Number(that.data.Nqq[0]))
            // 更新显示信息
            that.setData({
              qq:that.data.Nqq[0],
              Nqq:null,
              Cqq:[false,"修改"]
            })
          } break
          case "tel": {
            // 更新缓存信息
            wx.setStorageSync('tel', that.data.Ntel[0])
            // 更新显示信息
            that.setData({
              tel:that.data.Ntel[0],
              Ntel:null,
              Ctel:[false,"修改"]
            })
          } break
          case "psw":{
            // 更新缓存信息
            wx.setStorageSync('password', that.data.Npassword[0])
            // 更新显示信息
            that.setData({
              password:that.data.Npassword[0],
              Npassword:null,
              Cpassword:[false,"修改"]
            })
          } break
          case "nickname":{
            // 更新缓存信息
            wx.setStorageSync('nickname', that.data.Nnickname[0])
            // 更新显示信息
            that.setData({
              nickname:that.data.Nnickname[0],
              Nnickname:null,
              Cnickname:[false,"修改"]
            })
          }
        }
        
      }
    })
  },

  // 云端检测昵称是否可用
  cloudCheck(e){
    wx.showLoading({
      title: '检测中...',
    })
    var that = this
    wx.cloud.callFunction({
      name:"checkMsg",
      data:{
        type:"nickname",
        msg:that.data.Nnickname[0],
        collectName:"userList"
      },
      success(res){
        // 该昵称没被使用
        if(res.result == 0){
          that.updatemsg("nickname",that.data.Nnickname[0],"nickname")
        }
        else{
          that.showToast("昵称已被使用")
        }
      }
    })
  },

  showToast(msg){
    wx.showToast({
      title: msg,
      icon:"none"
    })
  }

})