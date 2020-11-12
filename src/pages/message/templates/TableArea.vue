<template>
  <div class="wrapper">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      size="mini"
      v-loading='loading'>
      <el-table-column label="消息模版编号" prop="templateCode" width="180"/>
      <el-table-column label="消息类型" prop="messageTypeDesc" />
      <el-table-column label="业务判别" prop="businessTypeDesc" v-if="hasBusiness"/>
      <el-table-column label="消息标题" prop="title" />
      <el-table-column label="试听" prop="audio" v-if="isAudio">
        <template v-slot:default="{row}"><a class="listen" :href="row.mediaFullUrl" target="_blank">试听</a></template>
      </el-table-column>
      <el-table-column label="内容" prop="content" v-else/>
      <el-table-column label="创建人" prop="createOperator" :formatter="(row)=>formatNoneValue(row['createOperator'])"/>
      <el-table-column prop="templateStatusDesc" label="状态" width="100" :formatter="(row)=>formatNoneValue(row['templateStatusDesc'])"/>
      <el-table-column prop="createTime" label="创建时间" width="100"/>
      <el-table-column label="操作" width="220">
        <template v-slot:default="{row}">
          <el-button type="text" size="mini" v-np='`MSG_${fetchType(row)}_TASK_VIEW`' @click="handleMessage(row)">查看消息</el-button>
          <el-button type="text" size="mini" v-np='`MSG_${fetchType(row)}_TEMPLATE_EDIT`' @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" v-np='`MSG_${fetchType(row)}_TASK_FAST_CREATE`' @click="handleCreate(row)" v-if="row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' && !isAudio">快速创建</el-button>
          <el-button type="text" size="mini" v-np="'COMMON_OPERATE_LOG'" @click="handleLog(row)">操作日志</el-button>
          <el-button 
            type="text" 
            size="mini" 
            :style="{color: row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? '#D9001B' : ''}"
            @click="handleStatusBtn(row)"
            v-np='`MSG_${fetchType(row)}_TEMPLATE_STATUS_UPDATE`'>{{row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? '停用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { asyncMessageTemplatesStatus } from '@/api/message'
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
      }
    },
    data() {
      return {
        currentRow: {},
        loading: false
      }
    },
    methods: {
      // 启用/停用
      handleStatusBtn(row) {
        if (row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON') {
          let str = '短信'
          if (row.templateType === 'SM') {
            str = '短信'
          } else if (row.templateType === 'IM') {
            str = '站内信'
          } else if (row.templateType === 'PM') {
            if (row.pushMediaType === 'MEDIA_TEXT') {
              str = 'PUSH（文字）'
            } else {
              str = 'PUSH（语音）'
            }
          }
          this.$confirm(`停用后，将无法使用该短信模版发送${str}（非已创建的消息队列）？`, '提示', {}).then(() => {
            this.handleStatus(row)
          })
        } else {
          this.handleStatus(row)
        }
      },
      handleStatus(row) {
        asyncMessageTemplatesStatus({
          id: row.id,
          templateStatus: row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? 'MESSAGE_TEMPLATE_STATUS_OFF' : 'MESSAGE_TEMPLATE_STATUS_ON'
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? '停用成功' : '启用成功')
            row.templateStatusDesc = row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? '停用' : '启用'
            row.templateStatus = row.templateStatus === 'MESSAGE_TEMPLATE_STATUS_ON' ? 'MESSAGE_TEMPLATE_STATUS_OFF' : 'MESSAGE_TEMPLATE_STATUS_ON'
          }
        })
      },
      handleCreate(row) {
        this.$router.push({
          path: 'messageAdd',
          query: { id: row.id, type: row.templateType }})
      },
      handleEdit(row) {
        this.$emit('onEdit', row)
      },
      // 查看消息
      handleMessage(row) {
        if (row.templateType === 'SM') {
          this.$router.push({ path: 'messageNoteList', query: { templateCode: row.templateCode }})
        } else if (row.templateType === 'IM') {
          this.$router.push({ path: 'messageMailList', query: { templateCode: row.templateCode }})
        } else if (row.templateType === 'PM' && row.pushMediaType === 'MEDIA_TEXT') {
          this.$router.push({ path: 'messagePushTextList', query: { templateCode: row.templateCode }})
        } else if (row.templateType === 'PM' && row.pushMediaType === 'MEDIA_SOUND') {
          this.$router.push({ path: 'messagePushAudioList', query: { templateCode: row.templateCode }})
        }
      },
      handleLog(row) {
        this.$router.push({
          path: 'messageTemplateLog',
          query: {
            type: row.templateType,
            pushMediaType: row.pushMediaType,
            businessTypeDesc: row.messageTypeDesc,
            templateCode: row.templateCode
          }
        })
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
