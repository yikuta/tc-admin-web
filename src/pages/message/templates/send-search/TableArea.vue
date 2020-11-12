<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="用户编号" prop="memberCode" width="180"/>
      <el-table-column label="用户手机" prop="memberPhone" />
      <el-table-column label="昵称" prop="memberName" />
      <el-table-column label="发送时间" prop="sendTime" v-if="status === 'sendSucceed' || status === 'sendIng'"/>
      <el-table-column label="操作" width="80" v-else key="id">
        <template v-slot:default="{row}">
          <el-button type="text" size="mini" @click="handleSend(row, 'SEND')" v-if="status === 'waitSend'">发送</el-button>
          <el-button type="text" size="mini" @click="handleSend(row, 'RETRY_SEND')" v-if="status === 'fail'">再次发送</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  // import { asyncMessageTemplatesStatus } from '@/api/message'
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] },
      hasBusiness: {
        type: Boolean,
        default: () => false
      },
      isAudio: {
        type: Boolean,
        default: () => false
      },
      status: {
        type: String,
        default: () => 'waitSend'
      }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    methods: {
      handleSend(row, status) {
        this.$emit('send', { id: row.id, taskId: row.taskId, operatorType: status })
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
  .listen{
    color: #409EFF;
    cursor: pointer;
  }
}
</style>
