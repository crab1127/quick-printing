function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}
/**
 * 时间格式化
 * @param  {[Number]} date 时间戳
 * @param  {[DateString]} fmt  时间格式
 * dateFormat('yyyy-MM-dd hh:mm:ss.S') => 2016-03-12 20:13:32.232
 * @return {[date]} 时间
 */
function dateFormat(date, fmt) {
  const date1 = new Date(date)
  const o = {
    'M+': date1.getMonth() + 1, // 月
    'd+': date1.getDate(), // 日
    'h+': date1.getHours(), // 小时
    'm+': date1.getMinutes(), // 分
    's+': date1.getSeconds(), // 秒
    'q+': Math.floor((date1.getMonth() + 3) / 3), // 季度S
    'S': date1.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date1.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}


function showLoading(str) {
  console.log(2324234234243)
  if (wx.showLoading) {
    wx.showLoading(Object.assign(str, { mask: true }))
  } else {
    wx.showToast(Object.assign(str, {
      icon: 'loading',
      duration: 10000
    }))
  }
}

function hideLoading() {
  if (wx.hideLoading) {
    wx.hideLoading()
  } else {
    wx.hideToast()
  }
}

module.exports = {
  formatTime,
  json2Form,
  dateFormat,
  showLoading,
  hideLoading
}