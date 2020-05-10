// pages/guide/detail.js
const utils = require('../../utils/utils')
const {wxpgetStorage, wxpsetStorage} = require('../../utils/collection')

let interstitialAd = null
const key_lastInterstitialAdTime = 'lastInterstitialAdTime'

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
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-2f6fdf8a8fb7b3bc'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {console.log(err)})
      interstitialAd.onClose(() => {})
    }

    this.setData({
      activeIndex:options.index
    })
  },

  onShow: function(){
    wxpgetStorage({
      key:key_lastInterstitialAdTime
    }).then(res=>{
      const tms = Date.now() - res.data
      if(tms * 0.001 > 30){
        this.onShowAd()
      }
    }).catch(res=>{
      wxpsetStorage({
        key:key_lastInterstitialAdTime,
        data:Date.now()
      }).then(res=>{
        this.onShowAd()
      })
    })
  },

  onShowAd:function(){
    if (interstitialAd) {
      interstitialAd.show().then(()=>{
        wxpsetStorage({
          key:key_lastInterstitialAdTime,
          data:Date.now()
        })
      }).catch((err) => {
        console.error(err)
      })
    }
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