export const API_ROOT = 'https://sandbox.wechat.redseawetoo.com/api'

export const APP_ID = 'wx09e3a5d21e215dd5'
export const APP_ACOUNT = 'gh_43f2f461d7ac'
export const APP_KEY = 'rsmina'
export const APP_SECRET = '0cbf52a63dd3f7ef4f32a519166a442b'

// export const OPEN_ID = 'o6w03s0KdEBxM--kj6UJwDeWHVKA'
export const OPEN_ID = wx.getStorageSync('open_id') || ''

export const PRINT_TYPE = [{
    id: 1,
    type_id: 801,
    count: 9,
    width: 750,
    height: 1116,
    cropWidth: 640,
    cropHeight: 954,
    name: '4R照片',
    sizeInfo: '15.2cm*10.2cm',
    img: '/img/slide-2.png'
  },
  // {
  //   id: 2,
  //   type_id: 888,
  //   count: 1,
  //   width: 610,
  //   height: 916,
  //   name: '微信二维码',
  //   img: '/img/slide-8.png'
  // },
  // {
  //   id: 2,
  //   count: 1,
  //   name: '打印文档',
  //   img: '/img/slide-3.png'
  // }, {
  //   id: 3,
  //   count: 1,
  //   name: '打印明信片',
  //   img: '/img/slide-4.png'
  // }, 
  {
    id: 4,
    type_id: 801,
    count: 9,
    width: 750,
    height: 1060,
    cropWidth: 640,
    cropHeight: 906,
    name: 'A4照片',
    sizeInfo: '29.7cm*21cm',
    img: '/img/slide-5.png'
  }, {
    id: 5,
    type_id: 802,
    count: 1,
    width: 330,
    height: 480,
    minWidth: 250,
    minHeight: 350,
    cropWidth: 640,
    cropHeight: 930,
    cropMinWidth: 500,
    cropMinHeight: 700,
    name: '证件照',
    sizeInfo: '大寸：4.8cm*3.3cm／小寸：4.8cm*3.3cm',
    img: '/img/slide-6.png'
  },
  // {
  //   id: 6,
  //   count: 1,
  //   name: '打印台历',
  //   img: '/img/slide-7.png'
  // },
  {
    id: 7,
    type_id: 801,
    count: 1,
    width: 550,
    height: 347,
    cropWidth: 640,
    cropHeight: 404,
    name: '身份证打印',
    img: '/img/slide-7.png'
  }
]

// API 接口
export const API_METHOD = {
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
  get_open_id_by_code: 'get_open_id_by_code',
  // 上传，编辑图片
  upload_image: 'upload_image',
  // 多图订单
  add_multiple_print_order: 'add_multiple_print_order'
}