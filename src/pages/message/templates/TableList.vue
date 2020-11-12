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
      <el-table-column prop="sendTime" label="发送时间" width="140">
        <template v-slot:default='{ row }'>
          <div>{{row.sendTime ? row.sendTime : (row.status === 'TASK_WAIT_SEND' ? '等待手动发送' : '-')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="消息标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="创建人" prop="createOperator" width="150"/>
      <el-table-column prop="createTypeDesc" label="创建方式" width="100"/>
      <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot:default='{ row }'>
          <el-button 
            type="text" 
            size="mini" 
            @click="handleSend(row)" 
            v-np='fetchSendType(row)'
            v-if="row.status === 'TASK_WAIT_SEND'||row.status==='TASK_SENDING'||row.status==='TASK_PART_FAIL'">{{row.status | changeStatus}}</el-button>
          <el-button 
            type="text" 
            size="mini" 
            v-np='`MSG_${fetchType(row)}_TASK_SEND`'
            @click="handleSend(row, 'SEND')" 
            v-if="row.status === 'TASK_WAIT_SEND'">发送</el-button>
          <el-button type="text" size="mini" v-np='`MSG_${fetchType(row)}_TASK_RECORD_VIEW`' @click="handleDetail(row)" v-if="row.status !== 'TASK_CANCELED'">发送查看</el-button>
          <el-button type="text" size="mini" v-np='`MSG_${fetchType(row)}_TASK_OPERATION_VIEW`' @click="handleLog(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] },
      type: String
    },
    data() {
      return {
        currentRow: {}
      }
    },
    filters: {
      changeStatus(status) {
        switch (status) {
          case 'TASK_WAIT_SEND': return '取消发送'
          case 'TASK_SENDING': return '停止发送'
          case 'TASK_PART_FAIL': return '再次发送'
          default: return ''
        }
      }
    },
    methods: {
      handleLog(row) {
        this.$router.push({ path: 'messageLog', query: { type: this.type, title: row.title, content: row.content, id: row.id }})
      },
      handleDetail(row) {
        this.$emit('sendSearch', row)
      },
      handleSend(row, status) {
        let str = ''
        if (status) {
          str = status
        } else {
          if (row.status === 'TASK_WAIT_SEND') {
            str = 'CANCEL_SEND'
          } else if (row.status === 'TASK_SENDING') {
            str = 'STOP_SEND'
          } else if (row.status === 'TASK_PART_FAIL') {
            str = 'RETRY_SEND'
          }
        }
        this.$emit('send', { id: row.id, operatorType: str })
      },
      fetchType(row) {
        if (row.templateType === 'SM') {
          return 'SMS'
        } else if (row.templateType === 'IM') {
          return 'TIPS'
        } else if (row.templateType === 'PM') {
          if (row.pushMediaType === 'MEDIA_TEXT') {
            return 'TEXT'
          } else {
            return 'AUDIO'
          }
        }
      },
      fetchSendType(row) {
        let type = this.fetchType(row)
        let sendType = ''
        if (row.status === 'TASK_WAIT_SEND') {
          sendType = 'CANCEL'
        } else if (row.status === 'TASK_SENDING') {
          sendType = 'TERMINATE'
        } else if (row.status === 'TASK_PART_FAIL') {
          sendType = 'RETRY'
        }
        return 'MSG_' + type + '_TASK_' + sendType
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
