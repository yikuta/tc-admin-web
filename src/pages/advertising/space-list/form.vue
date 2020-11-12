<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="120px" size="mini">
      <el-form-item label="广告位编码" prop="positionCode">
        <el-input v-model="form.positionCode" clearable />
      </el-form-item>
      <el-form-item label="广告位名称" required prop="positionName">
        <el-input v-model="form.positionName" :maxlength="30" clearable />
      </el-form-item>
      <el-form-item label="所属终端" prop="positionTerminal">
        <el-select v-model="form.positionTerminal" placeholder="请选择">
          <el-option v-for="item in terminalOptions" :key="item.value" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位类型" prop="positionType">
        <el-select v-model="form.positionType" placeholder="请选择" @change="onChangeType">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isBanner" label="轮播图片张数" prop="totalQuantity">
        <el-input-number v-model="form.totalQuantity" :precision="0" controls-position="right" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item v-if="isBanner || isOpen || isPop || isImage || isFloat" label="图片宽度" prop="advWidth">
        <el-input v-model="form.advWidth" placeholder="以像素为单位" clearable />
      </el-form-item>
      <el-form-item v-if="isBanner || isOpen || isPop || isImage || isFloat" label="图片高度" prop="advHeight">
        <el-input v-model="form.advHeight" placeholder="以像素为单位" clearable />
      </el-form-item>
      <el-form-item v-if="isPop" label="弹屏图片张数" prop="totalQuantity">
        <el-input-number v-model="form.totalQuantity" :precision="0" controls-position="right" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item v-if="isText" label="文字条数" prop="textNum">
        <el-input-number v-model="form.textNum" :precision="0" controls-position="right" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item v-if="isBanner || isImage || isText || isFloat" label="无广告时占位">
        <el-switch v-model="form.advOccupy" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item v-if="isOpen || isPop" label="是否自动关闭">
        <el-switch v-model="form.autoClose" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item v-if="form.autoClose && (isOpen || isPop)" required label="自动关闭时间" prop="closeTime">
        <el-input v-model="form.closeTime" placeholder="以秒为单位" clearable />
      </el-form-item>
      <div :style="{marginLeft:'120px'}">
        <el-button type="primary" size="mini" @click="handleSave">确定</el-button>
        <el-button type="plain" size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { AD_TYPE, TERMINAL } from '../constants'
// import { mapState } from 'vuex'
import { reqAdvertisingSpaceInit, reqAddAdvertisingSpace, reqUpdateAdvertisingSpace, reqAdvertisingInfoById } from '@/api/advertising'

