<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini">
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
      <el-table-column label="注册信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>来源：</span>
            <span>{{formatNoneValue(row['bossType'] === 1 ? '商家App' : '中台')}}</span>
          </div>
          <div class="text-style">
            <span>提交时间：</span>
            <span>{{row['createTime']}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="状态">
        <div slot-scope="{row}">
          <div>{{formatAuditStatus(row['enterStatus'])}}</div>
          <div v-if="row['enterStatus']===6">
            <span>原因：</span>
            <span>{{formatNoneValue(row['auditDesc'])}}</span>
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
            <span>{{row['enterTime']}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row, column }">
          <el-link class="btnText" type="primary" @click="handleCheckDetail(row)">查看详情</el-link>
          <el-link class="btnText" type="primary" v-if="activeTab==='2'" @click="handleAdd(row)">继续入驻</el-link>
          <el-link class="btnText" v-if="activeTab==='0'" type="primary" @click="handlePass(row, column)">通过</el-link>
          <el-link class="btnText" v-if="activeTab==='0'" type="primary" @click="handleReject(row, column)">拒绝</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AuditReject from './AuditReject'
import AuditPass from './AuditPass'

export default {
  name: 'AuditTable',
  components: { AuditReject, AuditPass },
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
        '1': '审核通过',
        '6': '被驳回',
        '5': '待审核'
      }
      return status[auditStatus] || '-'
    }
    return {}
  },
  methods: {
    handleCheckDetail(row) {
      this.$emit('detail', row.shopCode, row.enterStatus === 5 ? 0 : 1)
    },
    /**
     * @description: 审核通过
     */
    handlePass(row) {
      this.$msgbox({
        title: '确定通过？',
        message: this.$createElement(
          'AuditPass', {
            props: {
              legalPersonName: row.legalPersonName
            },
            ref: 'AuditPass'
          }, null),
        showCancelButton: true,
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done()
        }
      }).then(() => {
        // const { businessType } = this.$refs['AuditPass'].form
        // this.$emit('audit', row.shopCode, 1, businessType )
        this.$emit('audit', row.shopCode, 1, null)
      })
    },
    /**
     * @description: 审核拒绝
     */
    handleReject(row) {
      const h = this.$createElement
      this.$msgbox({
        customClass: 'audit-reject-model',
        title: '确定驳回此记录？',
        message: h(
          'AuditReject',
          {
            ref: 'auditReject'
          },
          null
        ),
        showCancelButton: false,
        confirmButtonText: '确定'
        // beforeClose: (action, instance, done) => {
        //   if (this.$refs['auditReject']) this.$refs['auditReject'].$refs['form'].resetFields()
        //   done()
        // }
      })
        .then(() => {
          const { reason, detail } = this.$refs['auditReject'].form
          if (reason === '其他') {
            this.$emit('audit', row.shopCode, 6, detail)
          } else {
            this.$emit('audit', row.shopCode, 6, reason)
          }
          if (this.$refs['auditReject']) this.$refs['auditReject'].$refs['form'].resetFields()
        })
        .catch(() => {
        })
    },
    handleAdd(row) {
      this.$router.push({ path: 'shopAgain', query: { shopCode: row.shopCode }})
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
