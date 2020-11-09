// pages/page_admin/active/active.js
Page({

  click(e){
    wx.navigateTo({
      url: "page/" + e.target.id + '/' + e.target.id,
    })
  }
})