<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="120px" size="mini">
      <el-form-item label="所属广告位">{{`${source}-${spaceName}`}}</el-form-item>
      <el-form-item label="广告名称" required prop="advertName">
        <el-input v-model="form.advertName" :maxlength="50" clearable />
      </el-form-item>
      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker v-model="form.startDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" @change="(time)=>onChangeTime(time,'start')" :picker-options="{disabledDate:disabledTime,selectableRange:selectableStartTimeRange}"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间" prop="endDate">
        <el-date-picker v-model="form.endDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" @change="(time)=>onChangeTime(time,'end')" :picker-options="{disabledDate:disabledTime,selectableRange:selectableEndTimeRange}" :disabled="form.isForever"></el-date-picker>
        <el-checkbox :style="{marginLeft:'10px'}" v-model="form.isForever">永久不到期</el-checkbox>
      </el-form-item>
      <el-form-item label="广告图片" v-if="type==='img'" prop="imgList">
        <upload-file ref="up" type="IMAGE" :limit="1" :maxSize="10" :fileList="form.imgList" />
      </el-form-item>
      <el-form-item label="广告文字" v-else prop="text">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="form.text" :maxlength="50" />
      </el-form-item>
      <el-form-item label="跳转类型" prop="linkType">
        <el-select v-model="form.linkType" placeholder="请选择">
          <el-option v-for="item in linkOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APPID" v-if="isShowAppId" prop="appId">
        <el-input v-model="form.appId" :maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="广告链接" prop="linkUrl">
        <el-input v-model="form.linkUrl" :maxlength="200" clearable />
      </el-form-item>
      <div :style="{marginLeft:'120px'}">
        <el-button type="primary" size="mini" @click="handleSave">提交</el-button>
        <el-button type="plain" size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { LINK_TYPE } from '../constants'
import { reqAdvertisingById, reqPublishAdvertising, reqUpdateAdvertising, reqAdvertisingInfoById } from '@/api/advertising'

