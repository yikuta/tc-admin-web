<template>
  <div class="app-container">
    <div class="head">{{info}}</div>
    <el-row style="margin-bottom:50px">
      <el-col :span="7" :offset="1">消息类型：{{$route.query.businessTypeDesc}}</el-col>
      <el-col :span="16" v-if="$route.query.type !== 'PM-SOUND'">模版编号：{{$route.query.templateCode}}</el-col>
    </el-row>
    <table-area :tableData='dataList'/>
    <pagination
      :current="currentPage"
      :total="totalCount"
      :pageSize="pageSize"
      @onPageChange="onPageChange"
      @onSizeChange="onSizeChange"
    />
  </div>
</template>
<script>
import TableArea from './templates/TableArea'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { MatchType, DataType } from '@/constants/search'
import { fetchMessageLogList } from '@/api/message'
export default {
  components: {
    TableArea,
    Pagination
  },
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0
    }
  },
  mounted() {
    this.handleDataList()
  },
  computed: {
    info() {
      if (this.$route.query.type === 'SM') {
        return '短信模板信息'
      } else if (this.$route.query.type === 'IM') {
        return '站内信模板信息'
      } else if (this.$route.query.type === 'PM') {
        if (this.$route.query.pushMediaType === 'MEDIA_SOUND') {
          return 'push消息（语音）模板信息'
        } else {
          return 'push消息（文字）模板信息'
        }
      }
    }
  },
  methods: {
    handleDataList() {
      let obj = {
        templateCode: { value: this.$route.query.templateCode, name: 'templateCode', matchType: MatchType.EQUAL, type: DataType.NUMBER }
      }
      const searches = searchTool(deepClone(obj))
      fetchMessageLogList({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: this.$route.query.type,
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
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
<style lang="scss" scoped>
.head{
  margin-bottom: 20px;
}
</style>