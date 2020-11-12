<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" v-if="activeTab==='0'" key="shopCode"></el-table-column>
      <el-table-column label="修改后信息" width="250">
        <div slot-scope="{row}">
          <div>
            <el-image style="width: 100px; height: 100px" :src="row['shopSign']" :preview-src-list="[row['shopSign']]"></el-image>
          </div>
          <div class="text-style shopName">
            <span>名称：</span>
            <span>{{formatNoneValue(row['name'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="修改前信息" width="250">
        <div slot-scope="{row}">
          <div>
            <el-image style="width: 100px; height: 100px" :src="row['originalShopSign']" :preview-src-list="[row['originalShopSign']]"></el-image>
          </div>
          <div class="text-style shopName">
            <span>名称：</span>
            <span>{{formatNoneValue(row['originalName'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店信息">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>门店编码：</span>
            <span>{{formatNoneValue(row['shopCode'])}}</span>
          </div>
          <div class="text-style">
            <span>登录账号：</span>
            <span>{{formatNoneValue(row['bossAccount'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店负责人" width="180">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>负责人电话：</span>
            <span>{{formatNoneValue(row['managerTel'])}}</span>
          </div>
          <div class="text-style">
            <span>负责人：</span>
            <span>{{formatNoneValue(row['managerName'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <div slot-scope="{row}">
          <div :style="{color: row['status'] === 0 ? '#FF0000' : ''}">{{formatAuditStatus(row['status'])}}</div>
          <div v-if="row['status']===2">
            <span>原因：</span>
            <span>{{formatNoneValue(row['auditInfo'])}}</span>
          </div>
          <div class="text-style">
            <span>申请日期：</span>
            <span>{{formatNoneValue(row['createTime'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="审核人" width="180" v-if="activeTab==='1'" key="auditPeople">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['operationName'])}}</span>
          </div>
          <div class="text-style">
            <span>日期：</span>
            <span>{{row['updateTime']}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="120" v-if="activeTab==='0'" key="control">
        <template v-slot:default="{ row }">
          <el-link class="btnText" type="primary" @click="$emit('audit', row.shopCode, 1)">通过</el-link>
          <el-link class="btnText" type="primary" @click="handleReject(row.shopCode, false)">拒绝</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AuditReject from './AuditReject'

export default {
  name: 'AuditTable',
  components: { AuditReject },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    this.formatAuditStatus = auditStatus => {
      const status = {
        '1': '审核通过',
        '2': '被驳回',
        '0': '待审核'
      }
      return status[auditStatus] || '-'
    }
    return {
      multipleSelection: []
    }
  },
  methods: {
    /**
     * @description: 审核通过
     */
    handlePass(code) {
      const h = this.$createElement
      this.$msgbox({
        title: '确定通过？',
        message: h(
          'div',
          {
            style: {
              color: 'red'
            }
          },
          '确定批量通过？'
        ),
        showCancelButton: true,
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done()
        }
      })
        .then(() => {
          this.$emit('audit', code, 1)
        })
        .catch(() => {
          return
        })
    },
    /**
     * @description: 审核拒绝
     */
    handleReject(code, isBatch) {
      const h = this.$createElement
      this.$msgbox({
        customClass: 'audit-reject-model',
        title: isBatch ? '确定批量驳回？' : '确定驳回此记录？',
        message: h(
          'AuditReject',
          {
            ref: 'auditReject'
          },
          null
        ),
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定'
        // beforeClose: (action, instance, done) => {
        //   if (this.$refs['auditReject']) this.$refs['auditReject'].$refs['form'].resetFields()
        //   done()
        // }
      })
        .then(() => {
          const { reason, detail } = this.$refs['auditReject'].form
          if (reason === '其他') {
            this.$emit('audit', code, 2, detail)
          } else {
            this.$emit('audit', code, 2, reason)
          }
          if (this.$refs['auditReject']) this.$refs['auditReject'].$refs['form'].resetFields()
        })
        .catch(() => {
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description: 批量修改门店状态
     */
    handleEditBusiness(status) {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message('请至少选择一项')
        return
      }
      let codeList = this.multipleSelection.map(item => item.shopCode) || []
      if (status === '1') {
        this.handlePass(codeList)
      } else {
        this.handleReject(codeList, true)
      }
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
  .btnText::after{
    border: 0;
  }
}
</style>
<style lang="scss">
.audit-reject-model {
  width: 500px;
}
</style>
