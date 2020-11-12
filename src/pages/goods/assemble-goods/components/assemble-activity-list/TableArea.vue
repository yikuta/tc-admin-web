<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="活动编号" prop="activityCode"></el-table-column>
      <el-table-column label="活动名称" prop="activityName"></el-table-column>
      <el-table-column label="拼团城市">
        <template v-slot:default="{row}">{{row.businessCity.provinceName+''+row.businessCity.cityName}}</template>
      </el-table-column>
      <el-table-column label="活动类型" prop="groupActivityType">
        <template v-slot:default="{row}">{{row['groupActivityType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="活动时间">
        <template v-slot:default="{row}">
          <div class="activity-time-style">活动时间</div>
          <div class="activity-time-style">{{ row['activityStartTime'] | format('yyyy-MM-dd HH:mm:ss')}}至{{ row['activityEndTime'] | format('yyyy-MM-dd HH:mm:ss') }}</div>
          <div class="activity-time-style">提货时间</div>
          <div class="activity-time-style">{{ row['cutoff']?`截单后第${row['extractDay']}天`:`活动结束后第${row['extractDay']}天`}}</div>
          <div v-if="row['cutoff']" class="activity-time-style">截单时间</div>
          <div v-if="row['cutoff']" class="activity-time-style">{{`每${row['cutoff']['day']}天${row['cutoff']['time']}点截1次单`}}</div>
        </template>
      </el-table-column>
      <el-table-column label="团长">
        <template v-slot:default="{row}">
          {{row.groupActivityRegimentalType.value===1?'全部团长':(row.regimentNameList || []).slice(0,5).map(item=> item).join(',')}}
          <el-popover v-if="row.regimentNameList && row.regimentNameList.length>5" placement="right" width="800" trigger="click">
            <el-table :data="row.regimentNameList || []">
              <!-- <el-table-column property="regimentalCode" label="团长编号"></el-table-column>
              <el-table-column property="phoneNumber" label="团长账号"></el-table-column>
              <el-table-column property="name" label="姓名"></el-table-column>
              <el-table-column label="所属区域">
                <template v-slot:default="{row}">{{row['province']+row['city']+row['district']}}</template>
              </el-table-column>
              <el-table-column label="详细地址" prop="site"></el-table-column>
              <el-table-column label="加入时间" prop="createTime">
                <template v-slot:default="{row}">{{ row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column label="团长状态">
                <template v-slot:default="{row}">{{row['enable']?'启用':'停用'}}</template>
              </el-table-column>-->

              <!-- 改了字段和数据结构也不说 -->
              <el-table-column label="团长列表">
                <template v-slot:default="{row}">{{row}}</template>
              </el-table-column>
            </el-table>
            <el-link slot="reference" type="primary">更多</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="100"></el-table-column>
      <el-table-column label="活动状态" width="120">
        <template v-slot:default="{row}">{{row['groupActivityStatus'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleCheck(row)" v-np="'GROUP_ACTIVITY_FIND'">查看</el-link>
          <template v-if="row['groupActivityStatus'].value!==4">
            <el-link v-np="'GROUP_ACTIVITY_PAUSE'" type="primary" @click="handleStop(row)" v-if="row['groupActivityStatus'].value!==3">暂停</el-link>
            <el-link v-np="'GROUP_ACTIVITY_RESTART'" type="primary" @click="handleRestart(row)" v-if="row['groupActivityStatus'].value===3">重启</el-link>
          </template>
          <el-link v-np="'GROUP_ACTIVITY_COPY'" type="primary" @click="handleCopy(row)">复制</el-link>
          <el-link v-np="'GROUP_ACTIVITY_EDIT'" type="primary" @click="handleEdit(row)" v-if="row['groupActivityStatus'].value!==2 && row['groupActivityStatus'].value!==4">编辑</el-link>
          <el-link v-np="'GROUP_ACTIVITY_END'" type="primary" @click="handleEnd(row)" v-if="row['groupActivityStatus'].value!==4">结束活动</el-link>
          <el-link type="primary" @click="handleOrder(row)" v-np="'ORDER_PT_LIST'">查看订单</el-link>
          <el-link type="primary" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLog(row)">操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到活动数据！</template>
    </el-table>
    <el-dialog title="暂停活动" :visible.sync="stopDialog" width="30%">
      <span>活动暂停后用户将不能查看商品和提交订单，但不影响已提交订单的后续操作，确定要暂停活动</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopDialog = false">我再想想</el-button>
        <el-button type="primary" @click="handleSureStop">确定暂停</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重启活动" :visible.sync="restartDialog" width="30%">
      <span>重启活动后前端将展示该活动商品且用户可以下单购买，确定要重启活动吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="restartDialog = false">我再想想</el-button>
        <el-button type="primary" @click="handleSureRestart">确定重启</el-button>
      </span>
    </el-dialog>
    <el-dialog title="结束活动" :visible.sync="endDialog" width="30%">
      <span>活动结束后前端将不再展示活动商品和提交订单且不能重启活动，但已提交订单的后续操作不受影响，确定要结束活动吗？~</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endDialog = false">我再想想</el-button>
        <el-button type="primary" @click="handleSureEnd">确定结束</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqUpdateActivityStatus } from '@/api/assembleGoods'
export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      stopDialog: false, // 暂停dialog
      endDialog: false, // 结束活动dialog
      restartDialog: false, // 重启活动dialog
      curRow: null // 当前行
    }
  },
  methods: {
    /**
     * @description: 查看活动
     */
    handleCheck(row) {
      this.$router.push({
        name: 'assembleActivityDetail',
        query: { id: row['id'] }
      })
    },
    /**
     * @description: 暂停
     */
    handleStop(row) {
      this.stopDialog = true
      this.curRow = row
    },
    /**
     * @description: 确定暂停
     */
    handleSureStop() {
      this._reqUpdateActivityStatus(this.curRow.id, 3).then(() => {
        this.stopDialog = false
      })
    },
    /**
     * @description: 重启
     */
    handleRestart(row) {
      this.restartDialog = true
      this.curRow = row
    },
    /**
     * @description: 确定重启
     */
    handleSureRestart() {
      this._reqUpdateActivityStatus(this.curRow.id, 5).then(() => {
        this.restartDialog = false
      })
    },
    /**
     * @description: 结束活动
     */
    handleEnd(row) {
      this.endDialog = true
      this.curRow = row
    },
    /**
     * @description: 确定结束
     */
    handleSureEnd() {
      this._reqUpdateActivityStatus(this.curRow.id, 4).then(() => {
        this.endDialog = false
      })
    },
    /**
     * @description: 查看订单
     */
    handleOrder(row) {
      this.$router.push({
        name: 'productPreSale',
        query: {
          code: row.activityCode
        }
      })
    },
    /**
     * @description: 查看操作日志
     */
    handleCheckLog(row) {
      this.$router.push({
        name: 'assembleActivityLog',
        query: { id: row['id'] }
      })
    },
    /**
     * @description: 复制
     */
    handleCopy(row) {
      this.$router.push({
        name: 'publishAssembleActivity',
        query: {
          id: row.id,
          cp: 1
        }
      })
    },
    /**
     * @description: 编辑
     */
    handleEdit(row) {
      if (row['groupActivityStatus'] && row['groupActivityStatus'].value !== 1 && row['groupActivityStatus'].value !== 3) {
        this.$confirm('只能编辑未开始或已经暂停的活动', '提示', {
          cancelButtonText: '关闭',
          showConfirmButton: false
        }).catch(() => {})
      } else {
        this.$router.push({
          name: 'publishAssembleActivity',
          query: {
            id: row.id
          }
        })
      }
    },
    /**
     * @description: 更新活动状态
     */
    _reqUpdateActivityStatus(activityId, status) {
      return reqUpdateActivityStatus({
        activityId,
        status
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$emit('on-search')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .info-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    /deep/ .el-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      margin-right: 5px;
    }
    .text-info {
      .text-info-child {
        display: flex;
        flex-direction: row;
        div:first-child {
          flex-shrink: 0;
          margin-right: 5px;
        }
      }
    }
  }
  .action-area {
    margin-top: 15px;
    float: left;
  }
  .activity-time-style {
    text-align: start !important;
  }
}
</style>
<style lang='scss'>
.setting-model-style {
  width: 900px;
  max-height: 700px;
}
</style>
