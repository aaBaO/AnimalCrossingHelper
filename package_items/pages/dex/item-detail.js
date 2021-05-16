const utils = require('../../../utils/utils')
const {getCNzh} = require('../../../localization/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:{ ["Housewares"]:{value:"家具", database:"Housewares"}, 
    ["Miscellaneous"]:{value:"杂物", database:"Miscellaneous"}, 
    ["ClothingOther"]:{value:"其他服装", database:"ClothingOther"} },
    index:0,
    inspectData:'undefined',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let all_items_info = []
    for(let i in this.data.category){
      const categoryInfo = this.data.category[i]
      if(categoryInfo.database){
        const item_info_array = require(`../../database/${categoryInfo.database}`)
        all_items_info = all_items_info.concat(item_info_array.data)
      }
    }
    this.data.all_items_info = all_items_info

    let inspectData = this.getInspectData(options.index)
    inspectData.displaySource = []
    for(let i in inspectData.source){
        inspectData.displaySource.push(getCNzh(inspectData.source[i]))
    }
    this.setData({
        inspectData:inspectData
    })
  },

  getInspectData: function(index){
    index = decodeURI(index)
    for(let i in this.data.all_items_info){
      let item = this.data.all_items_info[i]
      if(item.name == index)
        return item
    }
    return {}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var paramsURL = utils.urlEncode(this.options, 1) 
    return {
      title: "物品图鉴:" + this.data.inspectData.name,
      path: this.route + paramsURL
    }
  },
})