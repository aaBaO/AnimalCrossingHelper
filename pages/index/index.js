//index.js
//获取应用实例
const app = getApp()

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

  onLoad: function () {
  },
})
