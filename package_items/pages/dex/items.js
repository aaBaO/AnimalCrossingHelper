const utils = require('../../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideFilterView:true,
    isDefaultFilter:true,

    filter_map:{
      category:[ {value:"全部", checked:true}, {value:"家具", database:"Housewares"}, {value:"杂物", database:"Miscellaneous"}, 
                 {value:"其他服装", database:"ClothingOther"} ]
    },

    tmp_filter_map:{
      category:[]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let all_items_info = []
    for(let i in this.data.filter_map.category){
      const categoryInfo = this.data.filter_map.category[i]
      if(categoryInfo.database){
        const item_info_array = require(`../../database/${categoryInfo.database}`)
        all_items_info = all_items_info.concat(item_info_array.data)
      }
    }
    this.data.all_items_info = all_items_info
  },

  renderPage: function(){
    this.doFilter()
    this.setData({
      isDefaultFilter: this.isDefaultFilter(),
      all_items_info: this.data.all_items_info
    });
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
      all_items_info: this.data.all_items_info
    })
  },

  onSearch:function(pattern){
    for (var i in this.data.all_items_info) {
      var item = this.data.all_items_info[i]
      item.hide = !this.isMatchSearch(i, pattern) || !this.isMatchFilter(i)
    }
  },

  isMatchSearch:function(i, pattern){
    if(pattern == '' || pattern === 'undefined')
      return true

    var match = false
    var item = this.data.all_items_info[i]
    var reg = new RegExp(pattern, "i")
    if(reg.test(item.name) || reg.test(item.enName) || reg.test(item.jpName)){
      match = true
    }
    return match
  },
  
  onTapMoreInfo:function(e){
    var tapIndex = e.currentTarget.dataset.index
    var detailInfo = {
      index: tapIndex,
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../dex/item-detail' + params,
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

  isDefaultFilter:function(){
    var dr = this.data.filter_map.category[0].checked
    return dr
  },

  //筛选数据
  doFilter:function(e){
    for (let i in this.data.all_items_info) {
      let item = this.data.all_items_info[i]
      item.hide = !this.isMatchSearch(i, this.data.searchInput) || !this.isMatchFilter(i)
    }

    this.setData({
      all_items_info: this.data.all_items_info
    })
  },

  //是否需要过滤
  isMatchFilter:function(index){
    let item = this.data.all_items_info[index]
    let matchc = false

    for(let i in this.data.filter_map.category){
      let filter_settings = this.data.filter_map.category[i]
      if(!filter_settings.checked)
        continue

      if (i == 0){
        matchc = true
        break;
      }
      if(item.category == filter_settings.database){
        matchc = true
      }
    }

    return matchc 
  },

  //打开筛选
  onTapFilter:function(e){
    this.data.hideFilterView = !this.data.hideFilterView
    if(this.data.hideFilterView){
      this.setData({
        hideFilterView: this.data.hideFilterView,
        isDefaultFilter: this.isDefaultFilter()
      })
      return
    }

    this.data.tmp_filter_map.category = utils.deepCopy(this.data.filter_map.category)

    this.setData({
      hideFilterView: this.data.hideFilterView,
      isDefaultFilter: this.isDefaultFilter(),
      tmp_filter_map: this.data.tmp_filter_map,
    })
  },

  closeFilter:function(){
    this.data.hideFilterView = true 
    this.setData({
      hideFilterView: this.data.hideFilterView,
    })
  },

  //点击筛选中的选项
  onSetFilter:function(e){
    //找到修改的过滤类型
    let type = e.currentTarget.dataset.type
    let items = 'undefined'
    if(type === 'category'){
      items = this.data.tmp_filter_map.category
    }
    else if (items === 'undefined')
      return

    let values = e.detail.value
    let hasTotal = values.includes('全部')
    let skip = false
    if(hasTotal && items[0].checked === false){
      items[0].checked = true
      skip = true
    }
    else if(hasTotal && values.length > 1 && items[0].checked === true){
      items[0].checked = false
    }
    else if(values.length <= 0){
      items[0].checked = true
      skip = true
    }

    let i = 1
    for(i; i < items.length; i++){
      items[i].checked = false
    }

    if (!skip){
      i = 1
      for(i; i < items.length; i++){
        for(let j in values){
          if(items[i].value === values[j]){
            items[i].checked = !items[i].checked
          }
        }
      }
    }

    this.setData({
      tmp_filter_map: this.data.tmp_filter_map
    })
  },

  //点击确认筛选
  onTapConfirmChangeFilter:function(e){
    this.data.filter_map = this.data.tmp_filter_map
    this.doFilter()
    this.closeFilter()
    this.setData({
      filter_map : this.data.tmp_filter_map
    })
  },
})