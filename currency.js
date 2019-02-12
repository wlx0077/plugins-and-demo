/**
 * 格式化货币
 * @param num : number / 数目
 * @param precision? : number / 精度
 * @param symbol? : string / 符号
 * @returns {string}
 */
function currency (num, precision, symbol) {
  if (precision == null) precision = 2
  if (symbol == null) symbol = '$'

  var temp = num.toString().split('.')
  var head = temp[0]
  var end = temp[1] || ''

  var step = 3
  var more = head.length % step
  var headOne = ''
  var headTwo = ''
  if (more > 0) {
    headOne = head.slice(0, more)
    headTwo = head.slice(more)
  } else {
    headTwo = head
  }

  var headTwoArr = []
  var chunks = headTwo.length / step
  for (var i = 0; i < chunks; i++) {
    headTwoArr[i] = headTwo.slice(i*step, i*step+step)
  }

  head = headOne ? headOne + ',' + headTwoArr.join(',') : headTwoArr.join(',')

  if (end.length > precision) {
    end = end.slice(0, precision)
  } else {
    var zero = ''
    for (var j = 0; j < precision - end.length; j++) {
      zero += '0'
    }
    end += zero
  }

  return end ? symbol + head + '.' + end : symbol + head
}

