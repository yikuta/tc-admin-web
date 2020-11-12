<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-form-item label="模版名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入模版名称" :maxlength="50" clearable />
      </el-form-item>

      <el-form-item label="是否包邮" prop="shippingFree">
        <el-radio-group v-model="form.shippingFree">
          <el-radio :label="false" :value="false">自定义运费</el-radio>
          <el-radio :label="true" :value="true">卖家承担运费</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="!form.shippingFree">
        <el-form-item label="计价方式" prop="unitType">
          <el-radio-group v-model="form.unitType" :disabled="!!id && type === 'edit'" @change="handleChangeUnitType">
            <el-radio :label="1" :value="1">按件数</el-radio>
            <el-radio :label="2" :value="2">按重量</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="required-form-item" label="运送方式">
          <div class="default-tips">快递（仅支持）除指定区域外，其余地区运费采用默认设置</div>
          <div class="default-config">
            <span>默认配置：</span>
            <input-number class="input-style" v-model="form.defaultPolicy.minCount" :type="form.unitType === 1 ? 'integer' : 'decimal'" />
            <span>{{ form.unitType === 1 ? '件内' : 'kg内' }}</span>
            <input-number class="input-style" v-model="form.defaultPolicy.minAmount" type="decimal" />
            <span>元;&nbsp;&nbsp;&nbsp;&nbsp;每增加</span>
            <input-number class="input-style" v-model="form.defaultPolicy.increaseCount" :type="form.unitType === 1 ? 'integer' : 'decimal'" />
            <span>{{ form.unitType === 1 ? '件' : 'kg' }}，增加运费</span>
            <input-number class="input-style" v-model="form.defaultPolicy.increaseAmount" type="decimal" />
            <span>元</span>
            <el-button
              style="margin-left: 10px"
              type="primary"
              size="mini"
              @click="handleAddAreaDefaultConfig"
              :disabled="form.policyList.length >= 10"
            >增加地区配置</el-button>
          </div>
        </el-form-item>

        <el-table
          v-if="form.policyList.length"
          :data="form.policyList"
          style="width: 1100px"
          :cell-style="{ textAlign:'center' }"
          :header-cell-style="{ textAlign:'center' }"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="运送到" width="200">
            <template slot-scope="{ row }" show-overflow-tooltip>{{getAreaNames(row)}}</template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="{ row }">
              <el-link type="primary" @click="handleEditAreaList('area', row)">编辑</el-link>
            </template>
          </el-table-column>
          <el-table-column v-for="column in policyConfig[form.unitType]" :label="column.title" :key="column.props">
            <template slot-scope="{ row }">
              <input-number
                class="input-style-free-policy"
                v-model="row[column.prop]"
                :type="column.type"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-link type="primary" @click="handleDelete('area', row, $index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="form.policyList.length" class="operates">
          <el-button type="primary" size="mini" @click="handleBatchSetting">批量设置</el-button>
          <el-button type="plain" size="mini" @click="handleBatchDelete">批量删除</el-button>
          <span class="default-tips">最多可设置10个</span>
        </div>

        <el-form-item label="指定包邮条件">
          <el-switch v-model="form.isSetFreeCondition" @change="handleFreeConditionChange" active-color="#13ce66"></el-switch>
          <el-button
            v-if="form.isSetFreeCondition"
            type="primary"
            size="mini"
            @click="handleAddCondition"
            :disabled="form.freePolicyList.length >= 10"
            style="margin-left: 12px"
          >增加包邮条件</el-button>
        </el-form-item>

        <el-table
          v-if="form.freePolicyList.length"
          :data="form.freePolicyList"
          style="width: 1100px"
          :cell-style="{ textAlign:'center' }"
          :header-cell-style="{ textAlign: 'center' }"
          size="mini"
        >
          <el-table-column width="55"></el-table-column>
          <el-table-column label="运送到" width="200">
            <template slot-scope="{ row }" show-overflow-tooltip>{{getAreaNames(row)}} <el-link type="primary" @click="handleEditAreaList('condition', row)">编辑</el-link></template>
          </el-table-column>

          <el-table-column label="设置包邮条件" width="580">
            <template slot-scope="{row, $index}">
              <el-select class="select-style-free-policy" v-model="row.conditionType" placeholder="请选择">
                <el-option
                  v-for="item in freeConditionOptions[form.unitType]"
                  :key="item.key + $index"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
              <span>{{form.unitType === 1 ? '满' : '在'}}</span>
              <input-number
                v-if="row.conditionType !== 2"
                class="select-style-free-policy"
                v-model="row.minCount"
                :type="form.unitType === 1 ? '' : 'decimal'"
              />
              <span v-if="row.conditionType !== 2">{{form.unitType === 1 ? '件' : 'kg'}}</span>
              <input-number
                v-if="row.conditionType !== 1"
                class="select-style-free-policy"
                v-model="row.minAmount"
                type="decimal"
              />
              <span v-if="row.conditionType !== 1">元（包含）以上</span>
              <span>包邮</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-link type="primary" @click="handleDelete('condition', row, $index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div class="page-buttons">
        <el-button type="primary" size="mini" v-np="'SHIPPING_ORDER_TEMPLATE_CREATE'" @click="handleSave">保存</el-button>
        <el-button type="plain" size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
    <province-dialog
      :visible.sync="areaDialogVisible"
      :provinces="editAreaRow.provinces"
      :disabledProvince="disabledProvince"
      :disabledCity="disabledCity"
      :indeterminateProvince="editAreaRow.indeterminateProvince"
      @save="handleSaveAreas"
    />
    <batch-setting-dialog
      :unitType="form.unitType"
      :visible="batchSettingDialogVisible"
      @close="handleCloseBatch"
    />
  </div>
