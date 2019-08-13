//pages/news/news.js
Page
({
  
  data:{
    username:'',
    name:"",
    number:"",
    school:"",
    classname:"",
    password:'',
    password2:'',
    cleanpassword:'',
    usernameResult:'',
    numberResult:'',
  },

  /*绑定事件 */
  username:function(e){
      this.setData(
      {
      username:e.detail.value
    })
    console.log("用户名:"+this.data.username)
  },
  name:function(e){
    this.setData(
    {
      name:e.detail.value
    })
    console.log("姓名:" + this.data.name)
  },
  number:function (e) {
    this.setData(
    {
      number: e.detail.value
    })
    console.log("学号:" + this.data.number)
  },
  school: function (e) {
    this.setData(
      {
        school: e.detail.value
      })
    console.log("学校:" + this.data.school)
  },
  classname: function (e) {
    this.setData(
      {
        classname: e.detail.value
      })
    console.log("班级:" + this.data.classname)
  },
  password: function (e) {
    this.setData(
      {
        password: e.detail.value
      })
    console.log("密码:" + this.data.password)
  },
  password2: function (e) {
    this.setData(
      {
        password2: e.detail.value
      })
    console.log("确认密码:" + this.data.password2)
  },        

  /*提交检测 */

  check_username:function(e)
  {
    const db = wx.cloud.database()
    db.collection("test").where({username:this.data.username}).get
    ({
      success:function(res)
      {
        console.log(res.data.length)
        if(res.data.length != 0)
        {
          wx.showModal({
            content: '用户名已存在',
            showCancel:false,
          })
          this.usernameResult()
          
        }
      },
    })
  },

  usernameResult:function(){
    this.setData({
      usernameResult: false
    })
  },

  check_number:function(e){
    const bd = wx.cloud.database()
    bd.collection("test").where({ number: this.data.number }).get
      ({
        success: function (res) 
        {
          console.log(res.data.length)
          if(res.data.length != 0)
          {
            wx.showModal
          ({
              content: '学号已被注册',
              showCancel: false,
          })
            return false;
          }
        }
      })
  },

  check_submit:function(e)
  {
//    console.log(this.check_username())
      if (this.check_username());
      else if (this.check_number());
      else
      {
      if(this.data.username=="")
      {
        wx.showToast({
          title: '请先设置用户名',
          icon:'none',
        })
        return false;
      }
      
        
         if (this.data.name == "") {
            wx.showToast({
              title: '请填写姓名',
              icon: 'none',
            })
            return false;
          }

         if (this.data.number == "") {
            wx.showToast({
              title: '请填写学号',
              icon: 'none',
            })
            return false;
          }

          if (this.data.number.length != 11)
          {
            wx.showToast({
              title: '请正确填写学号',
              icon: 'none',
            })
            return (false);
          }

          if (this.data.school == "") {
            wx.showToast({
              title: '请填写学院',
              icon: 'none',
            })
            return (false);
          }

           if (this.data.classname == "") {
            wx.showToast({
              title: '请填写班级',
              icon: 'none',
            })
            return (false);
          }
          
          if(this.data.password == "")
          {
            wx.showToast({
              title: '请先设置密码',
              icon: 'none',
            })
            return (false);
          }

           if(this.data.password2 == "")
          {
            wx.showToast({
              title: '请确认密码',
              icon: 'none',
            })
            return (false);
          }

           if (this.data.password != this.data.password2)
          {
            wx.showToast({
              title: '两次密码不相同',
              icon:"none"
            })
            return (false);
          }
          
          else
          {
            setTimeout(this.onAdd,500)
            return true;
          }  
      }
  },

  resets:function()
  {
    wx.showToast({
      title: '重置成功!',
    })
  },

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('test').add({
      data: {
        username: this.data.username,
        name: this.data.name,
        number: this.data.number,
        school: this.data.school,
        classname: this.data.classname,
        password: this.data.password,
        VIP: 'false',
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count:1,
        })
        wx.showToast({
          title: '注册成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

        /* 成功后跳转 */
        setTimeout(function () {
          wx.navigateTo({
            url: '../index/index',
          })
        }, 1600)

      },
    })
      
    }
  },

)