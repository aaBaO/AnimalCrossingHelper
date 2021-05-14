// pages/neighbor/neighbor.js
var neighbor_data = require('../../database/neighbors.js')
const utils = require('../../utils/utils')
const collection = require('../../utils/collection')
const dexType = 'neighbor'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    raceArray:[
      {value:'全部', checked:true },{value:'狗'},{value:'青蛙'},
      {value:'食蚁兽'},{value:'猩猩'},{value:'猫'},{value:'狼'},{value:'松鼠'},
      {value:'鸡'},{value:'老鹰'},{value:'猪'},{value:'牛'},{value:'马'},
      {value:'章鱼'},{value:'鹿'},{value:'狮子'},{value:'鸟'},{value:'老鼠'},
      {value:'小熊'},{value:'大熊'},{value:'鳄鱼'},{value:'奶牛'},{value:'绵羊'},
      {value:'山羊'},{value:'鸭'},{value:'猴子'},{value:'袋鼠'},{value:'象'},
      {value:'犀牛'},{value:'考拉'},{value:'鸵鸟'},{value:'兔子'},{value:'企鹅'},{value:'河马'},{value:'仓鼠'},{value:'老虎'}],

    personlityArray:[{value:'全部', checked:true},{value:'元气'},{value:'普通'},{value:'成熟'},
      {value:'大姐姐'},{value:'自恋'},{value:'运动'},{value:'悠闲'},{value:'暴躁'}],

    birthdayArray:[{value:'全部', checked:true},{value:'1月'},{value:'2月'},{value:'3月'},{value:'4月'},{value:'5月'},{value:'6月'},
      {value:'7月'},{value:'8月'},{value:'9月'},{value:'10月'},{value:'11月'},{value:'12月'}],
    
    hideFilterView:true,
    isDefaultFilter:true,

    tmp_raceArray:'undefined',
    tmp_personlityArray:'undefined',
    tmp_birthdayArray:'undefined',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  renderPage: function(resort){
    collection.getCollectionData().then((data)=>{
      neighbor_data.data.forEach(item => {
        item.hide = false
        if(data[dexType] && data[dexType][item.name]){
          item.collected = data[dexType][item.name]
        }
        else{
          item.collected = false
        }
      });

      if(resort){
        neighbor_data.data.sort(function(a, b){
          const ca = data[dexType] && data[dexType][a.name] == true
          const cb = data[dexType] && data[dexType][b.name] == true
          if(ca && !cb)
            return -1
          else if(!ca && cb)
            return 1

          return 0
        })
      }

      this.data.dataList = neighbor_data.data
      this.doFilter()
    })      

    this.setData({
      isDefaultFilter: this.isDefaultFilter()
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.renderPage(true)
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

  isMatchSearch:function(i, pattern){
    if(pattern == '' || pattern === 'undefined')
      return true

    var match = false
    var item = this.data.dataList[i]
    var reg = new RegExp(pattern, "i")
    if(reg.test(item.name) || reg.test(item.pinyin[0]) || reg.test(item.pinyin[1])
      || reg.test(item.foreign_name)){
      match = true
    }
    return match
  },

  onSearch:function(pattern){
    for (var i in this.data.dataList) {
      var item = this.data.dataList[i]
      item.hide = !this.isMatchSearch(i, pattern) || !this.isMatchFilter(i)
    }
  },
  
  onTapMoreInfo:function(e){
    var tapIndex = e.currentTarget.dataset.key
    var detailInfo = {
      type: dexType,
      key: tapIndex,
    }
    var params = utils.urlEncode(detailInfo, 1) 
    wx.navigateTo({
      url: '../neighbor/detail' + params,
    })
  },

  onTapFilter:function(e){
    this.data.hideFilterView = !this.data.hideFilterView
    if(this.data.hideFilterView){
      this.setData({
        hideFilterView: this.data.hideFilterView,
        isDefaultFilter: this.isDefaultFilter()
      })
      return
    }

    const tmp_raceArray = utils.deepCopy(this.data.raceArray)
    const tmp_personlityArray = utils.deepCopy(this.data.personlityArray)
    const tmp_birthdayArray = utils.deepCopy(this.data.birthdayArray)

    this.setData({
      hideFilterView: this.data.hideFilterView,
      isDefaultFilter: this.isDefaultFilter(),
      tmp_raceArray: tmp_raceArray,
      tmp_personlityArray: tmp_personlityArray,
      tmp_birthdayArray: tmp_birthdayArray
    })
  },

  onSetFilter:function(e){
    //找到修改的过滤类型
    var type = e.currentTarget.dataset.type
    let items = 'undefined'
    if(type === 'race'){
      items = this.data.tmp_raceArray
    }
    else if(type == 'personlity'){
      items = this.data.tmp_personlityArray
    }
    else if(type == 'birthday'){
      items = this.data.tmp_birthdayArray
    }

    if (items === 'undefined')
      return

    var values = e.detail.value
    var hasTotal = values.includes('全部')
    var skip = false
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

    var i = 1
    for(i; i < items.length; i++){
      items[i].checked = false
    }

    if (!skip){
      i = 1
      for(i; i < items.length; i++){
        for(var j in values){
          if(items[i].value === values[j]){
            items[i].checked = !items[i].checked
          }
        }
      }
    }

    this.setData({
      tmp_raceArray: this.data.tmp_raceArray,
      tmp_personlityArray: this.data.tmp_personlityArray,
      tmp_birthdayArray: this.data.tmp_birthdayArray
    })
  },

  onTapConfirmChangeFilter:function(e){
    this.data.raceArray = this.data.tmp_raceArray
    this.data.personlityArray = this.data.tmp_personlityArray
    this.data.birthdayArray = this.data.tmp_birthdayArray
    this.doFilter()
    this.onTapFilter()
    this.setData({
      raceArray:this.data.tmp_raceArray,
      personlityArray:this.data.tmp_personlityArray,
      birthdayArray:this.data.tmp_birthdayArray
    })
  },

  //是否是默认筛选条件
  isDefaultFilter:function(){
    var dr = this.data.raceArray[0].checked
    var dc = this.data.personlityArray[0].checked 
    var db = this.data.birthdayArray[0].checked 
    return dr && dc && db
  },

  isMatchFilter:function(index){
    var item = this.data.dataList[index]
    var matchr = false
    var matchc = false
    var matchb = false

    for(var r in this.data.raceArray){
      var trace = this.data.raceArray[r]
      if(!trace.checked)
        continue

      if (r == 0){
        matchr = true
        break;
      }
      if(item.race == trace.value){
        matchr = true
      }
    }

    for(var c in this.data.personlityArray){
      var tpersonlity = this.data.personlityArray[c]
      if(!tpersonlity.checked)
        continue

      if (c == 0){
        matchc = true
        break;
      }
      if(item.personlity == tpersonlity.value){
        matchc = true
      }
    }

    for(var b in this.data.birthdayArray){
      var tbirthday = this.data.birthdayArray[b]
      if(!tbirthday.checked)
        continue

      if (b == 0){
        matchb = true
        break;
      }
      if(item.birthday.includes(tbirthday.value)){
        matchb = true
      }
    }
    return matchr && matchc && matchb
  },

  doFilter:function(e){
    const datas = this.data.dataList
    for (var i in datas) {
      var item = datas[i]
      item.hide = !this.isMatchSearch(i, this.data.searchInput) || !this.isMatchFilter(i)
    }

    this.setData({
      dataList: datas
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