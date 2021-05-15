// sea-creature/page.js
const bug_data = require('../../database/sea_creatures.js')
const utils = require('../../utils/utils')
const collection = require('../../utils/collection')
const dexType = 'sea_creature'

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
    bug_data.data.sort(function(a, b){
      return parseInt(a.price) - parseInt(b.price)
    })
  },

  renderPage: function(){
    collection.getCollectionData().then((data)=>{
      bug_data.data.forEach(item => {
        item.hide = false
        if(data[dexType] && data[dexType][item.name]){
          item.collected = data[dexType][item.name]
        }
        else{
          item.collected = false
        }
      });
      this.setData({
        dataList: bug_data.data
      });
    })      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.renderPage()
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
      if(reg.test(item.name) || 
        reg.test(item.enName) || 
        reg.test(item.jpName) ||
        reg.test(item.pinyin[0]) ||
        reg.test(item.pinyin[1]) ){
        this.data.dataList[i].hide = false
      }
      else{
        this.data.dataList[i].hide = true
      }
    }
  },
  
  onTapMoreInfo:function(e){
    var tapIndex = e.currentTarget.dataset.index
    var detailInfo = {
      type: dexType,
      index: tapIndex,
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../dexDetailInfo/dexDetailInfo' + params,
    })
  },

  onSetCollected:function(e){
    var type = dexType
    var key = e.currentTarget.dataset.key
    var value = e.currentTarget.dataset.value

    collection.setCollectionData(type, key, value).then(()=>{
      this.renderPage()
    })
  },
})