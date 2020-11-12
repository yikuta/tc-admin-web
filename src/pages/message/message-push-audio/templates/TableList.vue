<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="发送状态" prop="statusDesc" width="100">
        <template v-slot:default='{ row }'>
          <div v-if="row.statusDesc">
            <div v-for="(item, index) in row.statusDesc.split(' ')" :key="index">{{item}}</div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="160"></el-table-column>
      <el-table-column label="消息标题" prop="title" />
      <el-table-column label="试听" prop="audio">
        <template v-slot:default="{row}"><a class="listen" :href="row.mediaFullUrl" target="_blank">试听</a></template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" width="180"/>
      <el-table-column prop="createTypeDesc" label="创建方式" width="180"/>
      <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
      <el-table-column label="操作" width="220">
        <template v-slot:default='{ row }'>
          <el-button type="text" size="mini" @click="handleDetail(row)">发送查看</el-button>
          <el-button type="text" size="mini" @click="handleLog(row)">操作日志</el-button>
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
      handleLog(row) {
        this.$router.push({ path: 'messageLog', query: { type: 'PM-SOUND', title: row.title, content: row.content, id: row.id }})
      },
      handleDetail(row) {
        this.$emit('sendSearch', row)
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
.listen{
  color: #409EFF;
  cursor: pointer;
}
</style>
