const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const deepCopy = obj => {
  var c = {}
  c = JSON.parse(JSON.stringify(obj))
  return c
}

// 页面滚动到指定id的组件
const pageScrollToId = function (page, id, offset) {
    const query = wx.createSelectorQuery().in(page);
    query.select(id).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((rects) => {
        // 使页面滚动到指定item
        const pos = rects[0].top - offset
        wx.pageScrollTo({
            scrollTop: pos,
            duration: 300
        })
    })
}


/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * idx ,循环第几次，用&拼接
 * return URL参数字符串
 */
const urlEncode = (param,idx, key, encode)=> {
  if(param==null) return ''
  var paramStr = ''
  var t = typeof (param)
  if (t == 'string' || t == 'number' || t == 'boolean') {
    var one_is = idx < 3 ? '?':'&'
    paramStr += one_is + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param)
  } 
  else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      idx++
      paramStr += urlEncode(param[i],idx, k, encode);
    }
  }
  return paramStr;
}

/** string **/
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

module.exports = {
  formatTime: formatTime,
  pageScrollToId: pageScrollToId,
  urlEncode:urlEncode,
  deepCopy:deepCopy
}
