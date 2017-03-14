// mine.js
import { addOrder } from '../../utils/api'
import { json2Form } from '../../utils/util'
import { PRINT_TYPE } from '../../utils/config'

var app = getApp()
let currentType
Page({
  data: {
    width: 0,
    height: 0,
    current: 0,
    templateType: null,
    type: null,
    imgUrls: [],
    idSize: 'mini'
  },
  onLoad(option) {
    if (!option.imageUrls || !option.id) {
      wx.navigateTo({
        url: '../index/index'
      })
    }

    // option.id = 5
    // option.imageUrls = "wxfile://tmp_937687355o6zAJs22dwC_vej-pk7EQJoTUTPw1488251766880.jpg"

    this.typeInit(option.id)
    this.imgInit(option.imageUrls)

    // 4r，a4 的
    this.setImgSize()

    // 监听编辑图片页面发送的事件
    app.event.on('img', (data) => {
      const { imgUrls } = this.data
      imgUrls[data.index] = data.data
      this.setData({
        imgUrls: imgUrls
      })
    })
  },
  onEdit() {
    let typeId
    if (currentType.id === 5) {
      typeId = this.data.idSize === 'mini' ? '804' : '803'
    }
    const params = {
      index: this.data.current,
      img: JSON.stringify(this.data.imgUrls[this.data.current]),
      width: 640,
      height: 960
    }
    wx.navigateTo({
      url: `../cropper/cropper?${json2Form(params)}`
    })
  },
  onPrint() {
    wx.showToast({
      title: '获取打印码',
      icon: 'loading',
      duration: 10000
    })
    let typeId = currentType.type_id
    if (currentType.id === 5) {
      typeId = this.data.idSize === 'mini' ? '804' : '803'
    }


    let wxScanParams = {}
    if (currentType.id === 2) {
      const userInfo = wx.getStorageSync('userInfo')
      wxScanParams = {
        icon_url: userInfo.avatarUrl,
        icon_name: encodeURIComponent(userInfo.nickName)
      }
    }
    //更新数据
    addOrder(typeId, this.data.imgUrls[0].url, wxScanParams)
      .then(res => {
        console.log(res)
        wx.hideToast()
        wx.navigateTo({
          url: '../print/print?' + json2Form(res)
        })

        // 向订单中心发送新的订单
        app.event.emit('newOrder', {
          create_time: +new Date(),
          id: res.print_order_id,
          print_code: res.print_code,
          print_order_status_id: 101,
          print_order_status_name: "未打印",
          print_type_id: currentType.type_id,
          print_type_name: currentType.name
        })
      })
      .catch(err => {
        console.log('addoreder-err', err)
        wx.hideToast()
        if (err.result_message) {
          wx.showModal({
            title: '获取打印码失败',
            content: err.result_message
          })
        } else {
          wx.showModal({
            title: '获取打印码失败',
            content: '微信报错：' + err.errMsg
          })
        }
      })
  },
  // 4r 的
  onSlideChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  // 证件照的
  onIdChange(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      idSize: type,
      templateType: type + '-id-template'
    })
  },
  typeInit(id) {
    let templateType
    if (typeof id !== 'number') {
      id = parseInt(id)
    }
    switch (id) {
      case 1:
      case 4:
      case 2:
        templateType = 'a4-template'
        break
      case 5:
        templateType = 'mini-id-template'
        break
    }

    currentType = PRINT_TYPE.find(item => id == item.id)
    wx.setNavigationBarTitle({
      title: '打印' + currentType.name
    })
    this.setData({
      type: currentType,
      templateType: templateType
    })
  },
  imgInit(imgUrl) {
    const imgUrls = imgUrl.split(',')
    const ac = imgUrls.map(item => {
      return {
        'url': item,
        'originUrl': item
      }
    })
    this.setData({
      imgUrls: ac
    })
  },
  // 证件照

  // 4R A4 明星片
  setImgSize() {
    const systemInfo = wx.getSystemInfoSync()
    console.log(systemInfo);

    const width = systemInfo.windowWidth
    const height = systemInfo.windowHeight - 66
    let imgWidth
    let imgHeith
    if (width / height > currentType.width / currentType.height) {
      imgHeith = height
      imgWidth = height * currentType.width / currentType.height
    } else {
      imgWidth = width
      imgHeith = width * currentType.height / currentType.width
    }
    this.setData({
      width: imgWidth,
      height: imgHeith
    })
  }
})