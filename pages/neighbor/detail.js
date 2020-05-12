// pages/neighbor/detail.js
var neighborsData = require('../../database/neighbors.js')
const utils = require('../../utils/utils')
const collection = require('../../utils/collection')
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
    var paramsURL = utils.urlEncode(this.options, 1) 
    return {
      title: "你好~我是" + this.data.inspectData.name + ",座右铭:" + this.data.inspectData.motto + ".",
      path: this.route + paramsURL
    }
  },

  onPreviewImage: function(e){
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      urls:[url],
    })
  },

  onSetCollected:function(e){
    var type = dexType
    var key = e.currentTarget.dataset.key
    var value = e.currentTarget.dataset.value

    this.data.inspectData.collected = value

    collection.setCollectionData(type, key, value).then(()=>{
      this.setData({
        inspectData: this.data.inspectData
      })
    })
  },
})