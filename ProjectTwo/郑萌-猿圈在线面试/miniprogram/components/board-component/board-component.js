const TEduBoard = require('./libs/TEduBoard_miniprogram.min.js');
const ImHandler = require('../webim-component/ImHandler');


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userId: {
      type: String,
      value: ''
    },

    userSig: {
      type: String,
      value: ''
    },

    sdkAppID: {
      type: Number,
      value: null
    },

    classId: {
      type: Number,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    board: null,
    currentPic: "", //预留图片链接
    imgLoadList: null, //预加载图片链接列表
    bgColor: '#ffffff',
    naturalWidth: 0,
    naturalHeight: 0,
    imgStyle: '',
    boardWidth: 0,
    boardHeight: 0,
    wrapWidth: 0,
    wrapHeight: 0,
    ratio: '16:9'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    render(borderConfig, callback) {
      this.data.ratio = borderConfig.ratio;
      wx.createSelectorQuery().in(this).select('.tic-board-box').boundingClientRect((rect) => {
        var width, height;
        var widthHeight = this.calculateBoardSize(rect.width, rect.height);
        width = widthHeight.width;
        height = widthHeight.height;

        this.setData({
          wrapWidth: width,
          wrapHeight: height,
          boardWidth: width,
          boardHeight: height
        }, () => {
          this.init(borderConfig);
          callback && callback();
        });
      }).exec();
    },

    getBoardInstance() {
      return this.data.board;
    },

    init(borderConfig) {
      var canvasComponent = wx.createCanvasContext('tic_board_canvas', this);

      var width = this.data.boardWidth;
      var height = this.data.boardHeight;

      this.data.board = wx.board = new TEduBoard({
        classId: borderConfig.classId,
        preStep: this.data.preStep, //预加载步数
        userId: borderConfig.userId,
        userSig: borderConfig.userSig,
        sdkAppId: borderConfig.sdkAppId,
        width,
        height,
        canvasComponent,
        context: this,
        orientation: borderConfig.orientation,
        drawEnable: borderConfig.drawEnable,
        ratio: borderConfig.ratio,
        brushColor: borderConfig.brushColor,
        brushThin: borderConfig.brushThin,
        toolType: borderConfig.toolType,
        globalBackgroundColor: borderConfig.globalBackgroundColor
      });


      this.data.orientation = borderConfig.orientation;

      if (this.data.orientation === 'horizontal') { // 横屏
        height = this.data.boardWidth;
        width = this.data.boardHeight;
      } else {
        width = this.data.boardWidth;
        height = this.data.boardHeight;
      }
      this.setData({
        orientation: borderConfig.orientation,
        boardWidth: width,
        boardHeight: height
      });

      /*监听draw发送的预加载列表和图像链接 */
      this.data.board.on("preload", (data) => {
        this.setData({
          currentPic: data.currentPic,
          imgLoadList: data.preloadList
        });
        console.log(data.preloadList);
      });

      this.data.board.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
        ImHandler.sendBoardMsg(data);
      });
    },

    // canvas
    bindCanvasTouchstart(event) {
      this.data.board.canvasTouchStart(event);
    },

    bindCanvasTouchmove(event) {
      this.data.board.canvasTouchMove(event);
    },

    bindCanvasTouchend(event) {
      this.data.board.canvasTouchEnd(event);
    },

    bindCanvasTouchcancel(event) {
      this.data.board.canvasTouchCancel(event);
    },

    /**
     * 图片加载完成
     * @param {*} ev 
     */
    imgOnLoad(ev) {
      let src = ev.currentTarget.dataset.src,
        width = ev.detail.width,
        height = ev.detail.height;

      // 获取图片原始宽高
      this.setData({
        naturalWidth: width,
        naturalHeight: height
      }, () => {
        this.updateImgStyle();
      });
    },

    // 图片加载失败
    imgOnLoadError(error) {},

    // orientation
    setOrientation(orientation = 'vertical') {
      this.setData({
        orientation: orientation
      });
      wx.createSelectorQuery().in(this).select('.tic-board-box').boundingClientRect((rect) => {
        var widthHeight;
        var wrapWidth = 0;
        var wrapHeight = 0;

        if (this.data.orientation === 'horizontal') { // 横屏
          widthHeight = this.calculateBoardSize(rect.height, rect.width);
          wrapWidth = widthHeight.height;
          wrapHeight = widthHeight.width;
        } else {
          widthHeight = this.calculateBoardSize(rect.width, rect.height);
          wrapWidth = widthHeight.width;
          wrapHeight = widthHeight.height;
        }

        this.setData({
          wrapWidth: wrapWidth,
          wrapHeight: wrapHeight,
          boardWidth: widthHeight.width,
          boardHeight: widthHeight.height
        }, () => {
          if (this.data.board) {
            this.data.board.resize(widthHeight.width, widthHeight.height);
            this.data.board.setOrientation(orientation);
            this.updateImgStyle();
          }
        });
      }).exec();
    },

    // 计算白板尺寸
    calculateBoardSize(containerWidth, containerHeight) {
      var width, height;
      var ratioWidth, ratioHeight;
      try {
        var ratios = this.data.ratio.split(':');
        ratioWidth = ratios[0] * 1;
        ratioWidth = isNaN(ratioWidth) ? 16 : ratioWidth;
        ratioHeight = ratios[1] * 1;
        ratioHeight = isNaN(ratioHeight) ? 9 : ratioHeight;
      } catch (error) {
        ratioWidth = 16;
        ratioHeight = 9;
      }

      if (containerWidth / containerHeight > ratioWidth / ratioHeight) {
        width = containerHeight * ratioWidth / ratioHeight;
        height = containerHeight;
      } else {
        width = containerWidth;
        height = containerWidth * ratioHeight / ratioWidth;
      }
      return {
        width,
        height
      }
    },


    addSyncData(data) {
      this.data.board.addSyncData(data);
    },

    // 设置当前背景图片
    setCurrentImg(currentPic, currentBoard) {
      this.setData({
        currentPic
      });
    },

    // 设置预加载图片
    setPreLoadImgList(preloadList) {
      this.setData({
        preloadList
      });
    },

    // 设置白板背景颜色
    setBoardBgColor(bgColor) {
      this.setData({
        bgColor
      });
    },

    // 更新图片样式
    updateImgStyle() {
      var style = [];
      if (this.data.orientation !== 'horizontal') { // 水平方向
        style = ['left: 50%', 'transform: translate(-50%, -50%) ', 'top: 50%'];
        if (this.data.boardWidth / this.data.boardHeight < this.data.naturalWidth / this.data.naturalHeight) {
          style.push('width:100%');
          style.push('height:' + (this.data.boardWidth / this.data.naturalWidth * this.data.naturalHeight) + 'px');
        } else {
          style.push('width:' + this.data.boardHeight / this.data.naturalHeight * this.data.naturalWidth + 'px');
          style.push('height:100%');
        }
      } else {
        if (this.data.boardWidth / this.data.boardHeight < this.data.naturalWidth / this.data.naturalHeight) {
          style.push('top: 0');
          style.push('width:' + this.data.boardWidth + 'px');
          var height = (this.data.boardWidth / this.data.naturalWidth * this.data.naturalHeight);
          style.push('height:' + height + 'px');
          style.push('left:' + (this.data.boardHeight + height) / 2 + 'px');
        } else {
          style.push('left: ' + this.data.boardHeight + 'px');
          var width = this.data.boardHeight / this.data.naturalHeight * this.data.naturalWidth;
          style.push('width:' + width + 'px');
          style.push('height:' + this.data.boardHeight + 'px');
          style.push('top:' + (this.data.boardWidth - width) / 2 + 'px');
        }
      }
      this.setData({
        imgStyle: style.join(';')
      });
    }
  }
})