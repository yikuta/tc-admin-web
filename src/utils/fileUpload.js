/*
* 上传文件，参数参考 defaultOptions
* upload(file, [options])
* */

import { Notification, Message, Loading } from 'element-ui'
import { uploadFileToOSS, getFileUrl } from '@/api/uploadFile'
class FileUpload {
  constructor() {
    this.name = 'FileUpload'
    this.defaultFileConfig = { // 允许的类型
      image: {
        desc: '图片',
        accept: 'jpeg|jpg|png|gif'
      },
      video: {
        desc: '视频',
        accept: 'mp4' // mp4|avi|mkv|mov|3gp|wmv|mpg|vob|flv
      },
      audio: {
        desc: '音频',
        accept: 'mp3|wav'
      },
      file: {
        desc: '文件',
        accept: 'xlsx|xltx|xlsm|xls|csv|pdf|docx|dotx|dotm|docm|doc|sheet'
      }
    }
    this.defaultOptions = { // 默认的配置信息
      type: 'image', // 上传文件的类型
      max: 3, // 允许最大内存，单位 M // 为 0 不验证
      accept: 'jpeg|jpg|png|gif', // 允许文件类型
      img: { // 0 不验证
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0,
        minHeight: 0
      },
      validate: ['type', 'size', 'wh'], // 需要验证的类型 类型 大小 宽高
      success: null, // 成功回调
      fail: null, // 失败回调
      complete: null // 调用完成
    }
    this.loading = null // 加载装填
  }
  _getOptions() {
    // 合并配置信息
  }
  _validate(file) {
    // 验证文件信息
    if (this.defaultOptions.validate.includes('type')) {
      // 是否需要验证文件类型
      if (!this._validateType(file)) return
    }
    if (this.defaultOptions.validate.includes('size')) {
      // 是否需要验证文件类型
      if (!this._validateSize(file)) return
    }
    if (this.defaultOptions.validate.includes('wh')) {
      // 是否需要验证文件类型
      if (!this._validateWidthAndHeight(file)) return
    }
    return true
  }
  _validateType(file) {
    // 验证文件类型
    const { accept, desc } = this.defaultFileConfig[this.defaultOptions.type]
    const regexp = new RegExp(`.(${this.defaultOptions.accept || accept})$`)
    if (!regexp.test(file.name.toLowerCase())) {
      Message.error(`只允许上传${this.defaultOptions.accept || accept}格式的${desc}`)
      return false
    }
    return true
  }
  _validateSize(file) {
    // 验证文件大小
    const { desc } = this.defaultFileConfig[this.defaultOptions.type]
    if (this.defaultOptions.max !== 0 && file.size / 1024 / 1024 > this.defaultOptions.max) {
      Message.error(`上传${desc}大小不能超过${this.defaultOptions.max}MB`)
      return false
    }
    return true
  }
  _validateWidthAndHeight(file) {
    // 验证图片的长宽
    const fileInfo = this._getImageBaseInfo(file, 'file')
    if (this.defaultOptions.img.maxWidth && this.defaultOptions.img.maxheight) {
      if (fileInfo.width > this.defaultOptions.img.maxWidth || fileInfo.height > this.defaultOptions.img.maxHeight) {
        Message.error(`上传图片尺寸不能高于${this.defaultOptions.img.maxWidth}*${this.defaultOptions.img.maxHeight}`)
        return false
      }
    }
    if (this.defaultOptions.img.minWidth && this.defaultOptions.img.minHeight) {
      if (fileInfo.width > this.defaultOptions.img.maxWidth || fileInfo.height > this.defaultOptions.img.maxHeight) {
        Message.error(`上传图片尺寸不能低于${this.defaultOptions.img.minWidth}*${this.defaultOptions.img.minHeight}`)
        return false
      }
    }
    return true
  }
  _createFormData(file) {
    // 创建表单信息
    const formData = new FormData()
    const fileType = file.type.split('/')[1]
    const fileName = file.name.split('.')[0]
    formData.append('file', file)
    formData.append('filePath', this.defaultOptions.type)
    formData.append('fileType', fileType)
    formData.append('fileName', fileName)
    return formData
  }
  _getImageBaseInfo(file, type = 'url') {
    /*
    * 获取文件的基本信息，宽、高
    * file 文件
    * type 获取文件的类型 url 代表网址，file 代表文件
    * */
    if (type === 'url') {
      let newFile = {}
      const img = new Image()
      img.src = file.fileUrl
      img.onload = () => {
        newFile = {
          ...file,
          width: img.width,
          height: img.height
        }
      }
      return newFile
    } else {
      let reader = new FileReader()
      let newFile = {}
      reader.readAsDataURL(file)
      reader.onload = function(res) {
        let image = new Image()
        image.src = res.target.result
        image.onload = function() {
          newFile = {
            file,
            width: this.width,
            height: this.height
          }
        }
      }
      return newFile
    }
  }
  _awaitFileInfo(key) {
    // 上传文件太大需要等待后台处理完成后才能继续进行处理
    getFileUrl(key).then(res => {
      if (!res.result.needWait) {
        if (this.defaultOptions.type === 'image') {
          this.defaultOptions.success && this.defaultOptions.success(this._getImageBaseInfo(res.result))
        } else {
          this.defaultOptions.success && this.defaultOptions.success(res.result)
        }
      } else {
        // 继续调用自身
        this._awaitFileInfo(key)
      }
    }).catch(e => {
      Notification({
        type: 'error',
        title: '上传失败'
      })
      this.loading.close()
      this.defaultOptions.fail && this.defaultOptions.fail(e)
    })
  }
  upload(file, options) {
    // 上传方法
    // 如果有配置信息就合并
    Object.keys(options).length && Object.assign(this.defaultOptions, options)
    // 验证文件
    if (!this._validate(file)) return
    // 组装表单
    const formData = this._createFormData(file)
    // 接口调用
    this.loading = Loading.service({
      lock: true,
      text: `${this.defaultFileConfig[this.defaultOptions.type].desc}上传中...`,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    uploadFileToOSS(formData).then(res => {
      if (res.code === 200) {
        if (res.result.needWait) {
          // 文件太大需要等待
          this._awaitFileInfo(res.result.asynKeyStr)
        } else {
          // 成功后直接调用成功
          try {
            Notification({
              type: 'success',
              title: '上传成功'
            })
            this.loading.close()
            this.defaultOptions.success && this.defaultOptions.success(res.result)
          } catch (e) {
            throw Error(e)
          }
        }
      }
    }).catch(e => {
      // 失败后调用回调
      Notification({
        type: 'error',
        title: '上传失败'
      })
      this.loading.close()
      this.defaultOptions.fail && this.defaultOptions.fail(e)
    })
  }
}

export default FileUpload
