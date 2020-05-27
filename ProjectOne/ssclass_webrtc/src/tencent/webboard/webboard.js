// 服务端: https://cloud.tencent.com/document/product/1137/40049
// 客户端：https://cloud.tencent.com/document/product/1137/40000
// 价格：https://cloud.tencent.com/document/product/1137/37902

import Constant from '@/constant/constant'
import Vue from 'vue'

class WebBoard {
  constructor() {
    this.board = null

    this.boardConfig = {
      id: 'webBoard',
      ratio: '16:9',
      drawEnable: true,
      textFamily: null,
      textStyle: 0,
      textSize: 480,
      textColor: '#ff0000',
      brushColor: '#ff0000',
      brushThin: 80,
      toolType: 0,
      dataSyncEnable: true,
      globalBackgroundColor: '#ffffff',
      boardFileFitMode: 0, // 
      scale: 100, // 
      smoothLevel: 0.1, // 平滑系数
      preloadDepth: 5 // 预加载深度
    }

    this.boardOption = null

    this.tmpName = null
    this.fileIdNameMap = null

    this.loadComplated = false
    this.showCommand = true

    this.canUndo = false
    this.canRedo = false

    this.courseFileList = []
    this.whiteBoardList = []

    this.currentFileId = null
    this.currentBoardID = null

    this.boardIndex = 1
    this.boardCount = 1
  }

  /**
   * 初始化
   */
  init() {
    // 已经初始化了
    if (this.board) {
      this.board.off()
      this.board = null
    }

    this.boardOption = window.store.getters.boardOption

    // 显示控制按钮
    this.showCommand = window.store.showCommand

    // 老师打开画笔
    if (window.store.state.userType === 0) {
      this.boardConfig.drawEnable = true
      this.boardConfig.toolType = 1
    } else {
      this.boardConfig.drawEnable = false
      this.boardConfig.toolType = 0
    }

    this.board = new TEduBoard(Object.assign({}, this.boardConfig, {
      classId: this.boardOption.liveID,
      sdkAppId: this.boardOption.sdkAppID,
      userId: this.boardOption.userID,
      userSig: this.boardOption.userSig,
    }))

    // 视频控制栏
    this.board.showVideoControl(this.boardConfig.drawEnable)

    // 处理事件
    this.handleEvent()
  }

  /**
   * 处理 事件
   */
  handleEvent() {
    // 白板错误回调
    this.board.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
      console.error('===============:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg)
    })

