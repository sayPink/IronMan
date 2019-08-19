import day from 'dayjs'

// 设置title
const setTitle = (title) => {
  window.document.title = title || 'admin'
}
// 设置cookie
const setCookie = (name, value, iDay) => { //给浏览器设置cookie
  if (iDay === 0) {
    document.cookie = name + '=' + value
  } else {
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + '; expires=' + exp.toGMTString();
  }
}
// 获取cookie
const getCookie = name => {
  var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}
// 删除cookie
const removeCookie = name => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
}

const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  else return keysArr1.some(key => obj1[key] !== obj2[key])
}

const routeEqual = (route1, route2) => {
  const params1 = route1.arams || {};
  const params2 = route2.arams || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return route1.name === route2.name && objEqual(params1, params2) && objEqual(query1, query2)
}

export const routeHasExist = (tabList, routeItem) => {
  let len = tabList.length;
  let res = false;
  doCustomTimes(len, (index) => {
    if (routeEqual(tabList[index], routeItem)) res = true
  })
  return res;
}

// 拼接参数
const getKeyValueArr = obj => {
  let arr = [];
  Object.entries(obj).sort((a, b) => {
    return a[0] - b[0]
  }).forEach(([_key, _val]) => {
    arr.push(_key, _val)
  })
  return arr;
}

export const getTabNameByRoute = route => {
  const {
    name,
    params,
    query
  } = route;
  let res = name;
  if (params && Object.keys(params).length) res += ':' + getKeyValueArr(params).join('_')
  if (query && Object.keys(query).length) res += '&' + getKeyValueArr(query).join('_')
  return res;
}


// const getObjBySplitStr = (id, splitStr) => {
//   let splitArr = id.split(splitStr);
//   let str = splitArr[splitArr.length - 1];
//   let keyValArr = str.split('_');
//   let res = {};
//   let i = 0;
//   let len = keyValArr.length;
//   while (i < len) {
//     res[keyValArr[i]] = keyValArr[i + 1]
//     i += 2
//   }
//   return res
// }

// export const getRouteById = id => {
//   let res = {};
//   if (id.includes('&')) {
//     res.query = getObjBySplitStr(id, ':')
//     id = id.split('&')[0]
//   }
//   if (id.includes(':')) {
//     res.params = getObjBySplitStr(id, ':')
//     id = id.split(':')[0]
//   }
//   res.name = id;
//   return res;
// }

// 正则验证密码
export const validatePassword = /^[\w.]{6,20}$/;
// 正则验证用户 (字母+数组组合)
export const validateNnickname = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
// 验证手机号码
export const validatePhone = /^1(3|4|5|7|8|6)\d{9}$/;

export const dataFormat = (value, formats = 'YYYY-MM-DD HH:mm') => {
  return day(Number(value)).format(formats)
}

export default {
  setTitle,
  setCookie,
  getCookie,
  removeCookie,
  validatePhone,
  validatePassword,
  validateNnickname,
  dataFormat
}
