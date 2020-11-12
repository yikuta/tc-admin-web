<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" :selectable="checkSelectable"></el-table-column>
      <el-table-column label="门店信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>编码：</span>
            <span>{{formatNoneValue(row['shopCode'])}}</span>
          </div>
          <div class="text-style">
            <span>名称：</span>
            <span>{{formatNoneValue(row['name'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="账号信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>类型：</span>
            <span>{{formatNoneValue(row['shopTypeValue'])}}</span>
          </div>
          <div class="text-style">
            <span>登录账号：</span>
            <span>{{formatNoneValue(row['bossAccount'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="地址" width="300">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>区域：</span>
            <span>{{formatAddressArea(row['provinceName'],row['cityName'],row['districtName'])}}</span>
          </div>
          <div class="text-style">
            <span>地址：</span>
            <span>{{formatNoneValue(row['address'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="负责人" width="150">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['managerName'])}}</span>
          </div>
          <div class="text-style">
            <span>电话：</span>
            <span>{{formatNoneValue(row['managerTel'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="负责运维" align="center">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['operationName'])}}</span>
          </div>
          <div class="text-style">
            <span>电话：</span>
            <span>{{formatNoneValue(row['operationTel'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="注册信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>来源：</span>
            <span>{{formatNoneValue(row['bossType'] === 1?'商家App':'中台')}}</span>
          </div>
          <div class="text-style">
            <span>入驻时间：</span>
            <span>{{row['enterTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店状态" align="center">
        <div slot-scope="{row}">
          <div>{{formatAuditStatus(row['shopStatus'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="平台服务费" align="fee">
        <div slot-scope="{row}">
          <div>{{(row['fee'] || row['fee'] === 0) ? row['fee'] + '%' : '-'}}</div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot:default="{ row, column }">
          <span class="btnText" @click="handleCheckDetail(row, column)">查看详情</span>
          <span class="btnText" @click="handleModifyShop(row)">修改门店信息</span>
          <span class="btnText" @click="handleChangeStatus(row)" style="width:56px;text-align:left;display:inline-block" v-if="row['shopStatus'] != 3">{{(row['shopStatus'] === 1?'禁用':'启用')}}</span>
          <span class="btnText" @click="handleModifyShopName(row)">修改门店名称</span>
          <span class="btnText" @click="handleFetchCode(row)">预览门店二维码</span>
          <span class="btnText" @click="handleOperationLog(row, column)">操作日志</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="480px"
      @close="dialogVisible = false; form = {}">
      <div v-loading='loading'>
        <div style="margin-bottom:16px">门店名称：{{form.name}}</div>
        <div style="text-align:center">
          <img :src="form.img" alt="" style="width:200px">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BusinessManage from './BusinessManage'
import BatchBusiness from './BatchBusiness'
import ServiceFee from './ServiceFee'
import BatchDevops from './BatchDevops'
import { fetchShopCode } from '@/api/seller'
export default {
  name: 'TableArea',
  components: { BusinessManage, BatchBusiness, BatchDevops, ServiceFee },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.formatAddressArea = (province, city, district) => {
      if (!province && !city && !district) {
        return '-'
      }
      return `${province}-${city}-${district}`
    }
    this.formatAuditStatus = auditStatus => {
      const status = {
        0: '待审核',
        1: '已启用',
        2: '已禁用',
        3: '销店中'
      }
      return status[auditStatus] || '-'
    }
    return {
      multipleSelection: [],
      checkSelectable: (row) => {
        return row.shopStatus !== 3
      },
      dialogVisible: false,
      form: {},
      loading: false
    }
  },
  methods: {
    handleCheckDetail(row) {
      this.$router.push({
        path: 'shopDetail?code=' + row.shopCode
      })
    },
    handleOperationLog(row) {
      this.$router.push({
        path: 'operationLog',
        query: { name: row.name, code: row.shopCode }
      })
    },
    // 修改门店信息
    handleModifyShop(row) {
      this.$router.push({
        path: 'modifyShop?code=' + row.shopCode
      })
    },
    // 修改门店名称
    handleModifyShopName(row) {
      this.$router.push({
        path: 'modifyShopName?code=' + row.shopCode
      })
    },
    /**
     * @description: 修改门店状态
     */
    handleChangeStatus(row) {
      this.$confirm(`您所选择的门店将执行${row.shopStatus === 1 ? '禁用' : '启用'}操作，确定要启用此门店吗？`, `${row.shopStatus === 1 ? '禁用' : '启用'}`, {
        confirmButtonText: `确定${row.shopStatus === 1 ? '禁用' : '启用'}`,
        cancelButtonText: '我再想想'
      })
        .then(() => {
          this.$emit('update-shop-status', row.shopCode, row.shopStatus)
        })
        .catch(() => {})
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    /**
     * @description: 下载二维码
     */
    handleDownloadQrCode() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message('请至少选择一项')
        return
      }
      this.$emit('update-download-qr-code', this.multipleSelection)
    },
    /**
     * @description: 设置平台服务费
     */
    handleSetService() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message('请至少选择一项')
        return
      }
      const h = this.$createElement
      this.$msgbox({
        title: '平台服务费',
        message: h(
          'ServiceFee',
          {
            ref: 'serviceFee'
          },
          null
        ),
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '保存',
        beforeClose: (action, instance, done) => {
          // if (this.$refs['batchBusiness']) this.$refs['batchBusiness'].$refs['form'].resetFields()
          done()
        }
      })
        .then(() => {
          const { free } = this.$refs['serviceFee'].$refs['form'].model
          if (free || free === 0) {
            this.$emit('update-set-service-free', this.multipleSelection, free)
            if (this.$refs['serviceFee']) this.$refs['serviceFee'].$refs['form'].resetFields()
          } else {
            this.$message('请填写服务费！')
          }
        })
        .catch(() => {
        })
    },
    /**
     * @description: 批量修改门店状态
     */
    handleEditBusiness() {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message('请至少选择一项')
        return
      }
      const h = this.$createElement
      this.$msgbox({
        title: '批量修改门店状态',
        message: h(
          'BatchBusiness',
          {
            ref: 'batchBusiness'
          },
          null
        ),
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '保存',
        beforeClose: (action, instance, done) => {
          // if (this.$refs['batchBusiness']) this.$refs['batchBusiness'].$refs['form'].resetFields()
          done()
        }
      })
        .then(() => {
          const { status } = this.$refs['batchBusiness'].$refs['form'].model
          if (status) {
            this.$emit('update-batch-shop-status', this.multipleSelection, status)
            if (this.$refs['batchBusiness']) this.$refs['batchBusiness'].$refs['form'].resetFields()
          } else {
            this.$message('请选择状态')
          }
        })
        .catch(() => {
        })
    },
    // 预览门店二维码
    handleFetchCode(row) {
      this.dialogVisible = true
      this.loading = true
      fetchShopCode(row.shopCode).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.form = {
            name: res.result.name,
            img: 'data:image/jpg;base64, ' + res.result.data
          }
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .text-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    span:first-child {
      flex-shrink: 0;
    }
  }
  .btnText{
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
    &:hover{
      color: #66b1ff;
    }
  }
}
</style>
