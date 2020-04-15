// pages/turnip-prices/turnip-prices.js
var predictions = require('./predictions')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstBuy:false,
    previousPartternIndex:0,
    patternArray:['不知道', '随机型', '小涨型', '大涨型', '暴跌型', ],
    sundayPrice:0,
    weekdayRecords:[0,0,0,0,0,0,0,0,0,0,0,0,],
    possibilities:0,
    listData:[
      {"code":"01","text":"text1","type":"type1"},
      {"code":"02","text":"text2","type":"type2"},
      {"code":"03","text":"text3","type":"type3"},
      {"code":"04","text":"text4","type":"type4"},
      {"code":"05","text":"text5","type":"type5"},
      {"code":"06","text":"text6","type":"type6"},
      {"code":"07","text":"text7","type":"type7"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  onSetFirstBuy:function(e){
    this.calculateOutput()
    this.setData({
      firstBuy: e.detail.value
    })
  },

  onPatternPickerChange:function(e){
    this.calculateOutput()
    this.setData({
      previousPartternIndex: e.detail.value
    })
  },

  onInputSunday:function(e){
    this.calculateOutput()
    this.setData({
      sundayPrice: parseInt(e.detail.value)
    })
  },

  onInputDayPrice:function(e){
    var tmpArray = this.data.weekdayRecords
    var day = parseInt(e.currentTarget.dataset.day) 
    var type = parseInt(e.currentTarget.dataset.type)
    var price = parseInt(e.detail.value)
    tmpArray[2*day+type] = price

    this.calculateOutput()
    this.setData({
      weekdayRecords:tmpArray
    })
  },

  calculateOutput:function (){
    var prices = this.data.weekdayRecords
    var first_buy = this.data.firstBuy
    var previous_pattern = this.data.previousPartternIndex

    prices = [this.data.sundayPrice, this.data.sundayPrice, ...prices]

    let output_possibilities = [];
    for (let poss of predictions.analyze_possibilities(prices, first_buy, previous_pattern)) {
      var result = {}
      result.partten = poss.pattern_description
      result.probability = Number.isFinite(poss.probability) ? ((poss.probability * 100).toPrecision(3) + '%') : "-"
      for (let day of poss.prices.slice(1)) {
        if (day.min !== day.max) {
          result.day = day.min + '~' + day.max
        } else {
          result.day = day.min
        }
      }
      result.weekMin = poss.weekGuaranteedMinimum
      result.weekMax = poss.weekMax
      console.log(result)
      output_possibilities.push(result);
    }
  }
})