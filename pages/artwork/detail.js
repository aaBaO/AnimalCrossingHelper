// pages/artwork/detail.js
var artworkData = require('../../database/arts.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var key = options.key

    this.setData({
      inspectData: this.getInspectData(key),
      key:key,
    })
  },

  getInspectData: function(key){
    var dataList = artworkData.data
    key = decodeURI(key)
    for(var item of dataList){
      if(item.engName == key)
        return item
    }
    return {}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPreviewImage: function(e){
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      urls:[url],
    })
  }
})