<template>
  <div class="wrapper">
    <el-table :data="dataList" :span-method="objectSpanMethod" border style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" max-height="500">
      <el-table-column :prop="item.prop" :label="item.label" v-for="(item,idx) of tableColumns" :key="idx"></el-table-column>
      <el-table-column v-if="showSkuNo" prop="skuNo" label="规格编码"></el-table-column>
      <template v-for="item of colsMap">
        <el-table-column v-if="item.formatter" :label="item.label" :key="item.label">
          <template slot-scope='scope'>
            {{item.formatter ? item.formatter(scope.row) : item.prop}}
          </template>
        </el-table-column>
        <el-table-column v-else-if="!item.useComponent" :prop="item.prop" :label="item.label" :key="item.label"></el-table-column>
        <el-table-column v-else-if="item.useComponent==='input'" :label="item.label" :key="item.label" min-width="160px">
          <template v-slot:default="{row}">
            <el-input ref="input" v-model="row[item.prop]" clearable :disabled="disabled" @blur="handleValidation(row,item.prop)" @clear="handleValidation(row,item.prop)" />
            <div :ref="`hint${row['skuNo']}`" :style="{visibility:'hidden'}" class="hint"></div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.useComponent==='radio'" :label="item.label" :key="item.label" width="35px">
          <template slot-scope='scope'>
            <el-radio v-model="isSelected" :label="scope.$index" @change="handleChange(scope.row)"></el-radio>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { colsMap } from '@/components/SkuTable/config.js'