export default {
  name: 'advertisingSpaceForm',
  mounted() {
    const { id } = this.$route.query
    this.id = id
    if (this.id) {
      this._reqAdvertisingInfoById(this.id)
    }
    this._reqAdvertisingSpaceInit()
  },
  watch: {
    'form.autoClose': {
      handler(newVal) {
        if (!newVal) this.form.closeTime = ''
      }
    }
  },
  computed: {
    // ...mapState(['user']),
    isBanner() {
      return this.form.positionType === AD_TYPE.BANNER
    },
    isOpen() {
      return this.form.positionType === AD_TYPE.OPEN
    },
    isPop() {
      return this.form.positionType === AD_TYPE.POP_UP
    },
    isImage() {
      return this.form.positionType === AD_TYPE.IMAGE
    },
    isText() {
      return this.form.positionType === AD_TYPE.TEXT
    },
    isFloat() {
      return this.form.positionType === AD_TYPE.FLOAT
    }
  },
  data() {
    return {
      id: 0,
      form: {
        positionCode: '', // 广告位编码
        positionName: '', // 广告位名称
        positionTerminal: TERMINAL.LIFE_APP, // 所属终端
        positionType: AD_TYPE.OPEN, // 广告位类型
        totalQuantity: '', // 轮播图片张数, 弹屏图片张数
        advWidth: '', // 图片宽度
        advHeight: '', // 图片高度
        advOccupy: true, // 无广告时占位
        autoClose: true, // 是否自动关闭
        closeTime: 5, // 自动关闭时间
        textNum: 1 // 文字条数
      },
      rules: {
        positionCode: [{ required: true, message: '请输入广告位编码', trigger: 'blur' }],
        positionName: [
          { validator: this.validateName, trigger: 'change' },
          { validator: this.validateName, trigger: 'blur' }
        ],
        positionTerminal: [{ required: true, message: '请选择所属终端', trigger: 'blur' }],
        positionType: [{ required: true, message: '请选择广告位类型', trigger: 'blur' }],
        totalQuantity: [{ required: true, message: '请输入图片张数', trigger: 'blur' }],
        advWidth: [{ validator: this.validateWidth, trigger: 'blur' }],
        advHeight: [{ validator: this.validateWidth, trigger: 'blur' }],
        closeTime: [
          { validator: this.validateCloseTime, trigger: 'blur' },
          { validator: this.validateCloseTime, trigger: 'change' }
        ],
        textNum: [{ required: true, message: '请输入文字条数', trigger: 'blur' }]
      },
      terminalOptions: [],
      typeOptions: []
    }
  },
  methods: {
    /**
     * @description: 取消
     */
    handleCancel() {
      this.$router.push({ name: 'spaceList' })
    },
    /**
     * @description: 保存
     */
    handleSave() {
      if (!this.id) {
        this.$refs['form'].validate(isSuccess => {
          if (isSuccess) {
            const req = JSON.parse(JSON.stringify(this.form))
            if (req.positionType === AD_TYPE.TEXT) req.totalQuantity = req.textNum
            this._reqAddAdvertisingSpace(req)
          }
        })
      } else {
        this.$refs['form'].validate(isSuccess => {
          if (isSuccess) {
            const req = JSON.parse(JSON.stringify(this.form))
            if (req.positionType === AD_TYPE.TEXT) req.totalQuantity = req.textNum
            this._reqUpdateAdvertisingSpace(req)
          }
        })
      }
    },
    /**
     * @description: 切换广告类型
     */
    onChangeType() {
      this.form.totalQuantity = ''
      this.form.advWidth = ''
      this.form.advHeight = ''
      this.form.advOccupy = true
      this.form.autoClose = true
      this.form.closeTime = 5
      this.form.textNum = 1
      this.$refs['form'].clearValidate(['totalQuantity', 'advWidth', 'advHeight', 'closeTime', 'textNum'])
    },
    /**
     * @description: 校验广告位名称
     */
    validateName(rule, name, callback) {
      if (!name) {
        callback('请输入2-30位字符')
      } else if (name.length >= 2 && name.length <= 30) {
        callback()
      } else {
        callback('请输入2-30位字符')
      }
    },
    /**
     * @description: 校验图片宽度
     */
    validateWidth(rule, width, callback) {
      if (!width && width !== 0) {
        callback()
      } else if (!/^\d+$/.test(width)) {
        callback('请输入1-10000(含)之间的整数')
      } else if (Number(width) >= 1 && Number(width) <= 10000) {
        callback()
      } else {
        callback('请输入1-10000(含)之间的整数')
      }
    },
    /**
     * @description: 校验自动关闭时间
     */
    validateCloseTime(rule, time, callback) {
      if (!time) {
        callback('请输入1-60(含)之间的整数')
      } else if (!/^\d+$/.test(time)) {
        callback('请输入1-60(含)之间的整数')
      } else if (Number(time) >= 1 && Number(time) <= 60) {
        callback()
      } else {
        callback('请输入1-60(含)之间的整数')
      }
    },
    /**
     * @description: 初始化
     */
    _reqAdvertisingSpaceInit() {
      return reqAdvertisingSpaceInit()
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            let positionTypes = result.positionTypes || []
            this.typeOptions = positionTypes.map(item => {
              return { key: item.name, value: item.code }
            })
            let positionTerminalTypes = result.positionTerminalTypes || []
            this.terminalOptions = positionTerminalTypes.map(item => {
              return { key: item.name, value: item.code }
            })
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 添加广告位
     */
    _reqAddAdvertisingSpace(data) {
      return reqAddAdvertisingSpace({
        ...data
        // operator: this.user.name
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.$router.push({ path: '/advertising/spaceList' })
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 更新广告位
     */
    _reqUpdateAdvertisingSpace(data) {
      return reqUpdateAdvertisingSpace({
        ...data,
        id: this.id
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('更新成功')
            this.$router.push({ path: '/advertising/spaceList' })
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 广告位详情
     */
    _reqAdvertisingInfoById(id) {
      return reqAdvertisingInfoById({ positionId: id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.form = result
            if (result.positionType === AD_TYPE.TEXT) {
              this.$set(this.form, 'textNum', result.totalQuantity)
            }
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
