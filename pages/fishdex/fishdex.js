// pages/fishdex.js
var fish_nh_data = require('../../database/fish_nh.js')
var fish_sh_data = require('../../database/fish_sh.js')
const utils = require('../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hemisphere:'nh'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataList: fish_nh_data.data
    });
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
    console.log(e)
    var tapIndex = e.currentTarget.dataset.index
    var detailInfo = {
      type:'fish',
      hemisphere:this.data.hemisphere,
      index:tapIndex,
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../dexDetailInfo/dexDetailInfo' + params,
    })
  },

  onHemisphereChange:function(e){
    var h = e.detail.value
    this.onSearch('')
    this.setData({
      hemisphere: h,
      dataList: h === 'nh'? fish_nh_data.data : fish_sh_data.data,
      searchInput: ''
    })
  }
})