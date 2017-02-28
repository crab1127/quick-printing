import {
  API_ROOT,
  OPEN_ID,
  APP_ID,
  APP_KEY,
  APP_SECRET,
  APP_ACOUNT
} from './config'
import {
  get,
  post,
  put,
  del
} from './request'
import Promise from './promise.min.js'

// API 接口
const API_METHOD = {
  // 添加打印订单
  add_print_order: 'add_print_order',
  // 获取打印订单记录
  get_print_order_list: 'get_print_order_list',
  // 获取打印订单明细记录
  get_print_order_detail: 'get_print_order_detail',
  // 获取打印码
  get_print_code: 'get_print_code',
  // 获取营业网点列表
  get_sales_network_list: 'get_sales_network_list',
  // 删除打印订单
  delete_print_order: 'delete_print_order',
  // 再次下打印订单
  copy_print_order: 'copy_print_order',
  // 根据Code获取OpenId
  get_open_id_by_code: 'get_open_id_by_code'
}

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
            iconPath: '../../img/location.png',
            id: item.id,
            name: item.sales_network_name,
            address: item.detailed_address,
            longitude: item.longitude,
            latitude: item.latitude,
            width: 50,
            height: 50
          }
        })
        resolve(networks)
      })
  })
}

// 获取打印订单记录
export const getOrder = (page) => {
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

// 添加打印订单
export const addOrder1 = (type) => {
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

export const addOrder = (type, filePath) => {
  const params = Object.assign({
    method: API_METHOD.add_print_order,
    open_id: OPEN_ID,
    print_type_id: type,
    print_count: 1,
    file_key: 'file'
  }, baseParams)
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