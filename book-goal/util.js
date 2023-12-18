/**
 * copy的date字符串格式化方法
 * @param {string} fmt 
 * @returns {string}
 */
Date.prototype.format = function (fmt) {
  const o = {
    "M+": this.getMonth() + 1,                     //月份 
    "d+": this.getDate(),                          //日 
    "h+": this.getHours(),                         //小时 
    "m+": this.getMinutes(),                       //分 
    "s+": this.getSeconds(),                       //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3),   //季度 
    "S": this.getMilliseconds()                    //毫秒 
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

/**
 * 一些DOM选择器的“语法糖”，懒得学习JQuery了
 * @param {HTMLElement} rootDom 
 */
const Selector = rootDom => {
  if (rootDom == null)
    rootDom = document
  return {
    /**
     * @param {string} elemId 
     * @returns {HTMLElement}
     */
    id(elemId) {
      return rootDom.getElementById(elemId)
    },
    /**
     * @param {string} elemClassName 
     * @returns {HTMLElement[]}
     */
    clazz(elemClassName) {
      return [...rootDom.getElementsByClassName(elemClassName)]
    },
    /**
     * @param {string} elemTagName 
     * @returns {HTMLElement[]}
     */
    tag(elemTagName) {
      return [...rootDom.getElementsByTagName(elemTagName)]
    }
  }
}
Selector.id = Selector().id
Selector.clazz = Selector().clazz
Selector.tag = Selector().tag

// 别名
const S = Selector
