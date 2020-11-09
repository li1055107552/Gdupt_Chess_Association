// pages/page_admin/manage/changeMsg/changeMsg.js

var classlist = require('../../../../../utils/classlist.js')
var util = require('../../../../../utils/util.js')
Page({

  //页面的初始数据
  data: {
    find:false,
    password:"********",
    Cnumber:[false,"修改",null],
    Cname:[false,"修改",null],

    multiArray:[],
    institute:[],   //校区[0] + 学院[1]
    classname:[],   //专业[0] + 届数[1] + 班级[2]
    IIndex:[0,0],   //校区[0] + 学院[1]
    CIndex:[0,0,0]  //专业[0] + 届数[1] + 班级[2]
  },

  onLoad(e){
    /* 获取班级列表 */
    {
      this.setData({
        multiArray: classlist.getmultiArray()
      }) 
      this.setData({
        institute:[
          this.data.multiArray[0],
          this.data.multiArray[1]
        ],
        classname:[
          this.data.multiArray[2],
          this.data.multiArray[3],
          this.data.multiArray[4]
        ]
      })
    }
  },
  
  // 输入学号
  code(e){
    this.setData({
      code:Number(e.detail.value)
    })
  },
  // 搜索学号
  search(e){
    var that = this
    if(String(this.data.code).length != 11){
      wx.showToast({
        title: '学号长度不正确',
        icon:"none"
      })
    }
    else{
      wx.showLoading({
        title: '搜索中...',
      })
      wx.cloud.callFunction({
        name:'getMsg',
        data:{
          action:"single",
          collectName:"userList",
          key:"number",
          msg:that.data.code
        },
        success(res){
          if(res.result.length != 0){
            if(res.result.data.type != "admin" || res.result.number == wx.getStorageSync('number') || wx.getStorageSync('number') == 12345678910){
              that.showclass(res)
              that.setData({
                id:res.result.data._id,
                name:res.result.data.name,
                nickname:res.result.data.nickname,
                number:res.result.data.number,
                type:res.result.data.type,
                Ycampus:res.result.data.campus,
                Yinstitute:res.result.data.institute,
                Ymajor:res.result.data.major,
                Yclassname:res.result.data.classname,
                find:true
              })
              wx.hideLoading()
            }
            else{
              wx.showToast({
                title: '该用户为管理员，不允许更改',
                icon:"none"
              })
              that.setData({
                find:false
              })
            }
            
          }
          else{
            that.setData({
              find:false
            })
            wx.showToast({
              title: '尚未找到该学号的信息或学号不存在',
              icon:"none"
            })
          }
            
        },
        fail:console.error
      })
    }
    

  },

  // 显示班级信息
  showclass(res){
    //匹配当前校区
    for(let i=0;i<this.data.institute[0].length;i++){
      if (res.result.data.campus == this.data.institute[0][i]) {
        var detail = {
          column:0,
          value:i
        }
        var e = {
          detail
        }
        this.instituteColumnChange(e)
        break
      }
    }
    //匹配学院
    for(let i=0;i<this.data.institute[1].length;i++){
      if(res.result.data.institute == this.data.institute[1][i]){
        var detail = {
          column:1,
          value:i
        }
        var e = {
          detail
        }
        this.instituteColumnChange(e)
        break
      }
    }
    //匹配专业
    for(let i=0;i<this.data.classname[0].length;i++){
      if (res.result.data.major == this.data.classname[0][i]) {
        var detail = {
          column:0,
          value:i
        }
        var e = {
          detail
        }
        this.classnameColumnChange(e)
        break 
      }
    }
    
    var classname = (res.result.data.classname).split("-")
    //匹配届数
    for(let i=0;i<this.data.classname[1].length;i++){
      if (classname[0] == this.data.classname[1][i]) {
        var detail = {
          column:1,
          value:i
        }
        var e = {
          detail
        }
        this.classnameColumnChange(e)
        break 
      }
    }
    //匹配班级
    for(let i=0;i<this.data.classname[2].length;i++){
      if (classname[1] == this.data.classname[2][i]) {
        var detail = {
          column:2,
          value:i
        }
        var e = {
          detail
        }
        this.classnameColumnChange(e)
        break 
      }
    }
  },

  /* 校区 + 学院 改变下标 */
  instituteColumnChange:function(e){
    var changeValue = classlist.instituteColumnChange(this.data.IIndex[0],e.detail.column,e.detail.value)  //当前的下标+列数+值
    this.setData({
      institute:changeValue.IArray,
      classname:changeValue.CArray,
      IIndex:changeValue.IIndex,
      CIndex:[0,0,0]
    })
  },
  /* 专业 + 届数 + 班级 改变下标 */
  classnameColumnChange:function(e){
    var data = this.data.CIndex
    data[e.detail.column] = e.detail.value
    this.setData({
      CIndex:data
    })

  },

  // 点击修改按钮
  click(e){
    var that = this
    // 点击姓名修改按钮
    if(e.target.id == "Cname"){
      if(!this.data.Cname[0]){
        this.setData({
          Cname:[true,"收起",null]
        })
      }
      else{
        this.setData({
          Cname:[false,"修改",null]
        })
      }
    }
    // 点击修改学号
    if(e.target.id == "Cnumber"){
      if(!this.data.Cnumber[0]){
        wx.showModal({
          title:"温馨提示",
          content:"学号为重要的唯一搜索关键字\n是否确定更改",
          success(res){
            if (res.confirm) {
              that.setData({
                Cnumber:[true,"收起",null]
              })
            }
          }
        })
      }
      else{
        this.setData({
          Cnumber:[false,"修改",null]
        })
      }
    }
  },
  // 输入新的信息
  setnew(e){
    if (e.target.id == "Cnumber") {
      var Cnumber = this.data.Cnumber
      Cnumber[2] = Number(e.detail.value)
      this.setData({
        Cnumber:Cnumber
      })
    }
    if (e.target.id == "Cname") {
      var Cname = this.data.Cname
      Cname[2] = e.detail.value
      this.setData({
        Cname:Cname
      })
    }
  },
  // 点击提交按钮
  submit(e){
    var that = this
    console.log(e)
    // 修改学号
    if(e.target.id == "Snumber"){
      if (that.data.Cnumber == that.data.code) {
        this.tips("与当前学号相同")
      }
      else{
        if(that.data.Cnumber[2] != null && that.data.Cnumber[2] != "" && String(that.data.Cnumber[2].length) == 11 )
          wx.showModal({
            title:"温馨提示",
            content:"再次提醒，学号为重要所搜关键字\n是否确定更改",
            success(res){
              if (res.confirm) {
                wx.showModal({
                  title:"温馨提示",
                  content:"新学号：" + that.data.Cnumber[2],
                  confirmText:"确认修改",
                  confirmColor:'#04BE02',
                  cancelText:"信息有误",
                  cancelColor:"#FF0000",
                  success (res) {
                    if (res.confirm) {
                      wx.showLoading({
                        title: '检测中...',
                      })
                      // 查看新学号是否已被使用
                      wx.cloud.callFunction({
                        name:"checkMsg",
                        data:{
                          type:"number",
                          msg:that.data.Cnumber[2],
                          collectName:"userList"
                        },
                        success(res){
                          console.log(res)
                          //学号已被占用
                          if(res.result >= 1){
                            wx.hideLoading()
                            wx.showModal({
                              title:"温馨提示",
                              content:"该学号已被使用",
                              showCancel:false
                            })
                            //点击收起按钮
                            that.setData({
                              Cnumber:[false,"修改",null]
                            })
                          }
                          //学号没被占用
                          else{
                            that.callFunction("number",that.data.Cnumber[2],"更改成功",1)
                            that.setData({
                              find:false,
                              code:null
                            })
                          }
                        }
                      })
                    }
                    // 信息有误
                    else{
                      that.setData({
                        Cnumber:[false,"修改",null]
                      })
                    }
                  }
                })
              }
              // 再次提醒时 没按确定
              else{
                that.setData({
                  Cnumber:[false,"修改",null]
                })
              }
            }
          })
        // 学号为空
        else{
          wx.showModal({
            title:"温馨提示",
            content:"学号格式不正确",
            showCancel:false
          })
          that.setData({
            Cnumber:[false,"修改",null]
          })
        }
      }
      
    }
    //修改姓名
    if (e.target.id == "Sname") {
      if(that.data.Cname[2] != null && that.data.Cname[2] != "")
        wx.showModal({
          title:"温馨提示",
          content:"是否确认更改姓名",
          success(res){
            if (res.confirm) {
              that.callFunction("name",that.data.Cname[2],"更改成功",1)
            }
          }
        })
    }
  },

  // 重置密码
  reset(e){
    var that = this
    wx.showModal({
      title:"温馨提示",
      content:"新密码为本人学号，是否重置密码",
      success(res){
        if (res.confirm) {
          that.callFunction("password",that.data.number,"重置成功",1)
        }
      }
    })

  },

  type(e){
    this.setData({
      type:e.detail.value
    })
  },
  submittype(e){
    var that = this
    wx.showModal({
      title:"温馨提示",
      content:"确认将类型更改为" + this.data.type,
      success(res){
        if (res.confirm) {
          that.callFunction("type",that.data.type,"更改成功")
          that.setData({
            find:false
          })
        }
      }
    })
  },

  // 更新班级信息
  classmsg(e){
    var that = this
    if (that.data.institute[0][that.data.IIndex[0]] != that.data.Ycampus ||
        that.data.institute[1][that.data.IIndex[1]] != that.data.Yinstitute ||
        that.data.classname[0][that.data.CIndex[0]] != that.data.Ymajor ||
        that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]] != that.data.Yclassname
      ) {
      wx.showModal({
        title:"温馨提示",
        content:"确认更改班级信息",
        success(res){
          if (res.confirm) {
            //更改校区
            if (that.data.institute[0][that.data.IIndex[0]] != that.data.Ycampus) {
              that.callFunction("campus",that.data.institute[0][that.data.IIndex[0]],"校区更新成功",0)
            }
            //更改学院
            if (that.data.institute[1][that.data.IIndex[1]] != that.data.Yinstitute) {
              that.callFunction("institute",that.data.institute[1][that.data.IIndex[1]],"学院更新成功",0)
            }
            //更改专业
            if (that.data.classname[0][that.data.CIndex[0]] != that.data.Ymajor) {
              that.callFunction("major",that.data.classname[0][that.data.CIndex[0]],"专业更新成功",0)
            }
            //更改班级
            if (that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]] != that.data.Yclassname) {
              that.callFunction("classname",that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]],"班级更新成功",0)
            }
            wx.showModal({
              title: '温馨提示',
              content: '更新成功',
              showCancel:false
            })
            that.setData({
              Ycampus:that.data.institute[0][that.data.IIndex[0]],
              Yinstitute:that.data.institute[1][that.data.IIndex[1]],
              Ymajor:that.data.classname[0][that.data.CIndex[0]],
              Yclassname:that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]]
            })
          }
          
        }
      })
    }
    else{
      this.tips("不能与原班级信息相同")
    }
  },

  callFunction(key,data,last,code){
    wx.showLoading({
      title: '更改中...',
    })
    var that = this
    wx.cloud.callFunction({
      name:"update_userList",
      data:{
        id: this.data.id,
        key:key,
        data:data
      },
      success(res){
        wx.hideLoading()
        if(code == 1)
          wx.showModal({
            title:"温馨提示",
            content:last,
            showCancel:false
          })
        else
          that.tips(last)
      },
      fail:console.error
    })
  },

  tips(msg){
    wx.showToast({
      title: msg,
      icon:"none"
    })
  }

})