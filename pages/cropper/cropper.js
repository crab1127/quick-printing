Page({
  data: {
    id: 'cropper',
    width: 300,
    height: 400,
    imgRotate: 0,
    imgWidth: 0,
    imgHeight: 0,
    imgLeft: 0,
    imgTop: 0,
    minScale: 1,
    maxScale: 2.5,
    minRotateAngle: 45, //判断发生旋转的最小角度
    src: 'wxfile://tmp_937687355o6zAJs22dwC_vej-pk7EQJoTUTPw1489392698491.jpg',
  },
  getDevice() {
    let self = this;
    !self.device && (self.device = wx.getSystemInfoSync())
    return self.device
  },

  onLoad(option) {
    let self = this
    let { src } = self.data
    self.initCanvas(src)
  },
  initCanvas(src) {
    let self = this
    wx.getImageInfo({
      src,
      success(res) {
        let { id, width, height } = self.data
        let device = self.getDevice()
        let aspectRatio = res.height / res.width

        //裁剪尺寸
        self.cropperWidth = width * device.windowWidth / 750
        self.cropperHeight = height * device.windowWidth / 750


        var minRatio = res.height / self.cropperHeight
        if (minRatio > res.width / self.cropperWidth) {
          minRatio = res.width / self.cropperWidth
        }

        //图片放缩的尺寸
        self.scaleWidth = res.width / minRatio
        self.scaleHeight = res.height / minRatio

        self.initScaleWidth = self.scaleWidth
        self.initScaleHeight = self.scaleHeight

        self.startX = (device.windowWidth - self.cropperWidth) / 2
        self.startY = (device.windowHeight - self.cropperHeight - 40) / 2

        self.rotate = 0
        self.oldScale = 1
        self.aspectRatio = aspectRatio

        self.setData({
          imgTranslateLeft: self.startX,
          imgTranslateTop: self.startY,
          imgWidth: self.scaleWidth,
          imgHeight: self.scaleHeight,
          referenceLineX: self.startX,
          referenceLineY: self.startY,
        })
        console.log(self.startX, self.startY, self.scaleWidth, self.scaleHeight)
          //  画布绘制图片
          // self.ctx = wx.createCanvasContext(id)
          // self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
          // self.ctx.rotate(90 * Math.PI / 180)
          // self.ctx.drawImage(src, self.startX, self.startY, self.scaleWidth, self.scaleHeight)
          // self.ctx.draw()
      }
    })
  },
  //  图片手势初始监测
  uploadScaleStart(e) {
    let self = this
    let xMove, yMove
    let [touch0, touch1] = e.touches
    self.touchNum = 0 //初始化，用于控制旋转结束时，旋转动作只执行一次

    //计算第一个触摸点的位置，并参照该点进行缩放
    self.touchX = touch0.clientX
    self.touchY = touch0.clientY
    self.imgLeft = self.startX
    self.imgTop = self.startY

    // 单指手势时触发
    e.touches.length === 1 && (self.timeOneFinger = e.timeStamp)

    // 两指手势触发
    if (e.touches.length >= 2) {
      self.initLeft = self.imgLeft / self.oldScale
      self.initTop = self.imgTop / self.oldScale

      //计算两指距离
      xMove = touch1.x - touch0.x
      yMove = touch1.y - touch0.y
      self.oldDistance = Math.sqrt(xMove * xMove + yMove * yMove)
      self.oldSlope = yMove / xMove
    }
  },
  //图片手势动态缩放
  uploadScaleMove: function(e) {
    var self = this
    fn(self, e)
      // drawOnTouchMove(self, e)
  },
  uploadScaleEnd(e) {
    let self = this
    self.oldScale = self.newScale || self.oldScale
    self.startX = self.imgLeft || self.startX
    self.startY = self.imgTop || self.startY

  },
  getCropperImage() {
    let self = this
    let { id } = self.data

    wx.canvasToTempFilePath({
      canvasId: id,
      success(res) {
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [res.tempFilePath], // 需要预览的图片http链接列表
        })
      }
    })
  }
})



function drawOnTouchMove(self, e) {
  console.log('run drawOnTouchMove')
  let { minScale, maxScale } = self.data
  let [touch0, touch1] = e.touches
  let xMove, yMove, newDistance, newSlope

  if (e.timeStamp - self.timeOneFinger < 100) { //touch时长过短，忽略
    return
  }

  // 单指手势时触发
  if (e.touches.length === 1) {
    //计算单指移动的距离
    xMove = touch0.clientX - self.touchX
    yMove = touch0.clientY - self.touchY
      //转换移动距离到正确的坐标系下

    self.imgLeft = self.startX + xMove
    self.imgTop = self.startY + yMove



  }
  // 两指手势触发
  if (e.touches.length >= 2) {
    // self.timeMoveTwo = e.timeStamp
    // 计算二指最新距离
    xMove = touch1.clientX - touch0.clientX
    yMove = touch1.clientY - touch0.clientY
    newDistance = Math.sqrt(xMove * xMove + yMove * yMove)
    self.newSlope = yMove / xMove

    //  使用0.005的缩放倍数具有良好的缩放体验
    self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)

    //  设定缩放范围
    self.newScale <= minScale && (self.newScale = minScale)
    self.newScale >= maxScale && (self.newScale = maxScale)

    self.scaleWidth = self.newScale * self.initScaleWidth
    self.scaleHeight = self.newScale * self.initScaleHeight
    self.imgLeft = self.newScale * self.initLeft
    self.imgTop = self.newScale * self.initTop


  }

  console.log(self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
  self.setData({
    imgTranslateLeft: self.imgLeft,
    imgTranslateTop: self.imgTop,
    imgWidth: self.scaleWidth,
    imgHeight: self.scaleHeight
  })
}

//为drawOnTouchMove函数节流
const fn = throttle(drawOnTouchMove, 100, 100)

/**
 * fn:延时调用函数
 * delay:延迟多长时间
 * mustRun:至少多长时间触发一次
 */
function throttle(fn, delay, mustRun) {
  var timer = null,
    previous = null;

  return function() {
    var now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    var remaining = now - previous;
    if (mustRun && remaining >= mustRun) {
      fn.apply(context, args);
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);

    }
  }
}