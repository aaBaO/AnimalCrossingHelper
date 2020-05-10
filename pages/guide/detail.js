// pages/guide/detail.js
const utils = require('../../utils/utils')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeIndex:options.index
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var paramsURL = utils.urlEncode(this.options, 1) 
    return {
      title: "精品攻略:" + decodeURI(this.options.title),
      path: this.route + paramsURL
    }
  },
})