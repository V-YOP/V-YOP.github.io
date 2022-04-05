"use strict";

const OG_TYPE = "og:type"
const OG_TITLE = "og:title"
const OG_URL = "og:url"
const OG_SITE_NAME = "og:site_name"
const OG_DESCRIPTION = "og:description"
const OG_LOCALE = "og:locale"
const ARTICLE_PUBLISHED_TIME = "article:published_time"
const ARTICLE_MODIFIED_TIME = "article:modified_time"
const ARTICLE_AUTHOR = "article:author"

// 从meta直接拿到yaml format中定义的date
// metaData :: Map String String
const metaData = (function () {
  const resMap = {}
  const metas = S.tag("meta")
  metas.filter(meta => (meta.attributes["property"] || meta.attributes["name"]) && meta.attributes["content"])
    .map(meta => [(meta.attributes["property"] || meta.attributes["name"]).value, meta.attributes["content"].value])
    .forEach(([property, content]) => resMap[property] = content)
  return resMap
})()

S.id("modified-time").textContent = new Date(metaData[ARTICLE_MODIFIED_TIME]).format("yyyy-MM-dd")

// liList :: [HTMLElement]
const liList = S(S.clazz("post-body")[0]).tag("ul")
        .flatMap(ul => S(ul).tag("li"))

const taskCount = liList.length
const workingCount = liList.filter(li => li.innerHTML.indexOf("##WORKING##") != -1).length

// 获取elem.textContent / elem["target"]的百分数表示
// HTMLElement -> tring
/**
 * @param {HTMLElement} elem 
 * @returns {string}
 */
const getPercentFormat = elem =>
  Number.parseInt(Number.parseInt(elem.textContent) / Number.parseInt(S.id(elem.getAttribute("target")).textContent) * 100) + "%"


// --------下面的代码将造成副作用------------

S.clazz("eval-to-percent").forEach(elem => {
  const evaluatedText = parseInt(eval("100 * " + elem.textContent)) + "%"
  // set to percent form
  elem.textContent = `${evaluatedText} : ${elem.textContent}`
})

// 把##WORKING##替换成一个齿轮标
liList.forEach(li => li.innerHTML = li.innerHTML.replaceAll("##WORKING##", '<i class="fa fa-cog fa-spin"></i>'))

S.id("passed-time").textContent = parseInt(parseInt((Date.parse(new Date()) - Date.parse(`${new Date().getFullYear()}-01-01`)) / (1000 * 60 * 60 * 24)) / 365 * 100) + "%"