    // 白板警告回调
    this.board.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
      console.error('===============:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg)
    })

    // 撤销状态改变
    this.board.on(TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
      this.canUndo = enable ? 1 : 0
      // console.log('===============:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销')
    })

    // 重做状态改变
    this.board.on(TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
      this.canRedo = enable ? 1 : 0
      // console.log('===============:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复')
    })

    // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
    // TIC已经处理好了，可忽略该事件
    this.board.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
      // console.log('===============:  ', data)
      window.webim.sendGroupBoardMsg({
        liveId: this.boardOption.liveID + '',
        msgText: JSON.stringify(data),
        identifier: this.boardOption.userID
      })

      // 添加白板信息
      window.api.saveBoardMsg({
        roomID: this.boardOption.roomID,
        userID: this.boardOption.userID,
        message: JSON.stringify(data)
      }).then(res => {
        if (res.code != 0) {
          console.error('saveBoardMsg error!')
        }
      })
    })

    // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
    this.board.on(TEduBoard.EVENT.TEB_INIT, () => {
      //console.log('===============:  ', 'TEB_INIT')
      //this.showMessageInBox('TIC', "onTEBInit finished")
    })

    // 登录的时候课件载入
    this.board.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
      // console.log('===============:  ', 'TEB_HISTROYDATA_SYNCCOMPLETED')
      this.loadHistoryData()
    })

    // 图片状态加载回调
    this.board.on(TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
      // console.log('===============:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data)
    })

    // 上传背景图片的回调
    this.board.on(TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
      // console.log('===============:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData)
    })

    // 新增白板
    this.board.on(TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
      // console.log('===============:  ', 'TEB_ADDBOARD', ' boardIds:', boardIds, ' fid:', fid)
      // 必须初始化完成，否则多次加载
      if (this.loadComplated && fid === Constant.WebBoard.WhiteBoardId) {
        if (boardIds && boardIds.length > 0) {
          this.addFileIdNameMap(boardIds[0])
        }
        this.loadWhiteBoardList()
      } else {
        this.loadCourseList()
      }
    })

    // 删除白板页回调
    this.board.on(TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
      // console.log('===============:  ', 'TEB_DELETEBOARD', ' boardIds:', boardIds, ' fid:', fid)
      if (fid === Constant.WebBoard.WhiteBoardId) {
        if (boardIds && boardIds.length > 0) {
          this.deleteFileIdNameMap(boardIds[0])
        }
        this.loadWhiteBoardList()
      }
    })

    // 跳转白板页回调
    this.board.on(TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
      // console.log('===============:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid)
      // 白板的情况下，是切换
      if (fid === Constant.WebBoard.WhiteBoardId) {
        window.store.commit('setCurrentBoardID', boardId)
      }
      // 获得当前页码
      this.getPageNumber()
    })

    // 增加文件回调
    this.board.on(TEduBoard.EVENT.TEB_ADDFILE, (fid) => {
      // console.log('===============:  ', 'TEB_ADDFILE', ' fid:', fid)
      // 必须初始化完成，否则多次加载课件列表
      if (this.loadComplated && fid != Constant.WebBoard.WhiteBoardId) {
        this.addFileIdNameMap(fid)
        this.loadCourseList()
      }
    })

    // 增加H5动画PPT文件回调
    this.board.on(TEduBoard.EVENT.TEB_ADDH5PPTFILE, (fid) => {
      // console.log('===============:  ', 'TEB_ADDH5PPTFILE', ' fid:', fid)
      // 必须初始化完成，否则多次加载课件列表
      if (this.loadComplated && fid != Constant.WebBoard.WhiteBoardId) {
        this.addFileIdNameMap(fid)
        this.loadCourseList()
      }
    })

    // 增加转码文件回调
    this.board.on(TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, (fid) => {
      // console.log('===============:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid)
      // 必须初始化完成，否则多次加载课件列表
      if (this.loadComplated && fid != Constant.WebBoard.WhiteBoardId) {
        this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_MOUSE)
        this.addFileIdNameMap(fid)
        this.loadCourseList()
      }
    })

    // 删除文件回调
    this.board.on(TEduBoard.EVENT.TEB_DELETEFILE, (fid) => {
      // console.log('===============:  ', 'TEB_DELETEFILE', ' fid:', fid)
      if (fid != Constant.WebBoard.WhiteBoardId) {
        this.deleteFileIdNameMap(fid)
        this.loadCourseList()
      }
    })

    // 文件上传状态
    this.board.on(TEduBoard.EVENT.TEB_FILEUPLOADSTATUS, (status, data) => {
      //console.log('===============:  ', 'TEB_FILEUPLOADSTATUS', status, data)
      // if (status == 1) {
      //   this.showTip('上传成功')
      // } else {
      //   this.showTip('上传失败')
      // }
    })

    // 切换文件回调
    this.board.on(TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
      // console.log('===============:  ', 'TEB_SWITCHFILE', ' fid:', fid)
      // 当前文件
      this.loadCurrentFileID()
      // 获得当前页码
      this.getPageNumber()
    })

    // 文件上传进度
    this.board.on(TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, (data) => {
      //console.log('===============:  ', 'TEB_FILEUPLOADPROGRESS:: ', data)
      this.showTip('上传进度:' + parseInt(data.percent * 100) + '%')
    })

    // H5背景加载状态
    this.board.on(TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      // console.log('===============:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data)
    })
  }

  /**
   * 载入历史数据
   */
  loadHistoryData() {
    // 白板名字列表
    if (window.store.state.roomInfo.boardInfo) {
      this.fileIdNameMap = JSON.parse(window.store.state.roomInfo.boardInfo)
    }

    // 获得课件
    this.loadCourseList()
    // 获得白板
    this.loadWhiteBoardList()
    // 获得当前文件
    this.loadCurrentFileID()
    // 获得当前白板
    this.loadCurrentBoardID()
    // 获得当前页码
    this.getPageNumber()

    // 初始化完成
    this.loadComplated = true
  }

  /**
   * 载入课件
   */
  loadCourseList() {
    // 载入课件列表
    this.courseFileList = []
    var fileInfoList = this.board.getFileInfoList()
    fileInfoList.forEach(fileInfo => {
      // 添加课件
      if (fileInfo.fid != Constant.WebBoard.WhiteBoardId) {
        // 获得缩略图
        var thumbnailList = []
        var boardList = this.board.getFileBoardList(fileInfo.fid)
        var thumbnailImages = this.board.getThumbnailImages(fileInfo.fid)
        if (boardList && thumbnailImages) {
          for (let n = 0; n < boardList.length; n++) {
            var thumbnailImage = thumbnailImages[n]
            if (thumbnailImage) {
              thumbnailList.push({
                boardId: boardList[n],
                imageUrl: thumbnailImage
              })
            }
          }
        }

        var title = fileInfo.title
        if (title === fileInfo.fid) {
          title = this.findNameById(title)
        }

        // 课件
        this.courseFileList.push({
          fid: fileInfo.fid,
          title: title,
          thumbnailList: thumbnailList
        })
      }
    })

    // 课件信息
    window.store.commit('setCourseFileList', this.courseFileList)
  }

  /**
   * 载入白板列表
   * 3个地方用到，历史消息；添加白板；删除白板
   */
  loadWhiteBoardList() {
    this.whiteBoardList = []
    var boardList = this.board.getFileBoardList(Constant.WebBoard.WhiteBoardId)
    for (let n = 0; n < boardList.length; n++) {
      var title = ''
      if (boardList[n] === Constant.WebBoard.WhiteBoardId) {
        title = window.i18n.t('whiteboard.defalutWhiteBoard')
      } else {
        title = this.findNameById(boardList[n])
        if (!title) {
          title = window.i18n.t('whiteboard.whiteBoard') + (n + 1)
        }
      }

      this.whiteBoardList.push({
        bid: boardList[n],
        title: title
      })
    }

    // 白板信息
    window.store.commit('setWhiteBoardList', this.whiteBoardList)
  }

  /**
   * 当前文件
   */
  loadCurrentFileID() {
    this.currentFileID = this.board.getCurrentFile()
    window.store.commit('setCurrentFileID', this.currentFileID)
  }

  /**
   * 当前白板也
   */
  loadCurrentBoardID() {
    this.currentBoardID = this.board.getCurrentBoard()
    window.store.commit('setCurrentBoardID', this.currentBoardID)
  }

  /**
   * 设置页面信息
   */
  getPageNumber() {
    var currentFileInfo = this.board.getFileInfo(this.currentFileID)
    if (currentFileInfo != null) {
      this.boardIndex = currentFileInfo.currentPageIndex + 1
      this.boardCount = currentFileInfo.pageCount
    } else {
      this.boardIndex = 1
      this.boardCount = 1
    }

    window.store.commit('setBoardPageIndex', this.boardIndex)
    window.store.commit('setBoardPageCount', this.boardCount)
  }

  /**
   * 查找文件id
   * 
   * @param {*} name 
   */
  findFileID(name) {
    var fileId = null
    this.courseFileList.some(fileInfo => {
      if (fileInfo.title === name) {
        fileId = fileInfo.fid
        return true
      }
    })

    return fileId
  }

  /**
   * 查找board id
   * 
   * @param {*} name 
   */
  findBoardID(name) {
    var boardId = null
    this.whiteBoardList.some(boardInfo => {
      if (boardInfo.title === name) {
        boardId = boardInfo.bid
        return true
      }
    })

    return boardId
  }

  /**
   * 保存id，名字对照列表
   * 
   * @param {*} name 
   * @param {*} id 
   */
  addFileIdNameMap(id) {
    if (!this.tmpName) {
      return
    }

    if (!this.fileIdNameMap) {
      this.fileIdNameMap = []
    }

    this.fileIdNameMap.push({
      id: id,
      name: this.tmpName
    })

    this.tmpName = null

    this.saveFileIdNameMap()
  }

  /**
   * 删除id，名字对照列表
   * @param {*} id 
   */
  deleteFileIdNameMap(id) {
    if (!this.fileIdNameMap) {
      return
    }

    var newFileIdNameMap = []
    this.fileIdNameMap.forEach(fileInfo => {
      if (fileInfo.id != id) {
        newFileIdNameMap.push({
          id: fileInfo.id,
          name: fileInfo.name
        })
      }
    })

    this.fileIdNameMap = newFileIdNameMap

    this.saveFileIdNameMap()
  }

  /**
   * 保存白板信息
   */
  saveFileIdNameMap() {
    if (this.showCommand) {
      console.error('saveFileIdNameMap', this.showCommand)
      window.api.saveBoardInfo({
        roomID: window.store.state.roomID,
        boardInfo: JSON.stringify(this.fileIdNameMap)
      }).then(res => {
        if (res.code != 0) {
          console.error('Save BoardInfo error')
        }
      })
    }
  }

  /**
   * 获得名字
   * 
   * @param {*} id 
   */
  findNameById(id) {
    var name = id
    if (this.fileIdNameMap) {
      console.error('this.fileIdNameMap', this.fileIdNameMap)
      this.fileIdNameMap.some(fileInfo => {
        if (fileInfo.id === id) {
          name = fileInfo.name
          return true
        }
      })
    }

    return name
  }

  /**
   * 添加数据
   */
  addSyncData(data) {
    this.board && this.board.addSyncData(JSON.parse(data))
  }

  /**
   * 执行命令
   */
  oprate(command) {
    if (!this.board) {
      return
    }

    if (command === 'mouse') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_MOUSE)
    } else if (command === 'laser') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LASER)
    } else if (command === 'pen') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_PEN)
    } else if (command === 'text') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT)
    } else if (command === 'textSize1') {
      this.board.setTextSize(320)
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT)
    } else if (command === 'textSize2') {
      this.board.setTextSize(480)
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT)
    } else if (command === 'textSize3') {
      this.board.setTextSize(640)
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT)
    } else if (command === 'textSize4') {
      this.board.setTextSize(800)
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT)
    } else if (command === 'rect') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_RECT)
    } else if (command === 'rectSolid') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_RECT_SOLID)
    } else if (command === 'oval') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_OVAL)
    } else if (command === 'ovalSolid') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_OVAL_SOLID)
    } else if (command === 'eraser') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_ERASER)
    } else if (command === 'undo') {
      this.board.undo()
    } else if (command === 'redo') {
      this.board.redo()
    } else if (command === 'zoomIn') {
      var scale = this.board.getBoardScale() + 20
      this.board.setBoardScale(scale)
    } else if (command === 'zoomOut') {
      var scale = this.board.getBoardScale() - 20
      this.board.setBoardScale(scale)
    } else if (command === 'zoomDrag') {
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG)
    } else if (command === 'original') {
      this.board.setBoardScale(100)
      this.board.setToolType(TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_PEN)
    } else if (command === 'red') {
      this.board.setTextColor(0xff0000FF)
      this.board.setBrushColor(0xff0000FF)
    } else if (command === 'yellow') {
      this.board.setTextColor(0xff9903FF)
      this.board.setBrushColor(0xff9903FF)
    } else if (command === 'green') {
      this.board.setTextColor(0x008000FF)
      this.board.setBrushColor(0x008000FF)
    } else if (command === 'blue') {
      this.board.setTextColor(0x0000ffFF)
      this.board.setBrushColor(0x0000ffFF)
    } else if (command === 'purple') {
      this.board.setTextColor(0x800080FF)
      this.board.setBrushColor(0x800080FF)
    } else if (command === 'black') {
      this.board.setTextColor(0x0FF)
      this.board.setBrushColor(0x0FF)
    } else if (command === 'previous') {
      if (this.currentFileId === Constant.WebBoard.WhiteBoardId ||
        this.boardIndex <= 1) {
        return
      }

      this.boardIndex -= 1
      this.board.prevBoard()

      window.store.commit('setBoardPageIndex', this.boardIndex)
    } else if (command === 'next') {
      if (this.currentFileId === Constant.WebBoard.WhiteBoardId ||
        this.boardIndex >= this.boardCount) {
        return
      }

      this.boardIndex += 1
      this.board.nextBoard()

      window.store.commit('setBoardPageIndex', this.boardIndex)
    } else if (command === 'clearAll') {
      this.board.clear()
    }
  }

  /**
   * 设置白板是否允许涂鸦
   * @param {*} enable 
   */
  setDrawEnable(enable) {
    this.board && this.board.setDrawEnable(enable)
  }

  /**
   * 获取白板是否允许涂鸦
   */
  isDrawEnable() {
    if (!this.board) {
      return false
    }

    return this.board.isDrawEnable()
  }

  /**
   * 打开图片文件
   * @param imageUrl
   */
  openImageUrl(imageUrl, name) {
    if (!this.board) {
      return
    }

    // 有了这个白板
    var boardId = this.findBoardID(name)
    if (boardId) {
      this.board.switchFile(Constant.WebBoard.WhiteBoardId)
      this.board.gotoBoard(boardId)
      return
    }

    this.tmpName = name

    this.board.switchFile(Constant.WebBoard.WhiteBoardId)
    this.board.addBoard()
    this.board.setBackgroundImage(imageUrl)
  }

  /**
   * 打开转换图片
   * @param 
   */
  openTranscodeFile(transcodeJson, name) {
    if (!this.board) {
      return
    }

    // 有了这个文件
    var fileId = this.findFileID(name)
    if (fileId) {
      this.board.switchFile(fileId)
      return
    }

    this.tmpName = name

    var jsonObj = JSON.parse(transcodeJson)
    this.board.addTranscodeFile(jsonObj)
  }

  /**
   * 添加 H5 页面
   * @param url 【必填】网页地址, 只支持展示，不支持互动
   * https://cloud.tencent.com/document/product/1137/40000#addh5file
   */
  openH5File(url, name) {
    this.tmpName = name

    this.board.addH5File(url)
  }

  /**
   * 添加视频文件
   * @param {*} url
   * @param {*} name
   */
  openVideoFile(url, name) {
    // 有了这个文件
    var fileId = this.findFileID(name)
    if (fileId) {
      this.board.switchFile(fileId)
      return
    }

    // 添加
    this.tmpName = name

    this.board.addVideoFile(url)
  }

  /**
   * 切换文件
   * @param fileId 要切换到的文件ID
   */
  switchFile(fileId) {
    if (!this.board) {
      return
    }

    if (fileId) {
      if (window.utils.right(fileId, 8) === Constant.WebBoard.WhiteBoardId) {
        this.board.switchFile(Constant.WebBoard.WhiteBoardId)
        this.board.gotoBoard(fileId)
      } else {
        this.board.switchFile(fileId)
      }
    }
  }

  /**
   * 要删除的文件 ID
   * @param fileId (可选)要切换到的文件ID
   */
  deleteFile(fileId) {
    if (fileId) {
      this.board && this.board.deleteFile(fileId)
    }
  }

  /**
   * 增加一页白板
   * 白板页会被添加到默认文件（文件 ID 为::DEFAULT)，自行上传的文件无法添加白板页
   */
  addBoard() {
    if (!this.board) {
      return
    }

    this.board.switchFile(Constant.WebBoard.WhiteBoardId)
    this.board.addBoard()
  }

  /**
   * 删除一页白板
   * 只允许删除默认文件（文件 ID 为::DEFAULT）内的白板页，且默认白板页（白板 ID 为::DEFAULT）无法删除
   * @param boardId 【可选】要删除的白板 ID，为 null 表示删除当前页
   */
  deleteBoard(boardId) {
    if (boardId === Constant.WebBoard.WhiteBoardId) {
      window.message.notify(new Vue(), 'info', window.i18n.t('whiteboard.keepDefaultBoard'))
    } else {
      this.board.deleteBoard(boardId)
    }
  }

  /**
   * 跳转到指定白板页
   * @param boardId 切换文件并跳转到这个白板页
   */
  gotoBoard(boardId) {
    this.board && this.board.gotoBoard(boardId)
  }

  /**
   * 退出
   */
  quit() {
    this.board && this.board.off()
    this.board = null
  }

  /**
   * 清空课堂数据
   */
  clearAll() {
    this.board && this.board.reset()
  }

  /**
   * 清空课堂数据
   */
  resize() {
    this.board && this.board.resize()
  }
}

const webboard = new WebBoard()
export default webboard