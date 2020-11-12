<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="注销原因" width="250">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>原因：</span>
            <span>{{formatNoneValue(row['applyReason'])}}</span>
          </div>
          <div class="text-style">
            <span>详细说明：</span>
            <span class="short" :title="row['applyDetails']">{{formatNoneValue(row['applyDetails'])}}</span>
          </div>
          <div>
            <el-image v-for="(item, index) in  row.applyImgs" :key="index" style="width: 60px; height: 60px; margin-right:4px" class="shopName" :src="item" :preview-src-list="row.applyImgs"></el-image>
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
            <span>门店名称：</span>
            <span>{{formatNoneValue(row['name'])}}</span>
          </div>
          <div class="text-style">
            <span>类型：</span>
            <span>{{formatNoneValue(row['shopTypeValue'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店地址">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>门店地址：</span>
            <span>{{formatAddressArea(row['provinceName'],row['cityName'],row['districtName'])}}</span>
          </div>
          <div class="text-style">
            <span>详细地址：</span>
            <span>{{formatNoneValue(row['address'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店负责人" width="180">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>负责人：</span>
            <span>{{formatNoneValue(row['managerName'])}}</span>
          </div>
          <div class="text-style">
            <span>负责人电话：</span>
            <span>{{formatNoneValue(row['managerTel'])}}</span>
          </div>
          <div class="text-style">
            <span>登录账号：</span>
            <span>{{formatNoneValue(row['bossAccount'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="负责运维">
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
      <el-table-column label="申请人" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['applyOperator'])}}</span>
          </div>
          <div class="text-style">
            <span>申请日期：</span>
            <span>{{formatNoneValue(row['createTime'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <div slot-scope="{row}">
          <div :style="{color: row['auditStatus'] === 0 ? '#FF0000' : ''}">{{formatAuditStatus(row['auditStatus'])}}</div>
          <div v-if="row['auditStatus']===2">
            <span>驳回原因：</span>
            <span>{{formatNoneValue(row['auditReason'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="审核人" v-if="activeTab==='1'" width="180">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['auditOperator'])}}</span>
          </div>
          <div class="text-style">
            <span>日期：</span>
            <span>{{row['updateTime']}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="150px" v-if="activeTab==='0'">
        <template v-slot:default="{ row }">
          <el-link class="btnText" type="primary" @click="handleCheckDetail(row)">查看详情</el-link>
          <el-link class="btnText" type="primary" @click="handlePass(row.shopCode)">通过</el-link>
          <el-link class="btnText" type="primary" @click="handleReject(row.shopCode)">拒绝</el-link>
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
    this.formatAddressArea = (provinceName, cityName, districtName) => {
      if (!provinceName && !cityName && !districtName) {
        return '-'
      }
      return `${provinceName}-${cityName}-${districtName}`
    }
    this.formatAuditStatus = auditStatus => {
      const status = {
        '2': '被驳回',
        '1': '审核通过',
        '0': '待审核'
      }
      return status[auditStatus] || '-'
    }
    return {}
  },
  methods: {
    /**
     * @description: 审核通过
     */
    handlePass(code) {
      const h = this.$createElement
      this.$msgbox({
        title: '确定注销？',
        message: h(
          'div',
          null,
          [h('span', { style: 'color: #FF0000' }, '通过注销后不能恢复，请谨慎操作！')]
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
        confirmButtonText: '通过',
        cancelButtonText: '取消'
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
    handleCheckDetail(row) {
      this.$router.push({
        path: 'shopDetail?code=' + row.shopCode
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
  .short{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .shopName{
    margin-top: 6px;
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
