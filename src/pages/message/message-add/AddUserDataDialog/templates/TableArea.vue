<template>
  <div class="wrapper">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      size="mini"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户编号" prop="memberCode" />
      <el-table-column label="用户手机" prop="memberPhone" />
      <el-table-column label="昵称" prop="nickName" />
      <el-table-column label="终端来源" prop="terminalType" >
        <template v-slot:default="{row}">{{row['terminalType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="label" label="用户标签" :formatter="(row)=>formatNoneValue(row['label'])">
        <template v-slot:default="{ row }">{{row.labels | labels}}</template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime" />
      <el-table-column label="最后登录时间" prop="updateTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] }
    },
    filters: {
      labels(label) {
        let str = ''
        if (label && label.length) {
          let arr = label.filter(item => item.describe !== '无' && item.describe !== '未知' && item.describe !== undefined)
          arr.map((item, index) => {
            if (index < 3) {
              if (index === 0) {
                str += item.describe
              } else {
                str += ',' + item.describe
              }
            }
          })
          if (arr.length > 3) str += ',...'
          return str
        } else {
          return '-'
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('select', val)
      }
    }
  }
</script>

<style lang='scss' scoped>
.wrapper {
  margin: 0;
  .package-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
