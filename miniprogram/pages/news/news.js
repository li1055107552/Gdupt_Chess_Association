//pages/news/news.js
/**
 * 注册新用户
 * 
 */
var app = getApp()
var classlist = require('../../utils/classlist.js')
var util = require('../../utils/util.js')
var canNickname
var canNumber
Page
({

  data:{
    nickname:'',
    name:"",
    number:"",

    password:'',
    password2:'',
    numberResult:'',
    long:'',

    multiArray:[],
    institute:[],   //校区[0] + 学院[1]
    classname:[],   //专业[0] + 届数[1] + 班级[2]
    IIndex:[0,0],   //校区[0] + 学院[1]
    CIndex:[0,0,0]  //专业[0] + 届数[1] + 班级[2]
  },

  onShareAppMessage: function () {},

  onLoad: function () {
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

    /* 入口检测 */
    {
      const st = wx.cloud.database()
      st.collection("admin").where({ _id: "member" }).get
      ({
        success: function (res) {
          if (res.data[0].state == false) {
            wx.showModal
            ({
              content: '注册入口关闭',
              showCancel: false,
              success(res) {
                if (res.confirm)
                  wx.redirectTo({
                    url: '../index/index',
                  })
                else
                  wx.redirectTo({
                    url: '../index/index',
                  })
              }
            })
          }
        }
      })
    }
   
  },

  /*绑定事件 */
    setMsg(e){
      if(e.target.id == 'number'){
        this.setData({
          long:e.detail.value.length
        })
      }
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

  /*提交检测 */
  check_submit:function(e)
  {
      if(this.data.nickname=="")
        this.tips('请先设置昵称');

      else if (this.data.name == "")
        this.tips('请填写姓名');

      else if (this.data.number == "") 
        this.tips('请填写学号');

      else if (this.data.long != 11)
        this.tips('请正确填写学号');
      
      else if(this.data.password == "")
        this.tips('请先设置密码')

      else if(this.data.password2 == "")
        this.tips('请确认密码')

      else if (this.data.password != this.data.password2)
        this.tips('两次密码不相同')

      else{      
        wx.showLoading({
          title: '检测中...',
        })
        this.aCheck(this)
      }
  },

  aCheck(e){
    e.cloudCheck('nickname',e.data.nickname)
    e.cloudCheck('number',Number(e.data.number))
    setTimeout(function(){
      if(canNickname == 0 && canNumber == 0){
        wx.showLoading({
          title: '注册中...',
        })
        e.onAdd()
      }
      else if(canNickname != 0)
        e.tips("昵称已被注册！")
      else if(canNumber != 0)
        e.tips("学号已被登记！")
    },2000)
    
  },

  cloudCheck(type,msg){
    wx.cloud.callFunction({
      name: 'checkMsg',
      data: {
        type: type,
        msg: msg,
        collectName: 'userList'
      },
      success(res) {
        if(type == 'nickname'){
          canNickname = res.result
        } 
        else if(type == 'number'){
          canNumber = res.result
        } 
      }
    })
  },

  tips(title){
    wx.showToast({
      title: title,
      icon:"none"
    })
  },
  resets(e){    //重置提示
    wx.showToast({
      title: '重置成功!',
    })
  },

  onAdd: function () {
    var that = this
    wx.cloud.callFunction({
      name:'newMember',
      data:{
        nickname:that.data.nickname,
        name:that.data.name,
        number:Number(that.data.number),
        tel:null,
        campus:   that.data.institute[0][that.data.IIndex[0]],      //校区
        institute:that.data.institute[1][that.data.IIndex[1]],      //学院
        major:    that.data.classname[0][that.data.CIndex[0]],      //专业
        classname:that.data.classname[1][that.data.CIndex[1]] + '-' + that.data.classname[2][that.data.CIndex[2]],   //班级
        password:that.data.password,
        type:'member',
        time:util.formatTime(new Date())
      },
      success(res){
        wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '注册成功，请牢记密码',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta:5,
              })
            }
          }
        })
      }
    })
  }
  
})