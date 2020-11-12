<template>
  <div class="wrapper">
    <el-form ref="form" :model="context.form" :rules="rules" label-width="100px" size="mini">
      <el-form-item label="活动名称" prop="activityName">
        <el-input v-model="context.form.activityName" placeholder="请填写活动名称" clearable></el-input>
        <div class="second-txt">*活动名称允许20个任意字符，展示在订单、商品列表、商品详情等位置</div>
      </el-form-item>
      <el-form-item label="拼团城市" prop="businessCityId">
        <el-cascader v-if="isShowCityCascader" ref="cascader" v-model="context.form.businessCityId" :props="props" @change="handleBusinessCityChange" clearable :placeholder="'请选择拼团城市'" :disabled="!context.isEditAbled"></el-cascader>
        <div class="second-txt">*只能在开通拼团业务的城市范围内选择，活动添加成功后不能更新拼团城市</div>
      </el-form-item>
      <el-form-item label="活动类型" prop="groupActivityType">
        <el-radio-group v-model="context.form.groupActivityType" :disabled="!context.isEditAbled">
          <el-radio :label="1">单次活动</el-radio>
          <el-radio :label="2">周期活动</el-radio>
        </el-radio-group>
        <div class="second-txt">*单次活动仅在指定的时间范围内进行1次活动。周期活动在指定时间范围内，可以按规则进行多次活动；活动添加成功后将不能修改活动类型</div>
      </el-form-item>
      <el-form-item label="拼团时间" prop="assembleTime">
        <el-date-picker v-model="context.form.assembleTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :disabled="!context.isEditAbled" :picker-options="pickerOptions"></el-date-picker>
        <div class="second-txt">*拼团活动进行的时间范围，需要选择到分钟。周期性活动是指整个活动周期的时间范围</div>
      </el-form-item>
      <el-form-item label="截单时间" v-if="context.form.groupActivityType===2">
        每
        <el-input-number v-model="context.form.cutoff.day" :min="1" :max="10" :precision="0" controls-position="right" :style="{width:'200px',margin:'0 10px'}" clearable :disabled="!context.isEditAbled" />天
        <el-input-number v-model="context.form.cutoff.time" :min="0" :max="23" :precision="0" controls-position="right" :style="{width:'200px',margin:'0 10px'}" clearable :disabled="!context.isEditAbled" />点截单1次
        <div class="second-txt">*周期性活动是指活动开始后多少天截单1次（活动在当天截单时间前开始的，当天即会截单）</div>
      </el-form-item>
      <el-form-item label="提货日期" prop="extractDay">
        活动结束后
        <el-input-number v-model="context.form.extractDay" :min="1" :max="10" :precision="0" controls-position="right" :style="{width:'200px',margin:'0 10px'}" clearable :disabled="!context.isEditAbled" />天提货
        <div class="second-txt">*周期活动的提货日期是指在截单后多少天后提货，提货日期是指自然日（活动结束时间是24点前的，设置提货日期为1天时，表示次日提货）</div>
      </el-form-item>
      <el-form-item label="展示排序" prop="sort">
        <el-input v-model="context.form.sort" placeholder="请填写排序数字" clearable></el-input>
        <div class="second-txt">*数字越大展示越靠前，展示排序只影响默认排序</div>
      </el-form-item>
      <el-form-item label="开团类型" prop="groupType">
        <el-radio-group v-model="context.form.groupType" @change="onGroupTypeChange">
          <el-radio :label="1">全部团长</el-radio>
          <el-radio :label="2">指定团长</el-radio>
        </el-radio-group>
        <div class="second-txt">*全部团长是指拼团城市下的所有团长均支持该活动，指定团长则需要在拼团城市下选择参与该活动的团长</div>
      </el-form-item>
      <el-form-item v-show="context.form.groupType === 2">
        <select-colonel ref="selectColonel" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cascader from '@/components/Cascader'
import SelectColonel from './SelectColonel'
import { reqBusinessCityByCode, reqBusinessCityById } from '@/api/assembleGoods'

