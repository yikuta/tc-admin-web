<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini" max-height="500">
      <el-table-column prop="province" label="省"></el-table-column>
      <el-table-column prop="city" label="市"></el-table-column>
      <el-table-column prop="area" label="区"></el-table-column>
      <el-table-column prop="edifice" label="小区/大厦"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="consignee" label="收货人"></el-table-column>
      <el-table-column prop="consigneePhone" label="收货人电话"></el-table-column>
    </el-table>
    <pagination :current="curPage" :total="total" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchMemberAddressList } from '@/api/user'
import { MatchType, DataType } from '@/constants/search'
import searchTool from '@/utils/searchTool'
export default {
  name: 'AddressTable',
  components: { Pagination },
  props: {
    memberCode: String
  },
  data() {
    return {
      tableData: [],
      curPage: 1,
      total: 0,
      pageSize: 20,
      form: {
        memberCode: { value: '', name: 'member.memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING }
      }
    }
  },
  watch: {
    memberCode: {
      handler: function(newVal) {
        if (newVal) {
          this.getAddressList()
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * @description: 获取地址列表
     * @param {type}
     */
    getAddressList() {
      this.form.memberCode.value = this.memberCode
      let searchs = searchTool(this.form)
      fetchMemberAddressList({
        pageNo: this.curPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: JSON.stringify(searchs)
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.result ? res.result.itemVOs || [] : []
          this.total = res.result.totalCount
        } else {
          this.tableData = []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
