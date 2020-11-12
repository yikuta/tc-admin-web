<template>
  <div class="sku-table">
    <table class="el-table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <!-- <th v-for="(item, index) in effectiveSpecList" :key="index">{{item.name}}</th> -->
          <th v-for="column in columnsNewMap" :key="column.value">{{ column.name }}{{column.unit}}</th>
        </tr>
      </thead>
      <tbody id="specification">
        <!-- <tr v-for="(item, 0) in skuNewList" :key="item.id"> -->
        <tr>
          <!-- <template v-for="(next_index, spec_index) in effectiveSpecList.length">
          <td
            class="spec-td"
            v-if="isShowTd(next_index, 0)"
            :key="next_index"
            :rowspan="countRowSum(next_index)" style="width:100px;">
            <span>{{getSpecAttr(spec_index, 0)}}</span>
          </td>
          </template>-->
          <template v-for="column_item in columnsNewMap">

            <template v-if="!column_item.contentType">
              <td class="td" v-if="column_item.type === 'decimal'" :key="column_item.value">
                <el-input
                  :class="column_item.value"
                  :size="size"
                  type="text"
                  @input="handleInputNumber(skuNewList[0], column_item.value)"
                  @blur="handleBlur(column_item)"
                  v-model="skuNewList[0][column_item.value]"
                  :placeholder="column_item.name"
                ></el-input>
              </td>
              <td class="td" v-if="column_item.type === 'integer'" :key="column_item.value">
                <el-input
                  :class="column_item.value"
                  :size="size"
                  type="text"
                  @input="handleInputInteger(skuNewList[0], column_item.value)"
                  @blur="handleBlur(column_item)"
                  v-model="skuNewList[0][column_item.value]"
                  :placeholder="column_item.name"
                ></el-input>
              </td>
            </template>
            <template v-else-if="column_item.contentType === 'text'">
              <td :key="column_item.value" class="td">{{column_item.value}}</td>
            </template>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { columnsNewMap } from '../config'
import { notEmptyStr } from '../util'
export default {
  name: 'skuTable',
  props: {
    columnsNewMap: {
      type: Array,
      default: () => columnsNewMap
    },
    size: {
      type: String,
      default: 'small'
    },
    effectiveSpecList: {
      type: Array,
      default: () => []
    },
    skuNewList: {
      type: Array,
      default: () => [{}]
    }
  },
  watch: {
    skuNewList: {
      handler(e) {
        console.log('%c⧭', 'color: #00bf00', e) // eslint-disable-line
      },
      deep: true,
      immediate: true
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
        this.$set(
          item,
          key,
          value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
        )
      }
    },
    // 清除数据末尾小数点
    handleBlur(columnItem) {
      let value = this.skuNewList[0][columnItem.value]
      if (notEmptyStr(value) && value !== '0' && value.substr(-1) === '.') {
        value = value.substring(0, value.length - 1)
        this.$set(this.skuNewList[0], columnItem.value, value)
      }
      if (value > columnItem.max) {
        this.setError(columnItem.value, 0, false)
        this.$message.error(
          `${columnItem.name}为${columnItem.max}以内${
            columnItem.type === 'decimal' ? '小数' : '整数'
          }`
        )
      } else {
        this.setError(columnItem.value, 0, true)
      }
    },
    // 是否展示单元格
    isShowTd(spec_index) {
      if (!this.effectiveSpecList[spec_index]) {
        return true
      } else if (0 % this.countRowSum(spec_index) === 0) {
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
    getTagIndex(spec_index) {
      const currentTags = this.effectiveSpecList[spec_index].tags
      const nextSpec = this.effectiveSpecList[spec_index + 1]
      let indexCopy = ''
      if (nextSpec && nextSpec.tags.length) {
        indexCopy = 0 / this.countRowSum(spec_index + 1)
      } else {
        indexCopy = 0
      }
      return Math.floor(indexCopy % currentTags.length)
    },
    // 获取单元格元素
    getSpecAttr(spec_index) {
      const i = this.getTagIndex(spec_index, 0)
      if (i.toString() !== 'NaN') {
        return this.effectiveSpecList[spec_index].tags[i].name
      } else {
        return ''
      }
    },

    /* handleEditTag(spec_index, sku_index) {
         const tagIndex = this.getTagIndex(spec_index, sku_index)
         console.log(this.effectiveSpecList[spec_index], this.skuNewList[sku_index])
       },*/

    setError(name, index, status) {
      const inputDom = document
        .getElementById('specification')
        .getElementsByTagName('tr')[index].getElementsByClassName(name)
      if (inputDom.length) {
        if (status) {
          inputDom[0].classList.remove('el-error')
        } else {
          inputDom[0].classList.add('el-error')
        }
      }
    },
    // 检查表格数据
    validateSkuTable() {
      if (!this.skuNewList.length) return true
      for (let i = 0, len = this.skuNewList.length; i < len; i++) {
        for (let j = 0, length = columnsNewMap.length; j < length; j++) {
          if (columnsNewMap[j].contentType !== 'text') {
            // 文本不用验证
            const value = this.skuNewList[i][columnsNewMap[j].value]
            const validateFlag = notEmptyStr(value) && value <= columnsNewMap[j].max
            if (!validateFlag) {
              this.setError(columnsNewMap[j].value, i, validateFlag)
              this.$message.error(`请检查规格${columnsNewMap[j].name}是否为空！`)
            }
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
    border-bottom: 1px solid #ebeef5;
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

    .el-error {
      /deep/ .el-input__inner {
        border-color: #f56c6c !important;
      }
    }
  }
}
</style>