export default {
  name: 'SetActivity',
  components: { Cascader, SelectColonel },
  watch: {
    'context.form.groupType': {
      handler: function(newVal) {
        if (newVal === 2 && this.context.form.businessCityId.length) {
          this.context.isFirstEnter ? (this.context.isFirstEnter = false) : (this.context.selected.list = [])
          this.context.selected.onSearch()
          this.context.optional.onSearch()
        }
        // this.context.optional.onSearch()
      }
    }
  },
  inject: ['context'],
  data() {
    return {
      isShowCityCascader: true,
      rules: {
        activityName: [{ required: true, validator: this.validateActivityName, trigger: 'blur' }],
        businessCityId: [{ required: true, message: '请选择拼团城市', trigger: 'change' }],
        groupActivityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        assembleTime: [{ required: true, message: '请选择拼团时间', trigger: 'change' }],
        extractDay: [{ required: true, message: '请输入提货日期', trigger: 'blur' }],
        groupType: [{ required: true, message: '请选择开团类型', trigger: 'change' }],
        sort: [{ required: true, validator: this.validateSort, trigger: 'blur' }]
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.root) {
            reqBusinessCityByCode()
              .then(res => {
                let nodes = res.result || []
                nodes = nodes.map(item => ({
                  value: item.provinceCode,
                  label: item.provinceName,
                  leaf: false
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          } else {
            reqBusinessCityByCode({ id: node.value })
              .then(res => {
                let result = res.result || []
                let province = result[0] || {}
                let nodes = province.cityList || []
                nodes = nodes.map(item => ({
                  value: item.id,
                  label: item.cityName,
                  cityCode: item.cityCode,
                  leaf: true
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          }
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 3600 * 1000 * 24
        }
      }
    }
  },
  methods: {
    /**
     * @description: 开团类型改变
     */
    onGroupTypeChange() {
      if (!this.context.form.businessCityId.length) {
        this.$message('请先选择拼团城市')
        this.context.form.groupType = 1
      }
    },
    /**
     * @description: 拼团城市改变
     */
    handleBusinessCityChange() {
      // this.$refs['cascader'].value = val
      if (this.context.form.groupType === 2 && !this.context.form.businessCityId.length) this.context.form.groupType = 1
      this.context.selected.list = [] // 切换城市 清空选择列表
      this.context.goods.selected.list = []
      this.context.selectedCity = ''
      let node = this.$refs['cascader'].getCheckedNodes()[0] || {}
      let province = node.parent && node.parent.label
      let city = node && node.label
      this.context.selectedCity = `${province || ''}/${city || ''}`
      this.context.selectedCityCode = [(node.parent || {}).value, (node.data || {}).cityCode]
      this.context.optional.onSearch()
      this.context.selected.onSearch()
      if (node.value) {
        reqBusinessCityById({ id: node.value })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              let areaOption = result.businessAreaList || []
              this.context.areaOption = areaOption.map(item => {
                return {
                  key: item.areaName,
                  value: item.areaCode
                }
              })
            }
          })
          .catch(() => {})
      }
    },
    /**
     * @description: 检验活动名
     */
    validateActivityName(rule, name, callback) {
      if (!name) {
        callback('请填写不超过20个任意字符')
      } else if (name.length > 20) {
        callback('请填写不超过20个任意字符')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验展示排序
     */
    validateSort(rule, sort, callback) {
      if (!sort) {
        callback()
      } else if (/\D/.test(sort)) {
        callback('展示排序为10000以内的整数')
      } else if (Number(sort) >= 10000) {
        callback('展示排序为10000以内的整数')
      } else {
        callback()
      }
    },
    /**
     * @description: 下一步，校验
     */
    async validateNext() {
      let res = true
      try {
        res = await this.$refs['form'].validate()
      } catch (err) {
        res = false
      }
      if (!res) return
      if (!this.context.form.businessCityId.length) {
        this.$message('请选择拼团城市')
        return
      }
      if (this.context.form.groupActivityType === 2) {
        if (!this.context.form.cutoff.day && this.context.form.cutoff.day !== 0) {
          this.$message('请填写截单时间')
          return
        }
        if (!this.context.form.cutoff.time && this.context.form.cutoff.time !== 0) {
          this.$message('请填写截单时间')
          return
        }
      }
      if (!this.context.form.assembleTime.length) {
        this.$message('请设置拼团时间')
        return
      }
      if (!this.context.form.extractDay && this.context.form.extractDay !== 0) {
        this.$message('请填写提货日期')
        return
      }
      if (!this.context.form.sort && this.context.form.sort !== 0) {
        this.$message('请填写展示排序')
        return
      }
      if (this.context.form.groupType === 2 && !this.context.selected.list.length) {
        this.$message('请选择活动团长')
        return
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  margin-top: 10px;
  .second-txt {
    font-size: 12px;
    color: #909399;
  }
}
</style>
