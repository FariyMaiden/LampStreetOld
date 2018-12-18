/**
 * 所用接口统一的baseURL
 */
// const baseURL = "https://www.worthiot.cn:8001/worthiot.asmx/"
const baseURL = "https://www.trjiot.cn/TRJStreetLight.asmx/"

/**
 * get请求与post请求
 * url:相对路径
 * params:参数
 */

function GET(url, params) {
  return request("GET", url, params)
}

function POST(url, params) {
  return request("POST", url, params)
}

function request(method, url, params) {
  /**
   * 这里可以对参数进行加密处理（暂时忽略）
   */

 

  /**
   * 重组完整的URL
   */
  var API_URL = baseURL + url

  /**
   * 惊醒网络请求，这里可以显示loading
   */

  return new Promise((resolve, reject)=>{
    wx.request({
      url: API_URL,
      // data: {
      //   evalue: JSON.stringify(params)
      // },
      data:params,
      method: method,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //注意：可以对参数解密等处理
        // resolve(res.data)
        //小宝贝你可以这样返回
        //这样一此处理，就不需要每次都进行一大堆的操作了
        resolve(JSON.parse(res.data.replace(/<[^>]+>/g, "").replace(/[' '\r\n]/g, "")))
      },
      fail: function (res) {
        reject(res.data)
      },
      complete: function () {
        /**
         * 结束loading
         */
      }
    })
  })
}

/**
 * 暴露外调接口
 */
module.exports = {
  GET: GET,
  POST: POST
}