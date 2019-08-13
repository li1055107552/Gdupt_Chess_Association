// miniprogram/pages/active/active.js
Page({

  data: {
    name: "",
    tel: "",
    number: "",
    school: "",
    classname: "",
    activeType: "",
    state:"",
  },

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('active').add({
      data: {
        name:"admin",
        state:"able",
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '注册失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }

})

