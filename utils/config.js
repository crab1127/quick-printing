export const API_ROOT = 'http://sandbox.wechat.redseawetoo.com/api'

export const APP_ID = 'wx09e3a5d21e215dd5'
export const APP_ACOUNT = 'gh_43f2f461d7ac'
export const APP_KEY = 'rsmina'
export const APP_SECRET = '0cbf52a63dd3f7ef4f32a519166a442b'

// export const OPEN_ID = 'o6w03s0KdEBxM--kj6UJwDeWHVKA'
export const OPEN_ID = wx.getStorageSync('open_id') || ''

export const PRINT_TYPE = [{
    id: 1,
    type_id: 801,
    count: 1,
    width: 768,
    height: 1024,
    name: '4R照片',
    img: '/img/slide-2.png'
  },
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
    count: 1,
    width: 794,
    height: 1090,
    name: 'A4照片',
    img: '/img/slide-5.png'
  }, {
    id: 5,
    type_id: 802,
    count: 1,
    width: 330,
    height: 480,
    minWidth: 250,
    minHeight: 350,
    name: '证件照',
    img: '/img/slide-6.png'
  },
  // {
  //   id: 6,
  //   count: 1,
  //   name: '打印台历',
  //   img: '/img/slide-7.png'
  // }
]