export default {
  name: 'advertisingForm',
  components: {
    UploadFile: resolve => require(['@/components/UploadFile/index'], resolve)
  },
  mounted() {
    const { type, id, spaceId } = this.$route.query
    this.type = type
    this.id = id
    if (this.id) this._reqAdvertisingById()
    this._reqAdvertisingInfoById(spaceId)
  },
  data() {
    return {
      id: 0,
      curAdvertising: {}, // 当前广告
      type: '', // img-上传图片 text-广告文字
      curSpace: {}, // 当前广告位
      spaceName: '', // 广告位名称
      source: '', // 所属终端
      form: {
        advertName: '', // 广告名称
        startDate: '', // 开始时间
        endDate: '', // 到期时间
        isForever: false, // 是否永久
        imgList: [], // 图片
        linkType: '', // 跳转类型
        appId: '', // APPID
        linkUrl: '', // 广告链接
        text: '' // 广告文字
      },
      rules: {
        advertName: [
          { validator: this.validateName, trigger: 'change' },
          { validator: this.validateName, trigger: 'blur' }
        ],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endDate: [{ required: true, validator: this.validateEndTime, trigger: 'change' }],
        imgList: [{ required: true, validator: this.validateImage, trigger: 'change' }],
        linkType: [{ required: true, message: '请选择跳转类型', trigger: 'change' }],
        appId: [{ required: true, validator: this.validateAppId, trigger: 'blur' }],
        linkUrl: [{ validator: this.validateLink, trigger: 'blur' }],
        text: [{ required: true, message: '请输入广告文字', trigger: 'blur' }]
      },
      linkOptions: [
        { key: 'H5页面', value: LINK_TYPE.H5 },
        { key: '小程序', value: LINK_TYPE.MP },
        { key: '小程序页面', value: LINK_TYPE.MP_PAGE }
      ]
    }
  },
  watch: {
    'form.imgList': {
      handler: function() {
        this.$refs['form'].validateField('imgList')
      },
      deep: true
    }
  },
  computed: {
    isShowAppId() {
      return this.form.linkType === LINK_TYPE.MP
    },
    selectableStartTimeRange() {
      return this.timeRange(this.form.startDate)
    },
    selectableEndTimeRange() {
      return this.timeRange(this.form.endDate)
    }
  },
  methods: {
    /**
     * @description: 修正时间
     */
    onChangeTime(time, target) {
      if (time) {
        let selected = new Date(time)
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let second = date.getSeconds()
        second = second < 0 ? '00' : second < 10 ? '0' + second : second
        if (selected.getTime() - date.getTime() < 0) {
          const value = `${year}-${month}-${day} ${hour}:${min}:${second}`
          target === 'start' ? (this.form.startDate = value) : (this.form.endDate = value)
        }
      }
    },
    /**
     * @description: 日期选择范围
     */
    disabledTime(time) {
      let date = new Date()
      if (date.getTime() - time.getTime() < 24 * 60 * 60 * 1000) {
        return false
      }
      return true
    },
    /**
     * @description: 时刻选择范围
     */
    timeRange(time) {
      let date = new Date()
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      if (time) {
        let startDate = new Date(time)
        if (date.getDate() === startDate.getDate() && date.getMonth() === startDate.getMonth() && date.getFullYear() === startDate.getFullYear()) {
          return `${hour}:${min}:00 - 23:59:59`
        }
        return '00:00:00 - 23:59:59'
      }
      return `${hour}:${min}:00 - 23:59:59`
    },
    /**
     * @description: 取消
     */
    handleCancel() {
      this.$router.go(-1)
    },
    /**
     * @description: 保存
     */
    handleSave() {
      if (this.form.endDate && this.form.startDate && !this.form.isForever) {
        let startDate = new Date(this.form.startDate)
        let endDate = new Date(this.form.endDate)
        if (startDate.getTime() - endDate.getTime() > 0) {
          this.$message.info('到期时间不能小于开始时间')
          return
        }
      }
      this.$refs['form']
        .validate()
        .then(() => {
          console.log('通过校验') // eslint-disable-line
          const req = JSON.parse(JSON.stringify(this.form))
          if (req.isForever) {
            req.endDate = '4001-01-01 08:00:00'
          }
          if (this.type === 'text') {
            req.advertContent = req.text
          } else {
            req.advertContent = (req.imgList[0] || {}).filePath
          }
          if (this.id) {
            this._reqUpdateAdvertising({ ...this.curAdvertising, ...req, positionType: this.curSpace.positionType })
          } else {
            this._reqPublishAdvertising(req)
          }
        })
        .catch(() => {
          console.log('未通过校验') // eslint-disable-line
        })
    },
    /**
     * @description: 校验广告名称
     */
    validateName(rule, name, callback) {
      if (!name) {
        callback('请输入2-50位字符的广告名称')
      } else if (name.length >= 2 && name.length <= 50) {
        callback()
      } else {
        callback('请输入2-50位字符的广告名称')
      }
    },
    /**
     * @description: 校验广告图片
     */
    validateImage(rule, imgList, callback) {
      if (!imgList.length) {
        callback('请上传广告图片')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验appid
     */
    validateAppId(rule, appId, callback) {
      if (!appId) {
        callback('请输入2-20位字符的APPID')
      } else if (appId.length >= 2 && appId.length <= 20) {
        callback()
      } else {
        callback('请输入2-20位字符的APPID')
      }
    },
    /**
     * @description: 校验广告链接
     */
    validateLink(rule, link, callback) {
      if (!link) {
        callback()
      } else if (link.length >= 1 && link.length <= 200) {
        callback()
      } else {
        callback('请输入1-200位字符的广告链接')
      }
    },
    /**
     * @description: 校验过期时间
     */
    validateEndTime(rule, endTime, callback) {
      if (this.form.isForever) callback()
      if (!endTime) {
        callback('请选择过期时间')
      } else {
        callback()
      }
    },
    /**
     * @description: 根据id查询广告详情
     */
    _reqAdvertisingById() {
      return reqAdvertisingById({ id: this.id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.form.advertName = result.advertName
            this.form.startDate = result.startDate
            this.form.endDate = result.endDate
            if (this.form.endDate === '4001-01-01 08:00:00') {
              this.form.endDate = ''
              this.form.isForever = true
            }
            this.form.imgList = [{ fileUrl: result.advertContentFullPath, filePath: result.advertContent }]
            this.form.linkType = result.linkType
            this.form.appId = result.appId
            this.form.linkUrl = result.linkUrl
            this.form.text = result.advertContent
            this.curAdvertising = result
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 发布广告
     */
    _reqPublishAdvertising(data) {
      return reqPublishAdvertising({
        ...data,
        advertDetailStatus: 'DETAIL_STATUS_ON',
        positionCode: this.curSpace.positionCode,
        positionType: this.curSpace.positionType
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('添加广告成功')
            this.$router.go(-1)
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 更新广告
     */
    _reqUpdateAdvertising(data) {
      return reqUpdateAdvertising(data)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('更新广告成功')
            this.$router.go(-1)
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 查询广告位详情
     */
    _reqAdvertisingInfoById(id) {
      return reqAdvertisingInfoById({ positionId: id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.spaceName = result.positionName || ''
            this.source = result.positionTerminalDesc || ''
            this.curSpace = result
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
