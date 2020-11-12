<template>
  <div class="app-container">
    <!-- <create-card></create-card> -->
    <search-bar ref="search" @on-search="onSearch" class="search-bar"></search-bar>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="groupBuyActivityCode" label="活动编码"></el-table-column>
      <el-table-column prop="groupBuyActivityName" label="活动名称"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.channelCommodityImage" style="width:100px;" alt="" srcset="">
        </template>
      </el-table-column>
      <el-table-column prop="channelCommodityName" label="拼团商品"></el-table-column>
      <el-table-column label="拼团价">
        <template slot-scope="scope">
          {{ scope.row.groupBuyPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="initiatorCount" label="发起用户"></el-table-column>
      <el-table-column prop="participantCount" label="参与用户"></el-table-column>
      <el-table-column prop="accomplishGroupCount" label="成团数"></el-table-column>
      <el-table-column prop="groupBuyActivityTimeList" label="生效时间" width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.groupBuyActivityTimeList[0]}}</div>
          <div>至</div>
          <div>{{scope.row.groupBuyActivityTimeList[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="驳回原因"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="addAudit(row)" v-show="row.status.value == 10 || row.status.value == 40" v-np="'ACTIVITY_FOR_GROUP_BUY_SUBMIT'">提交审核</el-link>
          <el-link type="primary" @click="edit(row)" v-show="row.status.value == 10 || row.status.value == 40" v-np="'ACTIVITY_FOR_GROUP_BUY_UPDATE'">编辑</el-link>
          <el-link type="primary" @click="del(row)" v-show="row.status.value == 10 || row.status.value == 20 || row.status.value == 40" v-np="'ACTIVITY_FOR_GROUP_BUY_DELETE'">删除</el-link>
          <el-link type="primary" @click="invalid(row)" v-show="row.status.value == 25 || row.status.value == 30 || row.status.value == 50 || row.status.value == 60" v-np="'ACTIVITY_FOR_GROUP_BUY_DISCARD'">作废</el-link>
          <el-link type="primary" @click="copy(row)">复制</el-link>
          <el-link type="primary" @click="showDetail(row)" v-np="'ACTIVITY_FOR_GROUP_BUY_VIEW'">查看</el-link>
          <el-link type="primary" @click="$router.push({ path: '/active/shopping/group_booking_launch', query: { id: row.id, version: row.version }})" v-np="'ACTIVITY_GROUP_BUY_START_RECORD_VIEW'">发起记录</el-link>
          <el-link type="primary" @click="$router.push({ path: '/active/shopping/group_booking_participate', query: { id: row.id, version: row.version }})" v-np="'ACTIVITY_GROUP_BUY_JOINED_RECORD_VIEW'">参与记录</el-link>
          <el-link type="primary" @click="log(row)" v-np="'COMMON_OPERATE_LOG'">操作日志</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- <show-selected ref="showSelected" :showType="showType" :item="clickTableItem"></show-selected> -->
    <show-selected ref="showSelected"></show-selected>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import searchTool from '@/utils/searchTool'
  import { reqGroupBuyActivityList, reqGroupBuyActivityQueue, reqGroupBuyActivitySubmitAudit } from '@/api/coupon'
  import option from './json/option.json'
  import CreateCard from './templates/create-card'
  import SearchBar from './templates/search'
  import ShowSelected from './templates/show-selected'
  export default {
    name: 'couponIndex',
    components: {
      CreateCard,
      SearchBar,
      Pagination,
      ShowSelected
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        pagePhase: [10, 20, 30, 50]
        // showType: '',
        // clickTableItem: {}
      }
    },
    filters: {
      type(value) {
        return option.type.filter(o => o.id === value)[0]['value']
      },
      term(value) {
        return option.term.filter(o => o.id === value)[0]['value']
      },
      work(value) {
        return option.work.filter(o => o.id === value)[0]['value']
      },
      status(value) {
        return option.status.filter(o => o.id === value)[0]['value']
      }
    },
    created() {
      this.$nextTick(() => {
        // 获取商品商品列表
        this.onSearch()
      })
    },
    methods: {
      onSearch() {
        // 查询
        let req = searchTool(JSON.parse(JSON.stringify(this.$refs['search'].form)))
        this._reqGroupBuyActivityList(req)
      },
      addAudit(item) {
        // 提交审核
        this.$confirm('提交审核后不能编辑活动，是否提交审核', '提交审核', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        }).then(() => {
          // 执行提交审核请求
          this._reqGroupBuyActivitySubmitAudit(item.id, 1)
        }).catch(() => {
        })
      },
      edit(item) {
        let query = {
          type: 'edit',
          version: item.version,
          groupBuyActivityCode: item.groupBuyActivityCode
        }
        this.$router.push({ path: '/active/shopping/group_booking_form_edit', query: query })
      },
      copy(item) {
        let query = {
          type: 'copy',
          version: item.version,
          groupBuyActivityCode: item.groupBuyActivityCode
        }
        this.$router.push({ path: '/active/shopping/group_booking_form_copy', query: query })
      },
      showDetail(item) {
        let query = {
          type: 'show',
          version: item.version,
          groupBuyActivityCode: item.groupBuyActivityCode
        }
        this.$router.push({ path: '/active/shopping/group_booking_form_show', query: query })
      },
      del(item) {
        this.$confirm('活动删除后无法恢复，请确认是否删除', '优惠券删除', {
          confirmButtonText: '删除',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          this._reqGroupBuyActivityQueue(item.id)
        })
      },
      // 操作日志
      log(row) {
        let query = {
          groupBuyActivityName: row.groupBuyActivityName,
          groupBuyActivityCode: row.groupBuyActivityCode,
          channelCommodityName: row.channelCommodityName,
          groupBuyPrice: row.groupBuyPrice
        }
        this.$router.push({ path: '/active/shopping/group_log', query })
      },
      invalid(item) {
        // 作废
        this.$confirm('活动作废后，已生成的订单优惠不变，是否确认作废', '活动作废', {
          confirmButtonText: '作废',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          // 执行提交审核请求
          this._reqGroupBuyActivitySubmitAudit(item.id, 2)
        }).catch(() => {
        })
      },
      // ***请求处理***
      _reqGroupBuyActivityList(data) {
        return reqGroupBuyActivityList({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              this.currentPage = result.pageNo
              this.totalCount = result.totalCount
              this.tableData = result.itemVOs || []
            }
          })
          .catch(() => {
          })
      },
      // 删除
      _reqGroupBuyActivityQueue(data) {
        return reqGroupBuyActivityQueue(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.onSearch()
          }
        })
      },
      // 提交审核请求
      _reqGroupBuyActivitySubmitAudit(groupBuyActivityId, status) {
        return reqGroupBuyActivitySubmitAudit({
          groupBuyActivityId: groupBuyActivityId,
          status: status
        })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.onSearch()
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
            }
          })
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.onSearch()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.onSearch()
      },
      showItemSelected(type, item) {
        // this.showType = type
        // this.clickTableItem = item
        // this.clickTableItemOptionalType = 'TYPE'
        this.$refs.showSelected.showDialog(type, item)
      },
      fullGiveCouponRule(rule) {
        let arr = []
        rule.fullGiveItemForDisCountList.map((item) => {
          if (rule.deductionUnitType.value === 1) {
            arr.push('满' + item.satisfyMoney + '元 赠' + item.couponCode + item.couponName + rule.giftType.describe + ' x ' + item.userSingleCount)
          } else {
            arr.push('满' + item.satisfyPiece + '件 赠' + item.couponCode + item.couponName + rule.giftType.describe + ' x ' + item.userSingleCount)
          }
        })
        return arr
      },
      getBusinessTypeList(list) {
        let text = ''
        list.map((item) => {
          text += item.describe + ' '
        })
        return text
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-bar{margin:20px 0;}
</style>
