// pages/page_admin/manage/changeType/changeType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[[]],
    type:"member"
  },
  //修改用户类型
  type(e){
    console.log(e)
    this.setData({
      type:e.detail.value
    })
  },

  //增减空栏
  add(e){
    var array = this.data.array
    array.push([])
    this.setData({
      array:array
    })
  },
  cut(e){
    var array = this.data.array
    array.pop()
    this.setData({
      array:array
    })
  },

  //输入学号
  input(e){
    var array = this.data.array
    array[e.target.id] = Number(e.detail.value)
    this.setData({
      array:array
    })
  },
  //点击‘批量修改’
  submit(e){
    var i = 0
    var that = this
    var array = this.data.array
    console.log(array)
    for( i = 0; i < array.length; i++){
      if(array[i] == ""){
        wx.showToast({
          title: '仍存在空栏',
          icon:"none"
        })
        break
      }
      else if(String(array[i]).length != 11){
        wx.showToast({
          title: "第 " + (i+1) + ' 项学号长度不符',
          icon:"none"
        })
        break
      }
    }
    if(i == array.length)
      wx.showModal({
        title:"温馨提示",
        content:"是否确认更改共 " + array.length + " 位用户类型",
        success(res){
          if(res.confirm){
            that.cloud(array)
          }
        }
      })
  },

  //分流处理云端更新
  cloud(array){
    // 实现分布，否则会因回调的延迟>>循环所用的时间 导致学号冲突或遗漏
    for(var i=0;i<array.length;i++){
      this.check(array[i])
    }
  },
  // 检查用户是否存在、用户类型是否匹配
  check(number){
    var that = this
    wx.cloud.callFunction({
      name:"getMsg",
      data:{
        action:"single",
        collectName:"userList",
        key:"number",
        msg:number
      },
      success(res){
        console.log(res)
        if(res.result.length == 0)
          that.showModal("用户 " + number + " 不存在")
        else if(res.result.data.type == "admin"){
          that.showModal("用户" + number + "为管理员，不允许修改")
        }
        else if(res.result.data.type == that.data.type){
          that.showModal("用户 " + number + " 已为 " + that.data.type)
          that.clean(number)
        }
        else
          that.update(res.result.data._id,number)
      },
      fail:console.error
    })
  },
  // 更新用户类型
  update(id,number){
    var that = this
    wx.cloud.callFunction({
      name:"update_userList",
      data:{
        id:id,
        key:"type",
        data:that.data.type
      },
      success(res){
        console.log(res)
        that.showModal("用户 " + number + " 更新成功")
        that.clean(number)
      },
      fail:console.error
    })
  },
  // 清空已成功更新的学号
  clean(number){
    var array = this.data.array
    for(var i=0;i<array.length;i++){
      if(array[i] == number){
        array[i] = ""
        this.setData({
          array:array
        })
      }
    }
  },

  showModal(msg){
    wx.showModal({
      title:"温馨提示",
      content:msg,
      showCancel:false
    })
  }


})