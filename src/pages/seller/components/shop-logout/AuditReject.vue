<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="80px" inline size="mini">
      <el-form-item label="驳回原因" prop="reason">
        <el-select v-model="form.reason" placeholder="请选择" clearable>
          <el-option v-for="item in reasonOptions" :key="item.code" :label="item.name" :value="item.name"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" " prop="detail" v-show="isShowTextArea">
        <el-input v-model="form.detail" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写详细原因" :style="{width:'350px'}" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { findDataListByCode } from '@/api/common'
export default {
  name: 'AuditReject',
  computed: {
    isShowTextArea() {
      return this.form.reason === '其他'
    }
  },
  data() {
    return {
      form: {
        reason: '',
        detail: ''
      },
      reasonOptions: []
    }
  },
  mounted() {
    this.handleReasonList()
  },
  methods: {
    // 获取注销原因
    handleReasonList() {
      findDataListByCode('shop_withdraw_audit').then(res => {
        if (res.code === 200) {
          this.reasonOptions = res.result || []
        } else {
          this.reasonOptions = []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
