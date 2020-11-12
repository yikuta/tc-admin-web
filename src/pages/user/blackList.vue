<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields" :isBlack='true' @setting='onSetting' @onSearch='onSearch'>
      <search ref="searchForm" />
    </search-area>
    <content-area contentTitle="灰黑名单信息列表">
      <table-area :tableData="tableData.data" @remove='handleRemove'/>
      <pagination
        :current="tableData.pageNo"
        :total="tableData.total"
        :page-size='tableData.pageSize'
        @onPageChange='handlePageChange'
        @onSizeChange='handleSizeChange'
      />
    </content-area>
    <add-list :visible.sync="visible" :type="type"/>
  </div>
</template>

<script>
import { Common, BlackList } from './components'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { fetchBlackList, asyncBlackRemove } from '@/api/user'
export default {
  name: 'blackList',
  components: { ...Common, ...BlackList, Pagination },
  data() {
    return {
      dataList: [
        {
          name: '青椒肉丝',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '青椒肉丝',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '青椒肉丝',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '青椒肉丝',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '青椒肉丝',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        }
      ],
      tableData: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
        data: []
      },
      visible: false,
      type: '1'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.onSearch()
      })
    } else {
      next()
    }
  },
  activated() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['searchForm'].form))
      this.handleDataList(searchTool(req))
    },
    handleDataList(form) {
      fetchBlackList({
        searchs: JSON.stringify(form),
        pageNo: this.tableData.pageNo,
        pageSize: this.tableData.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs || []
          this.tableData.total = res.result.totalCount
        }
      })
    },
    handlePageChange(page) {
      this.tableData.pageNo = page
      this.onSearch()
    },
    handleSizeChange(size) {
      this.tableData.pageNo = 1
      this.tableData.pageSize = size
      this.onSearch()
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
    },
    onSetting(type) {
      this.type = type
      this.visible = true
    },
    handleRemove(obj) {
      asyncBlackRemove(obj).then(res => {
        if (res.code === 200) {
          this.$message.success('移除成功')
          this.onSearch()
        }
      }).catch(() => {
        this.$message.error('移除失败')
      })
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
}
</style>