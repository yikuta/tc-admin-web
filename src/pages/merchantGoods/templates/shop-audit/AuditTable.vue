<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" v-if="activeTab==='0'" key="shopCode"></el-table-column>
      <el-table-column label="图片" width="100" align="center">
        <div slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.img" fit="fill"></el-image>
        </div>
      </el-table-column>
      <el-table-column label="商品信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>名称：</span>
            <span>{{formatNoneValue(row['channelCommodityName'])}}</span>
          </div>
          <div class="text-style">
            <span>单价：</span>
            <span>{{row['salePrice'] | money}}</span>
            <span style="color:#AAAAAA;text-decoration: line-through;margin-left:5px">{{row['marketPrice'] | money}}</span>
          </div>
          <div class="text-style">
            <span>简介：</span>
            <span>{{formatNoneValue(row['introduction'])}}</span>
          </div>
          <div class="text-style">
            <span>店铺分类：</span>
            <span>{{formatNoneValue(row['category'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="商品状态" align="center">
        <div slot-scope="{row}">
          <div>{{formatAuditStatus(row['auditStatus'])}}</div>
          <div v-if="row['auditStatus']=='12'">
            <span>原因：</span>
            <span>{{formatNoneValue(row['rejectReason'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="门店信息" width="200">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>门店名称：</span>
            <span>{{formatNoneValue(row.shopVo?row.shopVo['name']:'')}}</span>
          </div>
          <div class="text-style">
            <span>门店编码：</span>
            <span>{{formatNoneValue(row.shopVo?row.shopVo['shopCode']:'')}}</span>
          </div>
          <div class="text-style">
            <span>登录账号：</span>
            <span>{{formatNoneValue(row.shopVo?row.shopVo['bossAccount']:'')}}</span>
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
      <el-table-column label="审核人" width="180" v-if="activeTab==='1'" key="auditUser">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>姓名：</span>
            <span>{{formatNoneValue(row['auditUser'])}}</span>
          </div>
          <div class="text-style">
            <span>日期：</span>
            <span>{{row['auditTime']}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="120" v-if="activeTab==='0'" key="control">
        <template v-slot:default="{ row }">
          <el-link class="btnText" type="primary" @click='handlePreview(row)'>预览</el-link>
          <el-link class="btnText" type="primary" @click="handlePass(row.id, false)">通过</el-link>
          <el-link class="btnText" type="primary" @click="handleReject(row.id, false)">拒绝</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" key="control1" v-else>
        <template v-slot:default="{ row }">
          <el-link class="btnText" type="primary" @click='handlePreview(row)'>预览</el-link>
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
        '11': '审核通过',
        '12': '被驳回',
        '10': '待审核'
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
    handlePass(code, isBatch) {
      const h = this.$createElement
      this.$msgbox({
        title: isBatch ? '确定批量通过？' : '确定通过？',
        message: h(
          'div',
          {
            style: {
              color: 'red'
            }
          },
          isBatch ? '' : '审核通过，商品默认是已下架状态，还需商家手动操作上架'
        ),
        showCancelButton: true,
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done()
        }
      })
        .then(() => {
          this.$emit('audit', code, 'SUCCESS')
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
            this.$emit('audit', code, 'REJECT', detail)
          } else {
            this.$emit('audit', code, 'REJECT', reason)
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
     * @description: 批量修改自营商品状态
     */
    handleEditBusiness(status) {
      if (!this.multipleSelection || this.multipleSelection.length <= 0) {
        this.$message('请至少选择一项')
        return
      }
      let codeList = this.multipleSelection.map(item => item.id) || []
      if (status === '1') {
        this.handlePass(codeList, true)
      } else {
        this.handleReject(codeList, true)
      }
    },
    handlePreview(row) {
      this.$emit('on-preview', row)
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
