<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="团长编号" prop="regimentalCode"></el-table-column>
      <el-table-column label="团长账号" prop="phoneNumber"></el-table-column>
      <el-table-column label="团长姓名" prop="name"></el-table-column>
      <el-table-column label="所属区域">
        <template v-slot:default="{row}">{{row['province']+row['city']+row['district']}}</template>
      </el-table-column>
      <el-table-column label="详细地址" prop="site"></el-table-column>
      <el-table-column label="加入时间" prop="createTime">
        <template v-slot:default="{row}">{{ row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column label="团长状态">
        <template v-slot:default="{row}">{{row['enable']?'启用':'停用'}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ColonelTable',
  props: {
    tableData: { type: Array, default: () => [] }
  },
  data() {
    return {
      multipleSelection: ''
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