export default {
  name: 'SkuTable',
  props: {
    tableData: { type: Array, default: () => [] }, // 表格数据
    colsMap: { type: Array, default: () => colsMap }, // 列配置
    isOpenValidator: { type: Boolean, default: false }, // 是否开启内部校验 校验提示信息将出现在输入框下面
    // 外部业务校验器，需要开启isOpenValidator，校验器需要返回一个对象，包含res:boolean true-通过校验 false-未通过，text:String 提示信息
    validator: { type: Function, default: () => {} },
    showSkuNo: { type: Boolean, default: () => true } // 是否显示商品编码
  },
  watch: {
    tableData: {
      handler: function(newVal) {
        this.dataList = JSON.parse(JSON.stringify(newVal))
        if (this.dataList && this.dataList.length && this.dataList[0].skuInfo && this.isArray(JSON.parse(this.dataList[0].skuInfo))) {
          const skuSet = {}
          const skuInfo = JSON.parse(this.dataList[0].skuInfo)
          this.tableColumns = skuInfo.map((item, idx) => {
            skuSet[item.specName] = new Set()
            return {
              label: item.specName,
              prop: 'skuItem' + idx,
              count: 0
            }
          })
          this.dataList.map((item, index, array) => {
            const skuInfo = JSON.parse(item.skuInfo)
            skuInfo.map((sku, skuIdx) => {
              array[index]['skuItem' + skuIdx] = sku.name
              skuSet[sku.specName].add(sku.name)
              // if (!this.needMergeArr.includes('skuItem' + skuIdx)) this.needMergeArr.push('skuItem' + skuIdx)
            })
            return item
          })
          this.tableColumns = this.tableColumns.map(item => {
            return { ...item, count: skuSet[item.label].size }
          })
          this.dataList = this.clustering(this.dataList, 0, skuInfo.length)
          // this.needMergeArr.concat(...this.mergeProps)
          this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.dataList) // 处理数据
        } else {
          this.tableColumns = []
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      disabled: false,
      tableColumns: [],
      dataList: [],
      validateStatus: true,
      isSelected: 0,
      rowMergeArrs: {}, // 包含需要一个或多个合并项信息的对象
      mergeProps: { type: Array, default: () => [] } // 需要合并的字段
    }
  },
  computed: {
    needMergeArr() {
      return this.tableColumns.map(item => item.prop).concat(this.mergeProps)
    }
  },
  methods: {
    /**
     * @description: 配置table合并行列
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // eslint-disable-line
      // if (columnIndex < this.tableColumns.length - 1) {
      //   let rowspan = 1
      //   this.tableColumns.map((item, idx) => {
      //     if (columnIndex < idx) {
      //       rowspan *= item.count
      //     }
      //   })
      //   if (rowIndex % rowspan === 0) {
      //     return {
      //       rowspan,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
      for (let i = 0; i < this.needMergeArr.length; i++) {
        if (column.property === this.needMergeArr[i]) return this.mergeAction(this.needMergeArr[i], rowIndex, column)
      }
    },
    mergeAction(val, rowIndex, colData) { // eslint-disable-line
      let _row = this.rowMergeArrs[val].rowArr[rowIndex]
      let _col = _row > 0 ? 1 : 0
      return [_row, _col]
    },
    rowMergeHandle(arr, data) {
      if (!Array.isArray(arr) && !arr.length) return false
      if (!Array.isArray(data) && !data.length) return false
      let needMerge = {}
      arr.forEach(i => {
        needMerge[i] = {
          rowArr: [],
          rowMergeNum: 0
        }
        data.forEach((item, index) => {
          if (index === 0) {
            needMerge[i].rowArr.push(1)
            needMerge[i].rowMergeNum = 0
          } else {
            if (item[i] === data[index - 1][i]) {
              needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1
              needMerge[i].rowArr.push(0)
            } else {
              needMerge[i].rowArr.push(1)
              needMerge[i].rowMergeNum = index
            }
          }
        })
      })
      return needMerge
    },
    /**
     * @description: 聚类算法
     */
    clustering(list, index, skulength) {
      let clusterObj = {}
      list.map(item => {
        const skuInfo = JSON.parse(item.skuInfo)
        if (!clusterObj.hasOwnProperty(skuInfo[index].id)) {
          clusterObj[skuInfo[index].id] = []
          clusterObj[skuInfo[index].id].push(item)
        } else {
          clusterObj[skuInfo[index].id].push(item)
        }
      })
      if (index < skulength - 1) {
        Object.keys(clusterObj).map(item => {
          clusterObj[item] = this.clustering(clusterObj[item], index + 1, skulength)
          return item
        })
      }
      let resList = []
      Object.keys(clusterObj).map(item => {
        Array.prototype.push.apply(resList, clusterObj[item])
      })
      if (index === skulength - 1) {
        resList.sort((pre, next) => {
          const preSku = JSON.parse(pre.skuInfo)
          const nextSku = JSON.parse(next.skuInfo)
          let preCodeSum = 0
          Array.from(preSku[index].name).map(item => {
            preCodeSum += item.charCodeAt(0)
          })
          let nextCodeSum = 0
          Array.from(nextSku[index].name).map(item => {
            nextCodeSum += item.charCodeAt(0)
          })
          return preCodeSum - nextCodeSum
        })
      }
      return resList
    },
    /**
     * @description: 更新数据源
     */
    updateDataSource(dataSource = [], callback = () => ({ res: true })) {
      if (this.isOpenValidator) {
        // 更新数据源之前，调用callback进行整体校验
        this.$refs['input'].map(item => item.$emit('blur'))
        const { res, text } = callback(this.dataList, this.validateStatus)
        if (!res) {
          text ? this.$message(text) : null
          return
        }
      }
      dataSource.map((item, idx, arr) => {
        let tempItem = item
        this.dataList.forEach(data => {
          if (item.skuNo === data.skuNo) {
            tempItem = data
          }
        })
        arr[idx] = tempItem
        return tempItem
      })
      return true
    },
    /**
     * @description: 得到内部数据
     */
    getInnerData() {
      return this.dataList
    },
    /**
     * @description: 校验并显示输入框下方的提示信息
     */
    handleValidation(row, key) {
      if (this.isOpenValidator) {
        const { res, text } = this.validator(row[key])
        const hint = this.$refs[`hint${row['skuNo']}`][0]
        res ? (hint.style.visibility = 'hidden') : (hint.style.visibility = 'visible')
        res ? (hint.innerHTML = '') : (hint.innerHTML = text)
        res ? (this.validateStatus = true) : (this.validateStatus = false)
      }
    },
    /**
     * @description: 重置校验
     */
    resetValidate() {
      this.validateStatus = true
      this.dataList.map(item => {
        const hint = this.$refs[`hint${item['skuNo']}`][0]
        hint.style.visibility = 'hidden'
        hint.innerHTML = ''
      })
    },
    /**
     * @description: 是否数组
     */
    isArray(val) {
      return /Array/.test(Object.prototype.toString.apply(val, null))
    },
    handleChange(row) {
      this.$emit('change', row)
    }
  }
}
</script>

<style lang='scss' scoped>
$input-height: 30px;
.wrapper {
  margin-top: 10px;
  /deep/ .el-table__row {
    .cell {
      padding-bottom: 5px;
    }
  }
  /deep/ .el-input {
    height: $input-height;
    line-height: $input-height;
    .el-input__inner {
      height: $input-height;
      padding: 0 20px 0 8px;
    }
    .el-input__icon {
      line-height: $input-height;
      transform: scale(0.8, 0.8);
      width: 13px;
    }
  }
  .hint {
    font-size: 12px;
    transform: scale(0.9, 0.9) translate(-50%, 0);
    position: absolute;
    bottom: -6px;
    left: 45%;
    color: red;
    white-space: nowrap;
  }
}
</style>
