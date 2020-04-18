// pages/turnip-prices/turnip-prices.js
var predictions = require('./predictions')

const SelfDataKey = 'self-turnip-prices'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstBuy: false,
    previousPartternIndex: 4,
    patternArray:['波动型', '大涨型', '递减型', '小涨型', '未知类型', ],
    sundayPrice: '',
    weekdayRecords:[NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,],
    possibilities: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      // 获取本地存储的数据
      var value = wx.getStorageSync(SelfDataKey)
      if (value) {
        // 将每日售价进行转换
        for(var i = 0; i < value.weekdayRecords.length; i++){
          var price = parseInt(value.weekdayRecords[i])
          value.weekdayRecords[i] = price
        }
        this.setData({
          firstBuy: value.firstBuy,
          previousPartternIndex: value.previousPartternIndex,
          sundayPrice: value.sundayPrice,
          weekdayRecords: value.weekdayRecords,
        })
      }
      else{
        this.setDefaultData()
      }
    }
    catch (e) {
    }
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
    return{
        title:"大头菜预测！发财致富不求人!",
        path:"/pages/turnip-prices/turnip-prices",
    }
  },

  onSetFirstBuy:function(e){
    this.data.firstBuy = e.detail.value === 'true'
    this.saveSelfData()
    this.setData({
      firstBuy: this.data.firstBuy
    })
  },

  onPatternPickerChange:function(e){
    this.data.previousPartternIndex = parseInt(e.detail.value)
    this.saveSelfData()
    this.setData({
      previousPartternIndex: this.data.previousPartternIndex
    })
  },

  onInputSunday:function(e){
    this.data.sundayPrice = parseInt(e.detail.value)
    this.saveSelfData()
    this.setData({
      sundayPrice: this.data.sundayPrice
    })
  },

  onInputDayPrice:function(e){
    var tmpArray = this.data.weekdayRecords
    var day = parseInt(e.currentTarget.dataset.day) 
    var type = parseInt(e.currentTarget.dataset.type)
    var price = e.detail.value === 'null'? NaN:parseInt(e.detail.value)
    tmpArray[2*day+type] = price

    this.saveSelfData()
    this.setData({
      weekdayRecords:tmpArray
    })
  },

  saveSelfData:function(){
    // 将每日售价进行转换
    for(var i = 0; i < this.data.weekdayRecords.length; i++){
      var price = parseInt(this.data.weekdayRecords[i])
      this.data.weekdayRecords[i] = price
    }
    var selfdata = {
      firstBuy: this.data.firstBuy,
      previousPartternIndex: this.data.previousPartternIndex,
      sundayPrice: this.data.sundayPrice,
      weekdayRecords: this.data.weekdayRecords,
    }
    wx.setStorage({
      key:'self-turnip-prices', 
      data: selfdata,
    })
  },

  onCalculate:function(e){
    this.calculateOutput()
  },

  setDefaultData:function(){
    var defaultData = {
      firstBuy: false,
      previousPartternIndex: 4,
      sundayPrice: NaN,
      weekdayRecords:[NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,],
      possibilities: [],
    }
    this.setData({
      firstBuy: defaultData.firstBuy,
      previousPartternIndex: defaultData.previousPartternIndex,
      sundayPrice: defaultData.sundayPrice,
      weekdayRecords: defaultData.weekdayRecords,
      possibilities: defaultData.possibilities,
    })
  },

  onResetSelfData:function(e){
    var thisPage = this
    wx.showModal({
      title: '提示',
      content: '确定重置吗',
      success: function(res){
        if(res.confirm){
          thisPage.setDefaultData()
          thisPage.saveSelfData()
        }
      }
    })
  },

  calculateOutput:function (){
    var prices = this.data.weekdayRecords
    var first_buy = this.data.firstBuy
    var previous_pattern = first_buy? -1 : this.data.previousPartternIndex

    prices = [this.data.sundayPrice, this.data.sundayPrice, ...prices]

    let output_possibilities = [];
    for (let poss of predictions.analyze_possibilities(prices, first_buy, previous_pattern)) {
      var result = {}
      result.partten = poss.pattern_description
      result.probability = Number.isFinite(poss.probability) ? ((poss.probability * 100).toPrecision(3) + '%') : "-"
      var days = []
      for (let day of poss.prices.slice(1)) {
        if (day.min !== day.max) {
          days.push(day.min + '~' + day.max)
        } 
        else {
          days.push(day.min)
        }
      }
      result.days = days
      result.weekMin = poss.weekGuaranteedMinimum
      result.weekMax = poss.weekMax
      output_possibilities.push(result);
    }

    var getValidResult = true
    if(output_possibilities.length == 1){
      getValidResult = false
    }

    if(getValidResult){
      wx.showToast({
        title:'预测成功',
        icon:'success'
      })
    }
    else{
      wx.showToast({
        title:'数据错误',
      })
    }

    this.setData({
      possibilities:output_possibilities,
      getValidResult: getValidResult
    })
  }
})