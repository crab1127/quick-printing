import Promise from './promise.min.js'

const fundebug = require('./fundebug.min.js');
fundebug.apikey = '453174116df10a95f428f5277493d3626d72ec5e814303743b8d69cd21699d53';


export const request = (method = 'GET') => (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: {
        json_body: JSON.stringify(data)
      },
      method,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.result_code === 0) {
          resolve(res.data)
        } else {
          reject(res.data)
          fundebug.notifyError('API:' + url + '; ' + JSON.stringify(data) + '; ' + JSON.stringify(res.data))
        }
      },
      fail: function(err) {
        reject(err)
        fundebug.notifyError('API-weixin:' + url + '; ' + JSON.stringify(data) + '; ' + JSON.stringify(err))
      }
    });
  })
}
export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const del = request('DELETE');