// pages/guide/guidelist.js
const utils = require('../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideList:[{title:'新手指引-nook里数优先兑换'}, {title:'挖矿技巧'}, {title:'房贷阶段'}, 
      {title:'写信给小动物'}, {title:'金道具（金色工具）获取'}, {title:'海鸥吕游任务'}, {title:'邻居小动物友情点介绍'}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.renderPage()
  },

  renderPage: function(){
    for(var i in this.data.guideList){
      var item = this.data.guideList[i]
      item.hide = false
    }
    this.setData({
      guideList: this.data.guideList
    });
  },

  //搜索输入
  onInputSearch:function(e){
    this.setData({
      searchInput: e.detail.value
    })
  },

  //搜索输入完成
  onConfirmSearch:function(e){
    this.onSearch(this.data.searchInput)
    this.setData({
      guideList: this.data.guideList
    })
  },

  isMatchSearch:function(i, pattern){
    if(pattern == '' || pattern === 'undefined')
      return true

    var match = false
    var item = this.data.guideList[i]
    var reg = new RegExp(pattern)
    if(reg.test(item.name) || reg.test(item.pinyin[0]) || reg.test(item.pinyin[1])){
      match = true
    }
    return match
  },

  onSearch:function(pattern){
    for (var i in this.data.guideList) {
      var item = this.data.guideList[i]
      item.hide = !this.isMatchSearch(i, pattern) 
    }
  },

  onTapMoreInfo:function(e){
    var tapIndex = e.currentTarget.dataset.index
    var title = e.currentTarget.dataset.title
    var detailInfo = {
      index: tapIndex,
      title: title
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../guide/detail' + params,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})