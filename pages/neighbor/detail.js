// pages/neighbor/detail.js
var neighborsData = require('../../database/neighbors.js')
const dexType = 'neighbor'

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

    var inspectData = this.getInspectData(key)
    this.setData({
      inspectData:inspectData,
    })
  },

  getInspectData: function(key){
    var dataList = neighborsData.data
    key = decodeURI(key)
    for(var item of dataList){
      if(item.name == key)
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