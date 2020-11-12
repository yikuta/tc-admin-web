<template>
  <div class="sku-table">
    <table class="el-table" cellspacing="0" cellpadding="0">
      <thead>
      <tr>
        <th v-for="(item, index) in effectiveSpecList" :key="index">{{item.name}}</th>
        <th v-for="column in columnsMap" :key="column.value">{{ column.name }}{{column.unit}}</th>
      </tr>
      </thead>
      <tbody v-if="this.skuList.length" id="specification">
      <tr v-for="(item, result_index) in skuList" :key="item.id">
        <template v-for="(next_index, spec_index) in effectiveSpecList.length">
          <td
            class="spec-td"
            v-if="isShowTd(next_index, result_index)"
            :key="next_index"
            :rowspan="countRowSum(next_index)" style="width:100px;">
            <span>{{getSpecAttr(spec_index, result_index)}}</span>
            <!--            <i class="el-icon-edit" @click.stop="handleEditTag(spec_index, result_index)"></i>-->
          </td>
        </template>
        <template v-for="column_item in columnsMap">
          <template v-if="!column_item.contentType">
            <td class="td" v-if="column_item.type === 'decimal'" :key="column_item.value">
              <el-input
                :class="column_item.value"
                :size="size"
                type="text"
                @input="handleInputNumber(skuList[result_index], column_item.value)"
                @blur="handleBlur(result_index, column_item)"
                v-model="skuList[result_index][column_item.value]"
                :placeholder="column_item.name"
                :disabled="item.disabled || skuList[result_index].disabled">
              </el-input>
            </td>
            <td class="td" v-if="column_item.type === 'integer'" :key="column_item.value">
              <el-input
                :class="column_item.value"
                :size="size"
                type="text"
                @input="handleInputInteger(skuList[result_index], column_item.value)"
                @blur="handleBlur(result_index, column_item)"
                v-model="skuList[result_index][column_item.value]"
                :placeholder="column_item.name"
                :disabled="column_item.disabled || skuList[result_index].disabled">
              </el-input>
            </td>
          </template>
          <template v-else-if="column_item.contentType === 'text'">
            <td :key="column_item.value" class="td">{{column_item.formatter(item)}}</td>
          </template>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { columnsMap } from '../config'
  import { notEmptyStr } from '../util'
  export default {
    name: 'skuTable',
    props: {
      columnsMap: {
        type: Array,
        default: () => columnsMap
      },
      size: {
        type: String,
        default: 'small'
      },
      effectiveSpecList: {
        type: Array,
        default: () => []
      },
      skuList: {
        type: Array,
        default: () => []
      },
      errorMessage: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    methods: {
      // 只能输入0和整数
      handleInputInteger(item, key) {
        // this.$set(item, key, item[key].replace(/[^\d]/g, '').replace(/^0{ 1,}/g, ''))
        let value = item[key]
        if (notEmptyStr(value) && value !== '0') {
          if (value.substr(0, 1) === '0') {
            value = value.substr(1)
          }
          this.$set(item, key, value.replace(/\D/g, ''))
        }
      },
      // 输入数字和小数点
      handleInputNumber(item, key) {
        let value = item[key]
        if (notEmptyStr(value) && value !== '0') {
          if (value.substr(0, 1) === '0' && value.substr(0, 2) !== '0.') {
            value = value.substr(1)
          }
          this.$set(item, key, value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'))
        }
      },
      // 清除数据末尾小数点
      handleBlur(sku_index, columnItem) {
        let value = this.skuList[sku_index][columnItem.value]
        if (notEmptyStr(value) && value !== '0' && value.substr(-1) === '.') {
          value = value.substring(0, value.length - 1)
          this.$set(this.skuList[sku_index], columnItem.value, value)
        }
        if (value > columnItem.max) {
          this.setError(columnItem.value, sku_index, false)
          this.$message.error(`${columnItem.name}需控制在${columnItem.max}${columnItem.unit}以内${columnItem.type === 'decimal' ? '(包含小数)' : '(整数)'}`)
          // 直接熔断整个验证
          throw Error('规格验证熔断')
        } else {
          this.setError(columnItem.value, sku_index, true)
        }
      },
      // 是否展示单元格
      isShowTd(spec_index, result_index) {
        if (!this.effectiveSpecList[spec_index]) {
          return true
        } else if (result_index % this.countRowSum(spec_index) === 0) {
          return true
        }
        return false
      },
      // 计算跨行数
      countRowSum(spec_index) {
        let num = 1 //  初始一行
        this.effectiveSpecList.forEach((item, index) => {
          if (index >= spec_index && item.tags.length) {
            num *= item.tags.length
          }
        })
        return num
      },
      getTagIndex(spec_index, result_index) {
        const currentTags = this.effectiveSpecList[spec_index].tags
        const nextSpec = this.effectiveSpecList[spec_index + 1]
        let indexCopy = ''
        if (nextSpec && nextSpec.tags.length) {
          indexCopy = result_index / this.countRowSum(spec_index + 1)
        } else {
          indexCopy = result_index
        }
        return Math.floor(indexCopy % currentTags.length)
      },
      // 获取单元格元素
      getSpecAttr(spec_index, result_index) {
        const i = this.getTagIndex(spec_index, result_index)
        if (i.toString() !== 'NaN') {
          return this.effectiveSpecList[spec_index].tags[i].name
        } else {
          return ''
        }
      },

      /* handleEditTag(spec_index, sku_index) {
         const tagIndex = this.getTagIndex(spec_index, sku_index)
         console.log(this.effectiveSpecList[spec_index], this.skuList[sku_index])
       },*/

      setError(name, index, status) {
        const inputDom = document.getElementById('specification').getElementsByTagName('tr')[index].getElementsByClassName(name)
        if (inputDom.length) {
          if (status) {
            inputDom[0].classList.remove('el-error')
          } else {
            inputDom[0].classList.add('el-error')
          }
        }
      },
      showErrorMessage(columns, lst) {
        // 错误提示 message
        if (lst.tags.length) {
          let skuName = ''
          lst.tags.forEach(item => {
            skuName = skuName ? `${skuName}-${item.name}` : item.name
          })
          this.$message.error(`请检查规格【${skuName}】的【${columns.name}】是否为空！`)
        }
      },
      // 检查表格数据
      validateSkuTable() {
        if (!this.skuList.length) return true
        for (let i = 0, len = this.skuList.length; i < len; i++) {
          for (let j = 0, length = columnsMap.length; j < length; j++) {
            if (columnsMap[j].contentType !== 'text') { // 文本不用验证
              const value = this.skuList[i][columnsMap[j].value]
              const validateFlag = notEmptyStr(value) && value <= columnsMap[j].max
              this.errorMessage && !validateFlag && this.showErrorMessage(columnsMap[j], this.skuList[i])
              this.setError(columnsMap[j].value, i, validateFlag)
              if (!validateFlag) return false
            }
          }
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-table {
    th {
      border-bottom: 1px solid #EBEEF5;
    }
    .spec-td {
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .td {
      min-width: 50px;
      padding: 12px 12px 12px 0;

      .el-error{
        /deep/ .el-input__inner{
          border-color:#F56C6C !important;
        }
      }
    }
  }
</style>
