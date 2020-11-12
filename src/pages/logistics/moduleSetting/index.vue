<template>
  <div class="app-container">
    <el-row class="second-title">采购配送设置</el-row>
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="0px" size="mini">
      <el-form-item>
        <span>开启/关闭配送设置</span>
        <el-switch v-model="form.enable" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item>
        <span>每月前</span>
        <el-input class="input-style" v-model="form.freeLimit" clearable :disabled="!form.enable" />
        <span>次采购，免配送费</span>
      </el-form-item>
      <el-form-item>
        <span>剩余订单满</span>
        <el-input class="input-style" v-model="form.freeReachAmount" clearable :disabled="!form.enable" />
        <span>元（包含），免配送费，不满的则 每单收取配送费</span>
        <el-input class="input-style" v-model="form.amount" clearable :disabled="!form.enable" />
        <span>元</span>
      </el-form-item>
      <div>
        <el-button type="primary" size="mini" v-np="'SHIPPING_PURCHASE_TEMPLATE_CREATE'" @click="handleSave">保存</el-button>
        <el-button type="plain" size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reqProcurementSetting, reqSaveProcurement } from '@/api/logistics'

export default {
  name: 'logisticsModuleSetting',
  mounted() {
    this._reqProcurementSetting()
  },
  data() {
    return {
      form: {
        enable: true, // 开启/关闭配送设置
        freeLimit: '', // 前几次采购免配送费
        freeReachAmount: '', // 剩余订单满x元，免配送费
        amount: '' // 每单收取配送费
      },
      rules: {}
    }
  },
  methods: {
    /**
     * @description: 保存
     */
    handleSave() {
      let req = JSON.parse(JSON.stringify(this.form))
      const COUNT_TIPS = '请填写次数，为大于0的整数'
      const NUMBER_TIPS = '请填写订单金额，为0.00-999999.99的任意金额'
      const COST_TIPS = '请填写运费，为0.00-9999.99的任意金额'
      if (!req.freeLimit) {
        this.$message.info(COUNT_TIPS)
        return
      }
      if (!/^\d+$/.test(req.freeLimit)) {
        this.$message.info(COUNT_TIPS)
        return
      }
      if (!req.freeReachAmount) {
        this.$message.info(NUMBER_TIPS)
        return
      }
      if (!/^\d+(\.\d{1,2})?$/.test(req.freeReachAmount)) {
        this.$message.info(NUMBER_TIPS)
        return
      }
      if (Number(req.freeReachAmount) >= 1000000) {
        this.$message.info(NUMBER_TIPS)
        return
      }
      if (!req.amount) {
        this.$message.info(COST_TIPS)
        return
      }
      if (!/^\d+(\.\d{1,2})?$/.test(req.amount)) {
        this.$message.info(COST_TIPS)
        return
      }
      if (Number(req.amount) >= 10000) {
        this.$message.info(COST_TIPS)
        return
      }
      this._reqSaveProcurement(req)
    },
    /**
     * @description: 取消
     */
    handleCancel() {
      this.$router.go(-1)
    },
    /**
     * @description: 获取采购配送设置
     */
    _reqProcurementSetting() {
      return reqProcurementSetting().then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.form.enable = result.enable || false
          this.form.freeLimit = result.freeLimit
          this.form.freeReachAmount = result.freeReachAmount
          this.form.amount = result.amount
        }
      })
    },
    /**
     * @description: 保存采购配置
     */
    _reqSaveProcurement(data) {
      return reqSaveProcurement(data).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this._reqProcurementSetting()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@mixin title {
  border-left: 6px solid rgba(64, 158, 255, 1);
  padding-left: 10px;
}
.app-container {
  .second-title {
    @include title();
    margin-bottom: 20px;
  }
  .input-style {
    width: 150px;
  }
}
</style>
