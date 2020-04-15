// pages/dexDetailInfo/dexDetailInfo.js
const utils = require('../../utils/utils')

var fish_nh_data = require('../../database/fish_nh.js')
var fish_sh_data = require('../../database/fish_sh.js')
var bug_sh_data = require('../../database/bug_nh.js')
var bug_sh_data = require('../../database/bug_sh.js')

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

    console.log(inspectData)
    this.setData({
      inspectData:inspectData,
      dexType:dexType,
      index:index,
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
      console.log(item)
      if(item.name == index)
        return item
    }
    return {}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
  }
})