</template>

<script>
import ProvinceDialog from './templates/ProvinceDialog'
import BatchSettingDialog from './templates/BatchSettingDialog'
import { addLogisticsModule, updateLogisticsModule, fetchLogisticsModuleDetail } from '@/api/logistics'
import InputNumber from '@/components/InputNumber'
import { policyConfig, freePolicyConfig, rules, freeConditionOptions } from './const'
import { createUniqueString, deepClone, mergeObject } from '@/utils/util'
const initDefault = {
  minCount: null,
  minAmount: null,
  increaseCount: null,
  increaseAmount: null,
  policyDefault: true
}

const tableListTypes = {
  area: '地区配置',
  default: '默认配置',
  condition: '包邮条件'
}

export default {
  name: 'moduleForm',
  components: { ProvinceDialog, InputNumber, BatchSettingDialog },
  beforeRouteEnter(to, from, next) {
    const { id, type } = to.query
    if (id && type === 'copy') {
      to.meta.title = '复制模板'
    } else if (id && type === 'edit') {
      to.meta.title = '编辑模板'
    } else {
      to.meta.title = '新增模板'
    }
    next()
  },
  data() {
    return {
      id: null,
      policyConfig,
      freePolicyConfig,
      rules,
      freeConditionOptions,
      form: {
        name: '', // 模板名称
        shippingFree: false, // 是否包邮
        unitType: 1, // 计价方式
        defaultPolicy: { // 默认配置
          ...initDefault
        },
        policyList: [], // 区域配置
        isSetFreeCondition: false, // 指定包邮条件
        freePolicyList: [] // 包邮条件配置
      },
      areaTargetType: null,
      areaDialogVisible: false,
      editAreaRow: {}, // 当前编辑区域的行数据
      disabledProvince: [],
      disabledCity: {},
      batchSettingDialogVisible: false,
      sectionRows: [],
      areaFlag: '' // 是否选择地区
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    if (this.id) {
      this.fetchLogisticsModuleDetail()
    }
  },
  methods: {
    getAreaNames(row) {
      const areas = [];
      ([...row.provinces, ...row.cities]).forEach(item => {
        areas.push(item.name)
      })
      this.areaFlag = areas
      return areas.length ? areas.join(',') : '请选择'
    },
    handleFreeConditionChange(value) {
      if (!value) {
        this.form.freePolicyList = []
      }
    },
    formatEditAreas(listData) {
      listData.forEach(listItem => {
        const indeterminateProvince = {}
        const provinces = []
        const cities = [];
        (listItem.areaList || []).forEach(item => {
          if (!item.children) {
            provinces.push({ ...item })
          } else if (item.children) {
            indeterminateProvince[item.code] = {
              name: item.name,
              code: item.code,
              checkedChildren: deepClone(item.children)
            }
            Reflect.apply(Array.prototype.push, cities, deepClone(item.children))
          }
        })
        listItem.provinces = provinces
        listItem.cities = cities
        listItem.indeterminateProvince = indeterminateProvince
      })
      return listData
    },
    fetchLogisticsModuleDetail() {
      fetchLogisticsModuleDetail({ id: this.id }).then(res => {
        if (res.code === 200) {
          const { freePolicyList, isSetFreeCondition, name, policyList, shippingFree, unitType } = res.result
          const newPolicyList = []
          for (let item of policyList) {
            if (item.policyDefault) {
              this.form.defaultPolicy = { ...item }
            } else {
              newPolicyList.push(item)
            }
          }
          this.form.name = name
          this.form.unitType = unitType
          this.form.shippingFree = shippingFree
          this.form.isSetFreeCondition = isSetFreeCondition
          this.form.policyList = this.formatEditAreas(newPolicyList)
          this.form.freePolicyList = this.formatEditAreas(freePolicyList)
        }
      })
    },
    // 保存单行的区域配置
    handleSaveAreas(provinces, indeterminateProvince) {
      const cities = []
      Object.keys(indeterminateProvince).forEach(key => {
        Reflect.apply(Array.prototype.push, cities, indeterminateProvince[key].checkedChildren)
      })
      this.editAreaRow.provinces = provinces
      this.editAreaRow.cities = cities
      this.editAreaRow.indeterminateProvince = deepClone(indeterminateProvince)
    },
    // 增加地区配置
    handleAddAreaDefaultConfig() {
      this.form.policyList.push({
        tagId: createUniqueString(),
        provinces: [], // 省份区域code
        cities: [], // 城市
        indeterminateProvince: {}, // 选中城市所在省份
        increaseAmount: '', // 增量费用
        increaseCount: '', // 增量
        minAmount: '', // 基数费用
        minCount: '', // 基数 (首重 or 首件数)
        policyDefault: false // 是否默认运费策略
      })
    },
    // 增加包邮条件
    handleAddCondition() {
      this.form.freePolicyList.push({
        tagId: createUniqueString() + 'cid',
        provinces: [], // 省份区域code
        cities: [], // 城市
        indeterminateProvince: {}, // 选中城市所在省份
        conditionType: 3, // 1:数量(件数), 2:金额, 3:数量+金额
        minAmount: 0, // 基数费用
        minCount: 0 // 基数 (首重 or 首件数)
      })
    },
    // 编辑地区
    handleEditAreaList(target, row) {
      this.areaDialogVisible = true
      this.areaTargetType = target
      this.editAreaRow = row
      const disabledProvince = []
      const disabledCity = {};
      (target === 'condition' ? this.form.freePolicyList : this.form.policyList).forEach(item => {
        if (row.tagId !== item.tagId) {
          Reflect.apply(Array.prototype.push, disabledProvince, item.provinces)
          mergeObject(disabledCity, item.indeterminateProvince)
        }
      })
      this.disabledProvince = disabledProvince
      this.disabledCity = disabledCity
    },
    handleSelectionChange(sections) {
      this.sectionRows = sections
    },
    handleBatchSetting() { // 批量设置
      if (!this.sectionRows.length) {
        this.$message.error('请至少选择一项')
        return false
      }
      this.batchSettingDialogVisible = true
    },
    handleBatchDelete() { // 批量删除
      if (!this.sectionRows.length) {
        this.$message.error('请至少选择一项')
        return false
      }
      this.$confirm('确认要删除选中的数据吗？', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '我再想想'
      }).then(() => {
        this.sectionRows.forEach(item => {
          const index = this.form.policyList.findIndex(row => row.tagId === item.tagId)
          if (index === 0 || index) {
            this.form.policyList.splice(index, 1)
          }
        })
      })
    },
    handleDelete(type, row, index) { // 单个删除
      this.$confirm('确认要删除当前数据吗？', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '我再想想'
      }).then(() => {
        if (type === 'area') {
          this.form.policyList.splice(index, 1)
        } else {
          this.form.freePolicyList.splice(index, 1)
        }
      })
    },
    handleCloseBatch(isSuccess, data) {
      if (isSuccess) {
        const { minCount, minAmount, increaseCount, increaseAmount } = data
        this.sectionRows.forEach(item => {
          item.minCount = minCount
          item.minAmount = minAmount
          item.increaseCount = increaseCount
          item.increaseAmount = increaseAmount
        })
      }
      this.batchSettingDialogVisible = false
    },
    formatPolicyList() {
      const newPolicyList = []
      this.form.policyList.forEach(row => {
        const { provinces, cities, minCount, minAmount, increaseCount, increaseAmount, policyDefault } = row
        const areaCodes = []
        const areaNames = [];
        ([...provinces, ...cities]).forEach(item => {
          areaCodes.push(item.code)
          areaNames.push(item.name)
        })
        newPolicyList.push({
          minCount, minAmount, increaseCount, increaseAmount, policyDefault,
          areaCodes: areaCodes.join(','),
          areaNames: areaNames.join(',')
        })
      })
      return newPolicyList
    },
    formatFreePolicyList() {
      const newFreePolicyList = []
      this.form.freePolicyList.forEach(row => {
        const { provinces, cities, minCount, minAmount, conditionType } = row
        const areaCodes = []
        const areaNames = [];
        ([...provinces, ...cities]).forEach(item => {
          areaCodes.push(item.code)
          areaNames.push(item.name)
        })
        newFreePolicyList.push({
          minCount, minAmount, conditionType,
          areaCodes: areaCodes.join(','),
          areaNames: areaNames.join(',')
        })
      })
      return newFreePolicyList
    },
    validateTableData(list, type) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < this.policyConfig[this.form.unitType].length; j++) {
          const columnItem = this.policyConfig[this.form.unitType][j]
          const number = list[i][columnItem.prop]
          /* if ((type === 'area' || type === 'condition') && !list[i].areaCodes.length) {
             this.$message.error(`${tableListTypes[type]}地区不能为空`)
             return false
           }*/
          if (number === '' || number === undefined || number === null) {
            this.$message.error(`${tableListTypes[type]}行${columnItem.title}不能为空`)
            return false
          }
          if (columnItem.type === 'integer' && (number < 0 || number > 9999)) {
            this.$message.error(`${tableListTypes[type]}${columnItem.title}数据>=0,<=9999`)
            return false
          }

          if (columnItem.type === 'decimal' && (number < 0 || number > 9999.99)) {
            this.$message.error(`${tableListTypes[type]}${columnItem.title}数据>=0,<=9999.99`)
            return false
          }
        }
      }
      return true
    },
    validateFreePolicyTableData(list) {
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i]
        for (let j = 0; j < this.freePolicyConfig[this.form.unitType].length; j++) {
          const columnItem = this.freePolicyConfig[this.form.unitType][j]
          const number = listItem[columnItem.prop]
          /* if (!listItem.areaCodes.length) {
            this.$message.error('包邮条件表格地区不能为空')
            return false
          } */
          if (!(number === '' || number === undefined || number === null)) {
            if (listItem.conditionType === 1) {
              if (columnItem.prop === 'minCount') {
                if (listItem.minCount < 0 || listItem.minCount >= 10000) {
                  if (columnItem.title === '重量') {
                    this.$message.error('重量输入0-9999.99的两位小数')
                    return false
                  } else {
                    this.$message.error('件数输入0-9999的整数')
                    return false
                  }
                }
                // this.$message.error(`包邮条件表格内${columnItem.title}不能为空`)
                // return false
              }
            } else if (listItem.conditionType === 2) {
              if (columnItem.prop === 'minAmount') {
                if (!listItem.minAmount) {
                  this.$message.error(`包邮条件表格内${columnItem.title}不能为空`)
                  return false
                }
                // this.$message.error(`包邮条件表格内${columnItem.title}不能为空`)
                // return false
              }
            } else if (listItem.conditionType === 3) {
              if (!listItem.minAmount) {
                this.$message.error('包邮条件表格内费用不能为空')
                return false
              }
              if (!listItem.minCount) {
                this.$message.error('包邮条件表格内件数不能为空')
                return false
              }
              // this.$message.error(`包邮条件表格内${columnItem.title}不能为空`)
              // return false
            }
          }
          if (columnItem.type === 'integer' && (number < 0 || number > 9999 || number === '')) {
            // 满金额不验证件数
            if (listItem.conditionType !== 2) {
              this.$message.error(`包邮条件表格内${columnItem.title}数据>=0,<=9999(1)`)
              return false
            }
          }
          if (columnItem.type === 'decimal' && (number < 0 || number > 9999.99 || number === '')) {
            // 满件数包邮不验证金额
            if (listItem.conditionType !== 1) {
              this.$message.error(`包邮条件表格内${columnItem.title}数据>=0,<=9999.99(2)`)
              return false
            }
          }
        }
      }
      return true
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleSave() {
      const { areaFlag } = this
      const { name, shippingFree, unitType, isSetFreeCondition } = this.form
      let postData = {} // default
      this.$refs.form.validate(validate => {
        if (validate) {
          if (shippingFree) { // 卖家承担运费
            postData = { name, shippingFree }
          } else {
            postData = {
              name, shippingFree, unitType, isSetFreeCondition,
              policyList: this.formatPolicyList(),
              freePolicyList: this.formatFreePolicyList()
            }
            if (!this.validateTableData([this.form.defaultPolicy], 'default')) return false
            if (!this.validateTableData(postData.policyList, 'area')) return false
            if (isSetFreeCondition) {
              if (!postData.freePolicyList.length) {
                this.$message.error('包邮条件配置不能为空')
                return false
              }

              if (!this.validateFreePolicyTableData(postData.freePolicyList, 'condition')) return false
            }
            postData.policyList.push(this.form.defaultPolicy)
          }
          if (this.id && this.type === 'edit') {
            postData.id = this.id
            updateLogisticsModule(postData).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$router.go(-1)
              }
            })
          } else {
            if (isSetFreeCondition && !areaFlag.length) {
              this.$message.error('配送地区不能为空')
              return false
            }
            addLogisticsModule(postData).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$router.go(-1)
              }
            })
          }
        }
      })
    },
    handleChangeUnitType() {
      // 切换计价方式
      this.form.freePolicyList = []
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {

  .input-style {
    width: 72px;
  }

  .input-style-free-policy {
    width: 100%;
    height: 25px;
    /deep/ .el-input__inner {
      width: 100%;
      height: 25px;
      line-height: 25px;
    }
    /deep/ .el-input__icon {
      line-height: 25px;
    }
  }

  .select-style-free-policy {
    @extend .input-style-free-policy;
    width: 120px;
  }

  .form-item.el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }

  .form-item {
    /deep/ .el-form-item__content {
      line-height: 25px;
    }
  }

  .default-tips {
    line-height: 30px;
    margin-bottom: 10px;
    color: #606266;
    font-size: 14px;
  }

  .default-config {
    color: #606266;
  }

  .operates {
    margin-left: 100px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .required-form-item >>> .el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }

  .page-buttons {
    margin-left: 120px;
    margin-top: 10px;
  }
}
</style>
