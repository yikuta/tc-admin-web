<template>
  <div class="app-container">
    <el-dialog title="发送查看" :visible="visible" @update:visible="onChange" width="960px" @close='onChange(false)'>
      <div class="radio-group">
        <el-row>
          <el-col :span="12">
            <el-radio-group v-model="radio" @change="handleDataList">
              <el-radio-button label="waitSend">未发送</el-radio-button>
              <el-radio-button label="sendSucceed">已发送</el-radio-button>
              <el-radio-button label="sendIng" v-if="type === 'SM'">发送中</el-radio-button>
              <el-radio-button label="fail">发送失败</el-radio-button>
            </el-radio-group>
          </el-col>
          <!-- <el-col :span="12">
            <span style="line-height:40px">已发送或发送失败共3条</span>
          </el-col>  -->
        </el-row>
      </div>
      <search ref="search">
        <el-button type="primary" size="mini" @click="handleDataList">搜索</el-button>
      </search>
      <table-area :tableData="dataList" @send='handleSend' :status='radio'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
      <div slot="footer" style="text-align:center">
        <slot name="footer">
          <el-button 
            type="primary" 
            @click="handleSendAll" 
            size="mini" 
            :disabled="dataList.length === 0"
            v-if="radio === 'waitSend' || radio === 'fail'">发送全部{{radio === 'waitSend'?'未发送':'失败'}}消息</el-button>
          <el-button @click="onChange(false)" size="mini">关闭</el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Search from './SearchCard'
  import TableArea from './TableArea'
  import Pagination from '@/components/Pagination'
  import searchTool from '@/utils/searchTool'
  import { deepClone } from '@/utils/util'
  import { MatchType, DataType } from '@/constants/search'
  import { fetchMessageSendLog, asyncMessageTaskStatus } from '@/api/message'
  export default {
    name: 'AddDialog',
    components: {
      Search,
      TableArea,
      Pagination
    },
    props: {
      visible: Boolean,
      type: String,
      pushMediaType: {
        type: String,
        default: () => ''
      },
      id: {
        type: Number,
        default: () => 0
      }
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        dataList: [],
        radio: 'waitSend'
      }
    },
    watch: {
      visible(n) {
        if (n) {
          this.handleDataList()
        }
      }
    },
    methods: {
      handleDataList() {
        let obj = {
          enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
          taskId: { value: this.id, name: 'taskId', matchType: MatchType.EQUAL, type: DataType.STRING },
          sendStatus: { value: this.radio, name: 'sendStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
          pushMediaType: { value: this.pushMediaType, name: 'pushMediaType', matchType: MatchType.EQUAL, type: DataType.STRING }
        }
        const searches = searchTool(deepClone(Object.assign((this.$refs['search'] ? this.$refs['search'].form : {}), obj)))
        fetchMessageSendLog({
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc',
          templateType: this.type,
          searchs: searches.length ? JSON.stringify(searches) : null
        }).then(res => {
          if (res.code === 200) {
            this.dataList = res.result.itemVOs
            this.totalCount = res.result.totalCount
          }
        })
      },
      onChange(visible) {
        if (!visible) {
          this.$refs['search'].$refs['form'].resetFields()
          this.radio = 'waitSend'
        }
        this.$emit('update:visible', visible)
      },
      handleSend({ id, taskId, operatorType }) {
        asyncMessageTaskStatus({
          id: taskId,
          detailId: id,
          operatorType,
          templateType: this.type
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.handleDataList()
          }
        })
      },
      handleSendAll() {
        asyncMessageTaskStatus({
          id: this.id,
          operatorType: this.radio === 'waitSend' ? 'SEND' : 'RETRY_SEND',
          templateType: this.type
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.onChange(false)
          }
        })
      },
      onPageChange(page) {
        this.currentPage = page
        this.handleDataList()
      },
      onSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.handleDataList()
      }
    }
  }
</script>

<style lang='scss' scoped>
.tip{
  color: #AAAAAA;
  font-size: 12px;
  p{
    margin: 0;
    padding: 0;
  }
  .head{
    margin-left: 25px;
  }
  ul{
    padding-left: 25px;
    li{
      list-style: none;
      margin-top: 10px;
    }
  }
}
</style>
