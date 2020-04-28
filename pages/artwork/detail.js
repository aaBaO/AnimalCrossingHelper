// pages/artwork/detail.js
var artworkData = require('../../database/arts.js')
const collection = require('../../utils/collection')
const dexType = 'art'

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
    collection.getCollectionData().then(data=>{
      if(data[dexType] && data[dexType][inspectData.name]){
        inspectData.collected = data[dexType][inspectData.name]
      }
      else{
        inspectData.collected = false
      }
      this.setData({
        inspectData:inspectData,
        key:key,
      })
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

  onPreviewImage: function(e){
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      urls:[url],
    })
  }
})