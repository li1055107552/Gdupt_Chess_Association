const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 生成验证码
function getCode(long){
    var code = ''
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
    for (var i = 0; i < long; i++) {
      if(i == 0)
        var index = Math.floor(Math.random() * 9+1)
      else
        var index = Math.floor(Math.random() * 10)
      code += random[index];
    }
    return Number(code)
}

module.exports = {
  formatTime: formatTime,
  getCode:getCode
}
