// pages/dexDetailInfo/dexDetailInfo.js
const utils = require('../../utils/utils')
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
    var dexType = options.type
    var hemisphere = options.hemisphere
    var index = options.index
    var dataList = require('../../database/{type}_{hemisphere}.js'.format({
      type:dexType,
      hemisphere:hemisphere
    }))
    var inspetData = dataList.data[index]
    console.log(inspetData)
    this.setData({
      inspetData:inspetData,
      dexType:dexType,
      hemisphere:hemisphere,
    })
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
    var hemisphere = hemisphere == 'nh' ? '北半球':'南半球'
    return {
      title: "图鉴详情:" + hemisphere + "的" + this.data.inspetData.name,
      path: this.route + paramsURL
    }
  }
})