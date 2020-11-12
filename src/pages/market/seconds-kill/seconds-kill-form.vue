<template>
  <div class="app-container">
    <!-- 新建秒杀 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="mini" class="" :disabled="$route.query.type === 'show'">
      <div>基础信息</div>
      <el-divider></el-divider>
      <el-form-item label="投放终端" prop="channelType">
        <el-radio-group v-model="form.channelType">
          <el-radio label="APP_TINCERE_LIFE">天呈生活APP</el-radio>
        </el-radio-group>
        <!-- <el-checkbox-group class="channelTypeList" v-model="form.channelType">
          <el-checkbox label="APP_TINCERE_LIFE">天呈生活APP</el-checkbox>
          <el-checkbox label="MP_TINCERE_LIFE">天呈生活小程序</el-checkbox>
        </el-checkbox-group> -->
      </el-form-item>
      <el-form-item label="投放业务" prop="businessType">
        <!-- <el-checkbox-group v-model="form.businessTypeSet" @change="businessTypeChange">
          <el-checkbox label="PRE_SALE">爆品预售</el-checkbox>
          <el-checkbox label="LOGISTICS">快递到家</el-checkbox>
        </el-checkbox-group> -->
        <el-radio-group v-model="form.businessType" @change="businessTypeChange">
          <el-radio label="LOGISTICS">快递到家</el-radio>
          <el-radio label="PRE_SALE">爆品预售</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择活动日期" prop="day">
        <el-date-picker
          v-model="form.day"
          ref="availableTimeSetting_fixedTimeList"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="{ disabledDate (time) { return time.getTime() - 1 < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() - 1 }}">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择秒杀场次" prop="timePeriod">
        <el-select v-model="form.timePeriod" placeholder="请选择秒杀场次">
          <el-option v-for="(item, index) in sessionOptions" :label="item.timePeriod" :value="item.timePeriod" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <div>商品设置</div>
      <el-divider></el-divider>
      <el-form-item label="选择商品">
        <el-button @click="showSelectDialog()">点击选择</el-button>
        <div>
          <el-table :data="form.seckillCommodityList" row-key="id" size="mini" :tree-props="{children: 'commoditySkuSettings', hasChildren: 'hasChildren'}">
            <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
            <el-table-column prop="spec" label="规格">
              <template slot-scope="scope">
                <span v-if="!scope.row.spec">——</span>
                <span v-else type="text">{{scope.row.spec}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
            <el-table-column prop="salePrice" label="售价"></el-table-column>
            <el-table-column prop="offLine" label="是否地推">
              <template slot-scope="scope">
                {{getText(scope.row)}}
                <!-- <span v-if="scope.row.offLine != undefined">{{scope.row.offLine ? '是' : '否'}}</span>
                <span v-else>—</span> -->
              </template>
            </el-table-column>
            <el-table-column label="可用库存" prop="stock"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="seckillPrice" label="秒杀价">
              <template slot-scope="scope">
                <el-input
                  class="input-width"
                  type="text"
                  :data-row-key="tableRowKey"
                  v-model="scope.row.seckillPrice"
                  @change="miaoshaChange(scope.row)"
                  placeholder="输入秒杀价"
                  onblur="this.value= this.value.match(/^([1-9]\d{0,3})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/) ? this.value.match(/^([1-9]\d{0,3})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/)[0] : ''" />
                <!-- <el-input-number class="input-width" :data-row-key="tableRowKey" :step="0.01" :controls="false" :min="0.01" :max="999999.99" v-model.number="scope.row.seckillPrice" @change="miaoshaChange(scope.row)" placeholder="输入秒杀价" /> -->
              </template>
            </el-table-column>
            <el-table-column prop="limitNum" label="秒杀限量">
              <template slot-scope="scope">
                <el-input
                  class="input-width"
                  type="text"
                  v-model="scope.row.limitNum"
                  @change="miaoshaxianliangChange(scope.row)"
                  placeholder="输入秒杀限量"
                  onblur="this.value= this.value.match(/^\+?[1-9][0-9]*$/) ? this.value.match(/^\+?[1-9][0-9]*$/)[0] : ''" />
                <!-- <el-input-number class="input-width" :step="1" :controls="false" :min="1" :max="999999" v-model.number="scope.row.limitNum" @change="miaoshaxianliangChange(scope.row)" placeholder="输入秒杀限量" /> -->
              </template>
            </el-table-column>
            <el-table-column prop="singleUserLimitNum" label="单用户限量">
              <template slot-scope="scope">
                <el-input
                  class="input-width"
                  type="text"
                  v-model.number="scope.row.singleUserLimitNum"
                  @change="userxianliangChange(scope.row)"
                  placeholder="输入单用户限量"
                  onblur="this.value= this.value.match(/^\+?[1-9][0-9]*$/) ? this.value.match(/^\+?[1-9][0-9]*$/)[0] : ''" />
                <!-- <el-input-number class="input-width" :step="1" :controls="false" :min="1" :max="999999" v-model.number="scope.row.singleUserLimitNum" @change="userxianliangChange(scope.row)" placeholder="输入单用户限量" /> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="$route.query.type !== 'show'">
              <template v-slot:default="{ row }">
                <el-tooltip class="item" effect="dark" content="删除sku后若需重新添加，请将商品整个删除后再去选择商品添加到列表" placement="top-start">
                  <el-link type="primary" @click="del(row)">移除</el-link>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <div class="save-btn">
      <el-button type="plain" size="mini" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" size="mini" @click="saveForm" v-show="$route.query.type !== 'show'" :loading="loading" v-np="'SEC_KILL_LAUNCH_ADD'">保存</el-button>
    </div>
    <select-dialog ref="selectDialog" :selected="selectedGoods" :dialogVisible="dialogVisible" @on-save-goods="onSaveGoods" @on-close-dialog="dialogVisible = false" />
    <RepeatGoods :dialogVisible="repeatGoodsVisible" v-if="repeatGoodsVisible" :repeatData="repeatData" @on-del-repeat-goods="onDelRepeatGoods" @on-close-dialog="repeatGoodsVisible = false" />
  </div>
</template>
<script>
import SelectDialog from './templates/select-dialog'
import RepeatGoods from './templates/repeat-goods'
import { reqGetSessions, reqSeckillAddLaunch, reqSeckillUpdateLaunch, reqGetSeckillLaunch } from '@/api/seckill'
export default {
  name: 'secondsKillForm',
  components: {
    SelectDialog,
    RepeatGoods
  },
  data() {
    return {
      form: {
        channelType: 'APP_TINCERE_LIFE',
        businessType: 'LOGISTICS',
        day: '',
        timePeriod: '',
        seckillCommodityList: []
      },
      sessionOptions: [],
      selectedGoods: [],
      rules: this.ruleFn(),
      dialogVisible: false,
      repeatGoodsVisible: false,
      repeatData: [],
      loading: false
    }
  },
  created() {
    // this.addIDtoChildren()
    this._reqGetSessions()
  },
  mounted() {
    if (this.$route.query.type === 'edit' || this.$route.query.type === 'show') {
      let req = {
        seckillLaunceCode: this.$route.query.seckillLaunceCode,
        version: this.$route.query.version
      }
      this._reqGetSeckillLaunch(req)
    }
    // setTimeout(() => {
    //   // 赋值商品分类默认列表
    //   this.businessTypeChange('LOGISTICS')
    // }, 100)
  },
  methods: {
    saveForm() {
      // 1
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.seckillCommodityList.length === 0) {
            this.$message({
              message: '请选择投放的商品',
              type: 'error'
            })
            return false
          }
          // let seckillPrice = false
          // let limitNum = false
          try {
            this.form.seckillCommodityList.forEach((goods) => {
              let singleUserLimitNum = goods.singleUserLimitNum
              goods.commoditySkuSettings.forEach((sku) => {
                if (sku.seckillPrice === '') {
                  throw new Error('seckillPrice')
                } else {
                  if (sku.seckillPrice < 0.01 || sku.seckillPrice >= 10000) {
                    throw new Error('seckillPrice out')
                  }
                }
                if (sku.limitNum === '') {
                  throw new Error('limitNum')
                } else {
                  if (sku.limitNum < 1 || sku.limitNum >= 1000000) {
                    throw new Error('limitNum out')
                  }
                }
                singleUserLimitNum = !sku.singleUserLimitNum ? singleUserLimitNum : sku.singleUserLimitNum
              })
              if (!singleUserLimitNum) {
                throw new Error('singleUserLimitNum')
              } else {
                if (singleUserLimitNum < 1 || singleUserLimitNum >= 1000000) {
                  throw new Error('singleUserLimitNum out')
                }
              }
            })
          } catch (e) {
            if (e.toString() === 'Error: seckillPrice') {
              this.$message({
                message: '请输入秒杀价',
                type: 'error'
              })
              return false
            } else if (e.toString() === 'Error: seckillPrice out') {
              this.$message({
                message: '请输入0.01-9999.99的秒杀价',
                type: 'error'
              })
              return false
            } else if (e.toString() === 'Error: limitNum') {
              this.$message({
                message: '请输入秒杀限量',
                type: 'error'
              })
              return false
            } else if (e.toString() === 'Error: limitNum out') {
              this.$message({
                message: '请输入1-999999的秒杀限量',
                type: 'error'
              })
              return false
            } else if (e.toString() === 'Error: singleUserLimitNum') {
              this.$message({
                message: '请输入单用户秒杀限量',
                type: 'error'
              })
              return false
            } else if (e.toString() === 'Error: singleUserLimitNum out') {
              this.$message({
                message: '请输入1-999999的单用户秒杀限量',
                type: 'error'
              })
              return false
            }
          }
          let form = JSON.parse(JSON.stringify(this.form))
          // let arr = []
          // arr.push(form.businessTypeSet)
          // form.businessTypeSet = arr
          form.seckillCommodityList.map((item) => {
            if (item.seckillPrice === '') {
              item.seckillPrice = null
            }
            if (item.limitNum === '') {
              item.limitNum = null
            }
            if (item.singleUserLimitNum === '') {
              item.singleUserLimitNum = null
            }
            item.commoditySkuSettings.map((sku) => {
              if (sku.seckillPrice === '') {
                sku.seckillPrice = null
              }
              if (sku.limitNum === '') {
                sku.limitNum = null
              }
              if (sku.singleUserLimitNum === '') {
                sku.singleUserLimitNum = null
              }
            })
          })
          this.loading = true
          if (this.$route.query.type === 'edit') {
            this._reqSeckillUpdateLaunch(form)
          } else {
            this._reqSeckillAddLaunch(form)
          }
        }
      })
    },
    onSaveGoods(list) {
      this.form.seckillCommodityList = list
    },
    onDelRepeatGoods() {
      let seckillCommodityList = JSON.parse(JSON.stringify(this.form.seckillCommodityList))
      this.repeatData.map((repeat) => {
        seckillCommodityList.map((item, index) => {
          if (item.channelCommodityNo === repeat.channelCommodityNo) {
            // this.$delete(seckillCommodityList, index)
            seckillCommodityList.splice(index, 1)
          }
        })
      })
      this.form.seckillCommodityList = JSON.parse(JSON.stringify(seckillCommodityList))
      this.selectedGoods = JSON.parse(JSON.stringify(seckillCommodityList))
      this.repeatGoodsVisible = false
    },
    showSelectDialog() {
      if (this.form.businessType === '') {
        this.$message({
          message: '请先选择投放业务',
          type: 'error'
        })
        return false
      }
      this.selectedGoods = JSON.parse(JSON.stringify(this.form.seckillCommodityList))
      this.dialogVisible = true
      this.$refs.selectDialog.showDialog()
    },
    businessTypeChange(val) {
      this.$refs.selectDialog.businessTypeSet(val)
    },
    getText(row) {
      if (row.offLine === undefined) {
        return '—'
      }
      if (row.offLine) {
        return '是'
      } else {
        return '否'
      }
    },
    del(row) {
      if (row.commoditySkuSettings) {
        this.form.seckillCommodityList.map((item, index) => {
          if (item.channelCommodityNo === row.channelCommodityNo) {
            this.form.seckillCommodityList.splice(index, 1)
          }
        })
      } else {
        this.form.seckillCommodityList.map((item) => {
          item.commoditySkuSettings.map((child, index) => {
            if (child.id === row.id) {
              item.commoditySkuSettings.splice(index, 1)
            }
          })
        })
      }
    },
    miaoshaChange(row) {
      let req = /^([1-9]\d{0,3})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/
      if (!req.test(row.seckillPrice)) {
        return false
      }
      if (row.commoditySkuSettings) {
        row.commoditySkuSettings.map((item) => {
          item.seckillPrice = row.seckillPrice
        })
      } else {
        this.form.seckillCommodityList.map((item) => {
          item.commoditySkuSettings.map((child) => {
            if (child.id === row.id) {
              item.seckillPrice = ''
            }
          })
        })
      }
    },
    miaoshaxianliangChange(row) {
      let req = /^\+?[1-9][0-9]*$/
      if (!req.test(row.limitNum)) {
        return false
      }
      if (row.commoditySkuSettings) {
        row.commoditySkuSettings.map((item) => {
          item.limitNum = row.limitNum
        })
      } else {
        this.form.seckillCommodityList.map((item) => {
          item.commoditySkuSettings.map((child) => {
            if (child.id === row.id) {
              item.limitNum = ''
            }
          })
        })
      }
    },
    userxianliangChange(row) {
      let req = /^\+?[1-9][0-9]*$/
      if (!req.test(row.singleUserLimitNum)) {
        return false
      }
      if (row.commoditySkuSettings) {
        row.commoditySkuSettings.map((item) => {
          item.singleUserLimitNum = null
        })
      } else {
        this.form.seckillCommodityList.map((item) => {
          item.commoditySkuSettings.map((child) => {
            if (child.id === row.id) {
              item.singleUserLimitNum = null
            }
          })
        })
      }
    },
    tableRowKey(row) {
      row.id
    },
    addIDtoChildren() {
      this.form.seckillCommodityList.map((item) => {
        item.commoditySkuSettings.map((child) => {
          child.id = item.code + '_' + child.guige
        })
      })
    },
    _reqSeckillAddLaunch(data) {
      return reqSeckillAddLaunch(data).then((res) => {
        this.loading = false
        if (res.code === 200) {
          if (res.result.length === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.repeatData = res.result
            this.repeatGoodsVisible = true
          }
        }
      })
    },
    _reqSeckillUpdateLaunch(data) {
      return reqSeckillUpdateLaunch(data, this.$route.query.seckillLaunceCode).then((res) => {
        this.loading = false
        if (res.code === 200) {
          if (res.result.length === 0) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            this.repeatData = res.result
            this.repeatGoodsVisible = true
          }
        }
      })
    },
    _reqGetSeckillLaunch(data) {
      return reqGetSeckillLaunch(data).then((res) => {
        if (res.code === 200) {
          let result = res.result || {}
          // result.businessTypeSet = result.businessTypeSet.join('')
          let goods = []
          result.seckillCommodityList.map((item) => {
            // goods.id = goods.channelCommodityId
            // goods.commoditySkuSettings.map((sku) => {
            //   if (Array.isArray(JSON.parse(sku.spec))) {
            //     let info = JSON.parse(sku.spec)
            //     let text = ''
            //     info.map((i) => {
            //       text += i.name
            //     })
            //     sku.spec = text
            //   }
            // })
            let skulist = []
            item.commoditySkuSettings.map((sku) => {
              let info = JSON.parse(sku.spec)
              let text = ''
              info.map((i) => {
                text += i.name
              })
              skulist.push({
                id: sku.id,
                channelSkuId: sku.id,
                channelSkuNo: sku.channelSkuNo,
                spec: text,
                channelCommodityName: item.channelCommodityName,
                salePrice: sku.salePrice,
                stock: sku.stock,
                status: item.status.describe,
                seckillPrice: sku.seckillPrice || null,
                skuInfo: sku.spec,
                limitNum: sku.limitNum || null,
                singleUserLimitNum: sku.singleUserLimitNum || null
              })
            })
            goods.push({
              id: item.channelCommodityId,
              channelCommodityNo: item.channelCommodityNo,
              channelCommodityId: item.channelCommodityId,
              spec: '',
              channelCommodityName: item.channelCommodityName,
              salePrice: item.salePrice,
              stock: item.stock,
              status: item.status.describe,
              seckillPrice: item.seckillPrice || null,
              limitNum: item.limitNum || null,
              singleUserLimitNum: item.singleUserLimitNum || null,
              commoditySkuSettings: skulist,
              offLine: item.offLine
            })
          })
          result.seckillCommodityList = goods
          this.form = result
        }
      })
    },
    _reqGetSessions() {
      return reqGetSessions().then((res) => {
        if (res.code === 200) {
          let result = res.result || []
          this.sessionOptions = result
        }
      })
    },
    ruleFn() {
      let channelType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择投放终端'))
        } else {
          callback()
        }
      }
      let businessType = (rule, value, callback) => {
        // if (value.length === 0) {
        if (value === '') {
          callback(new Error('请选择投放业务'))
        } else {
          callback()
        }
      }
      return {
        channelType: [
          { required: true, validator: channelType }
        ],
        businessType: [
          { required: true, validator: businessType }
        ],
        day: [
          { required: true, message: '请选择活动日期', trigger: 'change' }
        ],
        timePeriod: [
          { required: true, message: '请选择活动场次', trigger: 'change' }
        ]
      }
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  /deep/ .el-divider--horizontal {
    margin: 12px 0 24px;
  }
  /deep/ .el-input-number {
    width: 100%;
  }
  .save-btn {
    text-align: center;
  }
}
</style>
