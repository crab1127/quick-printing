import { PRINT_TYPE } from '../../utils/config'

const app = getApp()
let currentType
Page({
  data: {
    id: 'cropper',
    width: 0,
    height: 0,
    minScale: 1,
    maxScale: 2.5,
    img: null
  },
  onLoad(option) {
    if (!option.img || !option.id) {
      wx.navigateBack()
    }

    currentType = PRINT_TYPE.find(item => option.id == item.id)
    this.setCanvasSize()
    const img = JSON.parse(option.img)
    this.setData({
      img: img
    })
    this.initCanvas(img.data.originUrl)
  },
  getDevice() {
    let self = this;
    !self.device && (self.device = wx.getSystemInfoSync())
    return self.device
  },
  initCanvas(src) {
    let self = this
    wx.getImageInfo({
      src,
      success(res) {
        let { id, width, height } = self.data
        let device = self.getDevice()
        let innerAspectRadio = res.width / res.height

        self.croperTarget = src
        self.baseWidth = width * device.windowWidth / 750
        self.baseHeight = width * device.windowWidth / (innerAspectRadio * 750)
        self.rectX = -self.baseWidth / 2
        self.rectY = (height * device.windowWidth / 750 - self.baseHeight) / 2 - self.baseHeight / 2
        self.scaleWidth = self.baseWidth
        self.scaleHeight = self.baseHeight
        self.oldScale = 1
        self.rotate = 0

        //  画布绘制图片
        self.ctx = wx.createCanvasContext(id)
        self.ctx.translate(self.baseWidth / 2, self.baseHeight / 2)
        self.ctx.drawImage(src, self.rectX, self.rectY, self.baseWidth, self.baseHeight)
        self.ctx.draw()
      }
    })
  },
  //  图片手势初始监测
  uploadScaleStart(e) {
    let self = this
    let xMove, yMove, oldDistance, oldSlope
    let [touch0, touch1] = e.touches

    //计算第一个触摸点的位置，并参照改点进行缩放
    self.touchX = touch0.x
    self.touchY = touch0.y
    self.imgLeft = self.rectX
    self.imgTop = self.rectY

    // 单指手势时触发
    e.touches.length === 1 && (self.timeOneFinger = e.timeStamp)

    // 两指手势触发
    if (e.touches.length >= 2) {
      self.touchX = self.rectX + self.scaleWidth / 2
      self.touchY = self.rectY + self.scaleHeight / 2

      //计算两指距离
      xMove = touch1.x - touch0.x
      yMove = touch1.y - touch0.y
      oldDistance = Math.sqrt(xMove * xMove + yMove * yMove)
      oldSlope = yMove / xMove

      self.oldDistance = oldDistance
      self.oldSlope = oldSlope
    } else {
      self.oldSlope = null
    }
  },
  //  图片手势动态缩放
  uploadScaleMove(e) {
    let self = this
    let { minScale, maxScale } = self.data
    let [touch0, touch1] = e.touches
    let xMove, yMove, newDistance, newSlope

    if (e.timeStamp - self.timeOneFinger < 100) {
      return
    }

    // 单指手势时触发
    if (e.touches.length === 1) {
      //计算单指移动的距离
      self.timeMoveTwo = self.timeMoveTwo || e.timeStamp
      if (e.timeStamp - self.timeMoveTwo < 100) {
        return
      }

      xMove = touch0.x - self.touchX
      yMove = touch0.y - self.touchY

      var tempX = xMove,
        tempY = yMove
      if (self.rotate == 90) {
        xMove = tempY
        yMove = -tempX
      } else if (self.rotate == 180) {
        xMove = -tempX
        yMove = -tempY
      } else if (self.rotate == 270) {
        xMove = -tempY
        yMove = tempX
      }

      self.imgLeft = self.rectX + xMove
      self.imgTop = self.rectY + yMove

      self.ctx.translate(self.baseWidth / 2, self.baseHeight / 2)
      self.ctx.rotate(self.rotate * Math.PI / 180)
      self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
      self.ctx.draw()
    }
    // 两指手势触发
    if (e.touches.length >= 2) {
      self.timeMoveTwo = e.timeStamp
        // 计算二指最新距离
      xMove = touch1.x - touch0.x
      yMove = touch1.y - touch0.y
      newDistance = Math.sqrt(xMove * xMove + yMove * yMove)
      self.newSlope = yMove / xMove

      //  使用0.005的缩放倍数具有良好的缩放体验
      self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)

      //  设定缩放范围
      self.newScale <= minScale && (self.newScale = minScale)
      self.newScale >= maxScale && (self.newScale = maxScale)

      self.scaleWidth = self.newScale * self.baseWidth
      self.scaleHeight = self.newScale * self.baseHeight
      self.imgLeft = self.touchX - self.scaleWidth / 2
      self.imgTop = self.touchY - self.scaleHeight / 2

      self.ctx.translate(self.baseWidth / 2, self.baseHeight / 2)
      self.ctx.rotate(self.rotate * Math.PI / 180)
      self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
      self.ctx.draw()
    }
  },
  uploadScaleEnd(e) {
    let self = this

    self.oldScale = self.newScale || self.oldScale
    self.rectX = self.imgLeft || self.rectX
    self.rectY = self.imgTop || self.rectY

    if (self.oldSlope) {
      console.log('oldSlope:' + self.oldSlope)
      var includedAngle = Math.atan(
          Math.abs(
            (self.newSlope - self.oldSlope) / (1 - self.newSlope * self.oldSlope)
          )
        ) //夹角公式
      if (includedAngle > 40 * Math.PI / 180) { //大于一定角度才认为发生旋转
        var direction = self.newSlope > self.oldSlope ? 1 : -1
        console.log('oldSlope:' + self.oldSlope)
        self.rotate = ((self.rotate + direction * 90) % 360 + 360) % 360

        self.ctx.translate(self.baseWidth / 2, self.baseHeight / 2)
        self.ctx.rotate(self.rotate * Math.PI / 180)
        self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
        self.ctx.draw()
      }
    }
  },
  getCropperImage() {
    let { id, img } = this.data

    wx.canvasToTempFilePath({
      canvasId: id,
      success(res) {
        img.data.url = res.tempFilePath
        app.event.emit('img', img)
        wx.navigateBack()
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onRotate(e) {
    const rotate = e.currentTarget.dataset.rotate
    this.ctx.rotate(rotate * Math.PI / 180)
    this.ctx.draw()
  },
  setCanvasSize() {
    const systemInfo = wx.getSystemInfoSync()

    const width = systemInfo.windowWidth - 40
    const height = systemInfo.windowHeight - 66 - 40
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