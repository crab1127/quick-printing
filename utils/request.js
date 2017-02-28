import Promise from './promise.min.js'

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
        }
      },
      fail: function(err) {
        reject(err)
      }
    });
  })
}
export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const del = request('DELETE');