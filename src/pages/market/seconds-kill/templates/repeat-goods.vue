<template>
  <div>
    <el-dialog title="商品已存在其他活动中" :visible.sync="dialogVisible" width="75%" :close-on-click-modal="false">
      <div>以下商品已经设置了其他活动，不支持重复添加，请核对后重新添加</div>
      <el-table :data="tableData" ref="multipleAddedTable" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
        <el-table-column label="商品编码" prop="channelCommodityNo"></el-table-column>
        <el-table-column label="商品名称" prop="channelCommodityName" width="400"></el-table-column>
        <el-table-column label="冲突内容" prop="seckillLaunchRepeatType" width="400">
          <template slot-scope="scope">
            <span>{{scope.row.seckillLaunchRepeatType | seckillLaunchRepeatTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleShow(scope.row)">点击查看</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">移 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { MatchType, DataType } from '@/constants/search'
// import searchTool from '@/utils/searchTool'
// import { reqCategoryAll } from '@/api/coupon'
// import { reqGoodsList } from '@/api/coupon'
import Pagination from '@/components/Pagination'
let that = null
export default {
  name: 'select-dialog',
  components: {
    Pagination
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    repeatData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      typeOptions: [
        { type: 'SESSION', name: '秒杀场次' },
        { type: 'LAUNCH', name: '秒杀投放' },
        { type: 'GROUP_BUY_ACTIVITY', name: '拼团活动' }
      ]
    }
  },
  filters: {
    seckillLaunchRepeatTypeFilter(val) {
      let type = ''
      that.typeOptions.map((item) => {
        if (item.type === val) {
          type = item.name
        }
      })
      return type
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.totalCount = this.repeatData.length
    this.setData()
  },
  mounted() {
    // this._reqCategoryAllOne()
    // this._reqCategoryAllTwo()
  },
  methods: {
    setData() {
      let data = JSON.parse(JSON.stringify(this.repeatData))
      this.tableData = data.splice(this.currentPage - 1, this.pageSize)
    },
    handleShow(row) {
      let routeUrl = {}
      if (row.seckillLaunchRepeatType === 'SESSION') {
        routeUrl = this.$router.resolve({
          path: '/active/secondsKill/session_detail',
          query: {
            timePeriod: row.seckillSessionTimePeriod,
            day: row.seckillSessionDay,
            seckillSessionCode: row.seckillSessionCode
          }
        })
      } else if (row.seckillLaunchRepeatType === 'LAUNCH') {
        routeUrl = this.$router.resolve({
          path: '/active/secondsKill/show',
          query: {
            type: 'show',
            version: row.seckillLaunchVersion,
            seckillLaunceCode: row.seckillLaunchCode
          }
        })
      } else if (row.seckillLaunchRepeatType === 'GROUP_BUY_ACTIVITY') {
        routeUrl = this.$router.resolve({
          path: '/active/shopping/group_booking_form_show',
          query: {
            type: 'show',
            version: row.groupBuyActivityVersion,
            groupBuyActivityCode: row.groupBuyActivityCode
          }
        })
      }
      window.open(routeUrl.href, '_blank')
    },
    onPageChange(page) {
      this.currentPage = page
      this.setData()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.setData()
    },
    save() {
      // 保存已选商品
      this.$emit('on-del-repeat-goods')
    },
    cancel() {
      // this.dialogBeforeClose()
      this.$emit('on-close-dialog')
    },
    dialogBeforeClose() {
      this.$emit('on-close-dialog')
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 33%;
  }
}
/deep/ .input-width {
  width: 200px;
}
/deep/ .el-dialog__body{
  padding: 0 20px;
  .el-card__body {
    padding: 10px 20px;
  }
  .pagination {
    padding: 10px 0 0;
  }
}
.search-btn {
  text-align: right;
}
</style>
