<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="用户手机" prop="memberPhone" />
      <el-table-column label="操作" width="220" v-if="!$parent.nomove">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="remove(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    methods: {
      remove(id) {
        this.$emit('delete', id)
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
