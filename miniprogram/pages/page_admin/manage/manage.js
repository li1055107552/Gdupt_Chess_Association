// pages/page_admin/manage/manage.js
Page({

  click(e){
    wx.navigateTo({
      url: "page/" + e.target.id + "/" + e.target.id,
    })
  }

})