// pages/dexDetailInfo/dexDetailInfo.js
const utils = require('../../utils/utils')

var fish_nh_data = require('../../database/fish_nh.js')
var fish_sh_data = require('../../database/fish_sh.js')
var bug_nh_data = require('../../database/bug_nh.js')
var bug_sh_data = require('../../database/bug_sh.js')

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
    var hemisphere = this.data.hemisphere
    var index = options.index

    var inspectData = this.getInspectData(dexType, hemisphere, index)
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

  getInspectData: function(type, hemisphere, index){
    var dataList = 'undefined'
    if(type == 'fish'){
      if(hemisphere == 'nh'){
        dataList = fish_nh_data.data
      } else{
        dataList = fish_sh_data.data
      }
    }
    if(type == 'bug'){
      if(hemisphere == 'nh'){
        dataList = bug_nh_data.data
      } else{
        dataList = bug_sh_data.data
      }
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

  onHemisphereChange:function(e){
    var h = e.detail.value
    var dexType = this.data.dexType
    var index = this.data.index

    var inspectData = this.getInspectData(dexType, h, index)

    this.setData({
      hemisphere: h,
      inspectData: inspectData
    })
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