// mine.js
import { addOrder, addOrderNew, uploadFile } from '../../utils/api'
import { json2Form, dateFormat } from '../../utils/util'
import { PRINT_TYPE } from '../../utils/config'
import { showLoading, hideLoading } from '../../utils/util'

var app = getApp()
let currentType
Page({
  data: {
    width: 0,
    height: 0,
    swipeWidth: 0,
    swipeHeight: 0,
    current: 0,
    templateType: 'a4-template',
    type: null,
    imgUrls: [],
    idSize: 'mini'
  },
  onLoad(option) {
    if (!option.id) {
      wx.navigateTo({
        url: '../index/index'
      })
    }

    this.imgType = this.typeInit(option.id)
    this.imgSize = this.setImgSize()

    this.imgInit(option.imageUrl, option.width, option.height)

    // 4r，a4

    // 监听编辑图片页面发送的事件
    app.event.on('img', res => {
      const { imgUrls } = this.data
      if (Object.prototype.toString.call(imgUrls[res.index]) === '[object Object]') {
        imgUrls[res.index].status = 'success'
        imgUrls[res.index].url = decodeURIComponent(res.img)
        imgUrls[res.index].key = decodeURIComponent(res.key)
      } else {
        imgUrls[res.index] = {
          status: 'success',
          url: decodeURIComponent(res.img),
          key: decodeURIComponent(res.key)
        }
      }
      this.setData({
        imgUrls: imgUrls
      })
    })
  },
  uploadImg(url, index, cb) {
    const { imgUrls } = this.data
    if (!/^wxfile:\/\/\S*/g.test(url)) {
      return cb && cb(index, imgUrls)
    }
    showLoading({ title: '正在上传图片中...' })
    uploadFile(url)
      .then(res => {
        hideLoading()
        imgUrls[index] = Object.assign(imgUrls[index], {
            url: res.thumbnail_url,
            originUrl: res.thumbnail_url,
            key: res.image_key,
            originKey: res.image_key
          })
          // this.setData({
          //   current: index,
          //   imgUrls: imgUrls
          // })
        cb && cb(index, imgUrls)
      })
      .catch(err => {
        console.log(err)
        hideLoading()
        wx.showModal({
          title: '提示',
          content: `图片上传失败,请重试`
        })
      })
  },
  onEdit() {
    let typeId
    let self = this
    let { id, cropWidth, cropHeight } = currentType
    let { imgUrls, current } = this.data
    this.uploadImg(imgUrls[current].originUrl, current, function() {
      let { imgUrls, current } = self.data
      showLoading({ title: '正在上传图片中...' })
      wx.downloadFile({
        url: imgUrls[current].originUrl,
        success: function(res) {
          const params = {
            index: current,
            id: id,
            img: res.tempFilePath,
            width: cropWidth,
            height: cropHeight,
            key: imgUrls[current].originKey,
            imgWidth: imgUrls[current].width,
            imgHeith: imgUrls[current].height
          }
          hideLoading()
          wx.navigateTo({
            url: `../cropper/cropper?${json2Form(params)}`
          })
        },
        fail: function(res) {
          console.error(res)
          hideLoading()
          wx.showModal({
            title: '提示',
            content: '下载图片失败，无法使用编辑功能'
          })
        }
      })
    })

  },
  onPrint(e) {

    const { idSize, imgUrls } = this.data
    let count = imgUrls.length

    // 身份证必须要有图片
    if (currentType.id === 7 && count < 2) {
      return null
    }

    // 步骤
    const step = e.currentTarget.dataset.step

    let typeId = currentType.type_id
    if (currentType.id === 5) {
      typeId = idSize === 'mini' ? '804' : '803'
    }


    if (currentType.id === 2) {
      // 微信二维码打印
      pushScanOrder()
    } else {
      this.uploadImg(imgUrls[0].url, 0, commitOrder)
    }



    function commitOrder(index, imgUrls) {

      showLoading({
        title: '正在提交订单',
        icon: 'loading',
        duration: 10000
      })

      const imgs = imgUrls.map(item => item.key)
      count = imgs.length

      addOrderNew(typeId, imgs)
        .then(res => {
          console.log(res)
          hideLoading()

          // 向订单中心发送新的订单
          let now = new Date().getTime()
          const orderInfo = {
            create_time: dateFormat(now, 'yyyy-MM-dd hh:mm:ss'),
            id: res.print_order_id,
            print_code: res.print_code,
            print_order_status_id: 101,
            print_order_status_name: "未打印",
            print_type_id: currentType.type_id,
            print_type_name: currentType.name,
            // 支付订单索要
            print_count: count,
            type: currentType.type
          }
          app.event.emit('newOrder', orderInfo)

          if (step === 'stop') {
            wx.navigateTo({
              url: '../orderDetail/orderDetail?ac=' + encodeURIComponent(JSON.stringify(orderInfo))
            })
          } else {
            // 只允许从相机扫码
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                console.log(res)

                orderInfo.qr_msg = res.result
                  // 根据返回的 机器码 提交订单。付款
                wx.navigateTo({
                  url: '../orderSure/orderSure?' + json2Form(orderInfo)
                })
              }
            })
          }

        })
        .catch(err => {
          console.log('addoreder-err', err)
          hideLoading()
          if (err.result_message) {
            wx.showModal({
              title: '提交订单失败',
              content: err.result_message
            })
          } else {
            wx.showModal({
              title: '提交订单失败',
              content: '微信报错：' + err.errMsg
            })
          }
        })
    }

    // 二维码打印
    function pushScanOrder() {
      // 二维码打印， 获取用户信息
      let wxScanParams = {}
      const userInfo = wx.getStorageSync('userInfo')
      wxScanParams = {
        icon_url: userInfo.avatarUrl,
        icon_name: encodeURIComponent(userInfo.nickName)
      }

      //更新数据
      addOrder(typeId, imgUrls[0].originUrl, wxScanParams)
        .then(res => {
          console.log(res)
          hideLoading()
            // wx.navigateTo({
            //   url: '../print/print?' + json2Form(res)
            // })

          // 向订单中心发送新的订单
          let now = new Date().getTime()
          const orderInfo = {
            create_time: dateFormat(now, 'yyyy-MM-dd hh:mm:ss'),
            id: res.print_order_id,
            print_code: res.print_code,
            print_order_status_id: 101,
            print_order_status_name: "未打印",
            print_type_id: currentType.type_id,
            print_type_name: currentType.name,
            // 支付订单索要
            print_count: count,
            type: currentType.type
          }

          app.event.emit('newOrder', orderInfo)


          if (step === 'stop') {
            wx.navigateTo({
              url: '../orderDetail/orderDetail?ac=' + encodeURIComponent(JSON.stringify(orderInfo))
            })
          } else {
            // 只允许从相机扫码
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                console.log(res)

                orderInfo.qr_msg = res.result
                  // 根据返回的 机器码 提交订单。付款
                wx.navigateTo({
                  url: '../orderSure/orderSure?' + json2Form(orderInfo)
                })
              }
            })
          }
        })
        .catch(err => {
          console.log('addoreder-err', err)
          hideLoading()
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
    }
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

  // 初始数据
  initData(imgurls) {
    const systemInfo = wx.getSystemInfoSync()
    const swipeWidth = systemInfo.windowWidth
    const swipeHeight = systemInfo.windowHeight - 66

    const data = Object.assign({
        swipeWidth,
        swipeHeight,
        imgUrls: imgurls
      },
      this.imgType, this.imgSize)
    this.setData(data)
  },
  // 设置模板
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
      case 7:
        templateType = 'card-template'
        break
    }
    currentType = PRINT_TYPE.find(item => id == item.id)
    wx.setNavigationBarTitle({
      title: '打印' + currentType.name
    })
    return {
      type: currentType,
      templateType: templateType
    }
  },
  // 设置图片尺寸
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

    return {
      width: imgWidth,
      height: imgHeith
    }
  },
  // 
  imgInit(url, width, height) {
    if (!url) {
      this.initData([])
    } else {
      url = decodeURIComponent(url)
      const imgUrls = [{
        width,
        height,
        url,
        originUrl: url
      }]
      this.initData(imgUrls)
    }
  },



  // 身份证打印选择图片
  onChooseImg(e) {
    const current = e.currentTarget.dataset.current
    const imgUrls = this.data.imgUrls
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {


        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: imgInfo => {

            imgUrls[current] = {
              width: imgInfo.width,
              height: imgInfo.height,
              url: res.tempFilePaths[0],
              originUrl: res.tempFilePaths[0]
            }
            self.setData({
              current: current,
              imgUrls: imgUrls
            })
            self.onEdit()
          }
        })
      }
    })
  },
  onChangeCurrent(e) {
    const current = e.currentTarget.dataset.current
    this.setData({
      current: parseInt(current)
    })
  }
})