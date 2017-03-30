import {
  API_ROOT,
  APP_ID,
  APP_KEY,
  APP_SECRET,
  APP_ACOUNT,
  API_METHOD
} from './config'
import {
  get,
  post,
  put,
  del
} from './request'
import Promise from './promise.min.js'



let OPEN_ID = wx.getStorageSync('open_id')
const baseParams = {
  app_key: APP_KEY,
  app_secret: APP_SECRET,
  wechat_acount: APP_ACOUNT
}

// 登入
export const login = (code) => {
  const params = Object.assign({
    method: API_METHOD.get_open_id_by_code,
    js_code: code
  }, baseParams)

  return new Promise((resolve, reject) => {
    get(API_ROOT, params)
      .then(res => {
        wx.setStorageSync('open_id', res.open_id)
        wx.setStorageSync('session_key', res.session_key)
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

// 获取网点
export const salesNetwork = () => {
  const params = Object.assign({
    method: API_METHOD.get_sales_network_list
  }, baseParams)

  return new Promise((resolve, reject) => {
    get(API_ROOT, params)
      .then(res => {
        const networks = res.sales_network_list.map(item => {
          return {
            iconPath: '../../img/webwxgetmsgimg.jpg',
            id: item.id,
            name: item.sales_network_name,
            address: item.detailed_address,
            longitude: item.longitude,
            latitude: item.latitude,
            width: 34,
            height: 34
          }
        })
        resolve(networks)
      })
  })
}

// 获取打印订单记录
export const getOrder = (page) => {
    let OPEN_ID = wx.getStorageSync('open_id')
    const params = Object.assign({
      method: API_METHOD.get_print_order_list,
      open_id: OPEN_ID
    }, page, baseParams)

    return new Promise((resolve, reject) => {
      get(API_ROOT, params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
  // 获取打印订单明细记录
export const getOrderDetail = (id) => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.get_print_order_detail,
    open_id: OPEN_ID,
    print_order_id: id
  }, baseParams)

  return new Promise((resolve, reject) => {
    get(API_ROOT, params)
      .then(res => {
        console.log(res)
        resolve(res.print_order_detail_list)
      })
      .catch(err => reject(err))
  })
}

// 删除印大
export const delOrder = (id) => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.delete_print_order,
    open_id: OPEN_ID,
    print_order_id: id
  }, baseParams)

  return new Promise((resolve, reject) => {
    get(API_ROOT, params)
      .then(res => resolve())
      .catch(err => reject(err))
  })
}

export const copyOrder = id => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.copy_print_order,
    open_id: OPEN_ID,
    print_order_id: id
  }, baseParams)

  return new Promise((resolve, reject) => {
    get(API_ROOT, params)
      .then(res => resolve())
      .catch(err => reject(err))
  })
}

export const addOrder1 = (type) => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.add_print_order,
    open_id: OPEN_ID,
    print_type_id: type,
    print_count: 1,
    file_key: 'file'
  }, baseParams)

  return new Promise((resolve, reject) => {
    post(API_ROOT, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

// 添加打印订单
export const addOrder = (type, filePath, wxScan = {}) => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.add_print_order,
    open_id: OPEN_ID,
    print_type_id: type,
    print_count: 1,
    file_key: 'file'
  }, baseParams, wxScan)

  console.log(1, params)
  console.log(1, filePath)
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_ROOT, //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {
        'json_body': JSON.stringify(params)
      },
      success: function(res) {
        let ac = res.data
        if (typeof res.data === 'string') {
          ac = JSON.parse(res.data)
        }
        if (ac.result_code === 0) {
          resolve(ac)
        } else {
          reject(ac)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })

}

// 上传,编辑图片
export const uploadFile = (filePath, crop) => {

  const isCrop = crop ? true : false
  const params = Object.assign({
    method: API_METHOD.upload_image,
    file_key: 'file',
    is_crop: isCrop
  }, baseParams, crop)

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_ROOT, //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {
        'json_body': JSON.stringify(params)
      },
      success: function(res) {
        console.log('uploadFile', res)
        let ac = res.data
        if (typeof res.data === 'string') {
          ac = JSON.parse(res.data)
        }
        if (ac.result_code === 0) {
          resolve(ac)
        } else {
          reject(ac)
        }
      },
      fail(err) {
        console.error('uploadFile', err)
        reject(err)
      }
    })
  })
}

// 多张图片创建订单
export const addOrderNew = (type, imgs, wxScan = {}) => {
  let OPEN_ID = wx.getStorageSync('open_id')
  const params = Object.assign({
    method: API_METHOD.add_multiple_print_order,
    open_id: OPEN_ID,
    print_type_id: type,
    // image_key: imgs[0],
    image_key_list: imgs
  }, baseParams, wxScan)

  return new Promise((resolve, reject) => {
    post(API_ROOT, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}