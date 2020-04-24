//index.js
//获取应用实例
const app = getApp()

// 在页面中定义激励视频广告
let encourageAd = null

Page({
  data: {

  },
  onShareAppMessage: function () {
    return{
        title:"动物之森小助手",
        path:"/pages/index/index",
    }
  },

  onclick_fishdex: function () {
    wx.navigateTo({
        url: '../fishdex/fishdex',
    })
  },

  onclick_bugdex: function () {
    wx.navigateTo({
        url: '../bugdex/bugdex',
    })
  },

  onclick_turnip_price:function(){
    wx.navigateTo({
        url: '../turnip-prices/turnip-prices',
    })
  },

  onclick_diyrecipe:function(){
    wx.navigateTo({
        url: '../DIY-recipes/DIY-recipes',
    })
  },

  onTapEncourageAd:function(e){
    // 用户触发广告后，显示激励视频广告
    if (encourageAd) {
      encourageAd.show().catch(() => {
        // 失败重试
        encourageAd.load()
          .then(() => encourageAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },

  onLoad: function () {
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      encourageAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-9c98038b1ac978e2'
      })
      encourageAd.onLoad(() => {})
      encourageAd.onError((err) => {})
      encourageAd.onClose((res) => {})
    }
  },
})
