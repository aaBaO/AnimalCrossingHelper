// pages/dexDetailInfo/dexDetailInfo.js
const utils = require('../../utils/utils')

const fish_data = require('../../database/fish.js')
const bug_data = require('../../database/bug.js')
const sea_creature_data = require('../../database/sea_creatures.js')

const collection = require('../../utils/collection')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dexType:'undefined',
    hemisphere:'sh',
    index:0,
    inspectData:'undefined',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dexType = options.type
    var index = options.index

    var inspectData = this.getInspectData(dexType, index)
    collection.getCollectionData().then(data=>{
      if(data[dexType] && data[dexType][inspectData.name]){
        inspectData.collected = data[dexType][inspectData.name]
      }
      else{
        inspectData.collected = false
      }
      this.setData({
        inspectData:inspectData,
        dexType:dexType,
        index:index,
      })
    })
  },

  getInspectData: function(type, index){
    var dataList = 'undefined'
    if(type == 'fish'){
      dataList = fish_data.data
    }
    if(type == 'bug'){
      dataList = bug_data.data
    }
    if(type == 'sea_creature'){
      dataList = sea_creature_data.data
    }
    index = decodeURI(index)
    for(var item of dataList){
      if(item.name == index)
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
      title: "图鉴详情:" + this.data.inspectData.name,
      path: this.route + paramsURL
    }
  },

  onSetCollected:function(e){
    var type = this.data.dexType
    var key = e.currentTarget.dataset.key
    var value = e.currentTarget.dataset.value

    this.data.inspectData.collected = value

    collection.setCollectionData(type, key, value).then(()=>{
      this.setData({
        inspectData: this.data.inspectData
      })
    })
  }
})