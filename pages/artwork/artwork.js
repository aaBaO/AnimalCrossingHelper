// pages/artwork/artwork.js
var artworkData = require('../../database/arts.js')
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
    this.setData({
      dataList: artworkData.data
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      dataList: this.data.dataList
    })
  },

  onSearch:function(pattern){
    for (var i in this.data.dataList) {
      var item = this.data.dataList[i]
      var reg = new RegExp(pattern)
      if(reg.test(item.name) || reg.test(item.pinyin[0]) || reg.test(item.pinyin[1])){
        this.data.dataList[i].hide = false
      }
      else{
        this.data.dataList[i].hide = true
      }
    }
  },
  
  onTapMoreInfo:function(e){
    var key = e.currentTarget.dataset.key
    var detailInfo = {
      key:key,
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../artwork/detail' + params,
    })
  },
})