// pages/page_vip/active/active.js
var util = require('../../utils/util.js')
var classlist = require('../../utils/classlist.js')
Page({

  /* 页面的初始数据 */
  data: {
    name: "",     //姓名
    tel: "",      //电话
    number: "",   //学号
    other:"",     //备注

    isshow:false,   //是否展示活动列表（是否有活动）
    activeList:[],  //报名活动列表

    multiArray:[],
    institute:[],   //校区[0] + 学院[1]
    classname:[],   //专业[0] + 届数[1] + 班级[2]
    IIndex:[0,0],   //校区[0] + 学院[1]
    CIndex:[0,0,0]  //专业[0] + 届数[1] + 班级[2]
    //pickBtn = []    是否选中[0] + 样式[1] + 显示内容[2]
  },

  onLoad: function () {
    console.log("当前时间戳:" + new Date().getTime())
    var that = this

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

    /* 获取活动列表 */
    {
      wx.cloud.callFunction({
        name:'activeList',
        data:{
          type:'member'
        },
        success:function(res){
          console.log(res)
          if(res.result.length != 0){
            that.setData({
              activeList:res.result.data,
              isshow:true
            })
            that.showtime()
          } else{
            that.tips("当前无活动可报名参加！")
          }
          
        },
        fail:console.error

      })

    }

  },

    /* 设定显示时间 按钮 */
    showtime(e){
      var list = this.data.activeList
      var showtime = []
      var pickBtn = []      //是否选中[0] 样式[1] 内容[2] 
      for(var i=0;i<list.length;i++){
        var timeS = list[i].raceStart
        var timeE = list[i].raceEnd
        var timeEE = list[i].enterEnd
        timeS = util.formatTime(new Date(timeS))
        timeE = util.formatTime(new Date(timeE))
        timeEE = util.formatTime(new Date(timeEE))
        timeS = timeS.slice(0,timeS.length-3)
        timeE = timeE.slice(0,timeE.length-3)
        timeEE = timeEE.slice(0,timeEE.length-3)
        showtime.push([timeS,timeE,timeEE])
        
        var content = "预选报名";
        if(!list[i].state_enter){
          content = "尚未能报名"
        }
        pickBtn.push([false,"color:black;background-color:gary",content])
      }
      this.setData({
        showtime:showtime,
        pickBtn:pickBtn
      })
    },

    /* 填写信息 */
    setNTN:function(e){
      this.setData({
        [e.target.id]:e.detail.value
      })
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

    /* 预选报名 */
    pick(e){
      var pickBtn = this.data.pickBtn
      if(pickBtn[e.target.id][0]){
        pickBtn[e.target.id][0] = false
        pickBtn[e.target.id][1] = "color:black;background-color:gary"
      }
      else{
        pickBtn[e.target.id][0] = true
        pickBtn[e.target.id][1] = "color:white;background-color:rgb(60,200,60)"
      }
      this.setData({
        pickBtn:pickBtn
      })
    },

    /* 表单提交 + 本地校验 */
    check_submit: function (e) {

      var mobile = /^1[3456789]\d{9}$/;
      var isMobile = mobile.exec(this.data.tel)
      var pickBtn = this.data.pickBtn

      this.loading('校验中......')

      if (this.data.name == "") 
        this.tips('请填写姓名')
      else if (this.data.tel == "") 
        this.tips('请填写联系方式')
      else if (this.data.tel.length != 11)
        this.tips('请正确填写电话')      
      else if (!isMobile)
        this.tips('请正确填写电话')
      else if (this.data.number == "")
        this.tips('请填写学号')
      else if (this.data.number.length != 11) 
        this.tips('请正确填写学号')
      else {
        for(var i=0;i<pickBtn.length;i++){
          if(pickBtn[i][0]){
            this.check_number(this.data.activeList[i])
          }
          else if(i >= pickBtn.length -1 ){
            this.tips('暂无报名项')     //取消loading...
          }
        }
      }

    },

    /* 校验目标是否已报名 */
    check_number: function (e) {
      console.log(e)
      var that = this
      this.loading('是否已报名......')

      // 校验是否已报名
      wx.cloud.callFunction({
        name:'checkMsg',
        data:{
          type:'number',
          msg:Number(that.data.number),
          collectName:'A' + e.activeCode
        },
        success(res){
          if(res.result == 0){
            that.check_user(e)
          }
          else{
            wx.hideLoading()
            wx.showModal({
              title:'报名失败',
              content:e.activeName + " 已报名，请勿重复报名",
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta:2
                  })
                } else{
                  wx.navigateBack({
                    delta:2
                  })
                }
              }
            })
          }
        }
      })

    },

    /* 检查用户状态 */
    check_user:function(e){
      this.loading('检查用户状态......')
      var that = this
      wx.cloud.callFunction({
        name:'checkMsg',
        data:{
          type:'number',
          msg:Number(that.data.number),
          collectName:'userList'
        },
        success(res){
          if(res.result == 0){
            that.newMember(e)
          }
          else{
            that.onAdd(e)
          }
        }
      })
    },

  newMember(e){
    this.loading('注册新用户......')
    var that = this
    wx.cloud.callFunction({
      name:'newMember',
      data:{
        nickname: that.data.name,
        name:     that.data.name,
        number:   Number(that.data.number),
        tel:      Number(that.data.tel),
        campus:   that.data.institute[0][that.data.IIndex[0]],      //校区
        institute:that.data.institute[1][that.data.IIndex[1]],      //学院
        major:    that.data.classname[0][that.data.CIndex[0]],      //专业
        classname:that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]],   //班级
        password:that.data.number,
        type:'member',
        time:util.formatTime(new Date())
      },
      success(res){
        that.onAdd(e)
      }
    })
  },

  onAdd(e) {
    this.loading('报名中......')
    var that = this
    wx.cloud.callFunction({
      name: 'activeEnter',
      data: {
        activeCode: e.activeCode,             //活动编码（集合名称）
        activeName: e.activeName,             //活动名称
        name:       that.data.name,           //姓名
        tel:        Number(that.data.tel),    //电话
        number:     Number(that.data.number), //学号
        campus:     that.data.institute[0][that.data.IIndex[0]],  //校区
        institute:  that.data.institute[1][that.data.IIndex[1]],  //学院
        major:      that.data.classname[0][that.data.CIndex[0]],  //专业
        classname:  that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]],  //班级
        remark:     that.data.other,          //备注
        type: 'member',                       //用户类型
        time: util.formatTime(new Date()),    //报名时间
        code: util.getCode(4),                //验证码
      }, 
      success: function (res) {
        wx.hideLoading()
        wx.showModal({
          title:'温馨提示',
          content:e.activeName + "报名成功",
          showCancel:false,
          success(res){
            if(res.confirm){
              wx.navigateBack({
                delta:2
              })
            } else{
              wx.navigateBack({
                delta:2
              })
            }
          }
        })
        that.sendMsg(e)
      }, 
      fail: function (res) {
        console.log(res)
        that.tips('报名失败')
      }
    })
  },
  
  tips(e){
    wx.showToast({
      title: e,
      icon: 'none',
    })
  },
  loading(e){
    wx.showLoading({
      title: e,
    })
  },

  /* 模版信息 */
  sendMsg(e) {
    // console.log(e)
    var that = this
    wx.cloud.callFunction({
      name:'openapi',
      data:{
        action:'sendSubscribeMessage',
        name: that.data.name,
        activeName: e.activeName,
        activeArea: e.activeArea,
        activeTime: util.formatTime(new Date(e.raceStart))
      },
      // success(res){
      //   console.log(res)
      // },
      fail:console.error
    })
  },

  onShareAppMessage:function(){},

  /*生命周期函数--监听页面卸载 */
  onUnload: function () {
    wx.navigateBack({
      delta: 2
    })
  }
})