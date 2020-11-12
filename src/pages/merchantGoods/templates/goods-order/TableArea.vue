<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="排序" align="center" width="180">
        <div slot-scope="{row}">
          <el-input-number :min="0" :max="1000000" v-model="row.sort" step-strictly size="small"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="名称" width="200" prop="goodsName"></el-table-column>
      <el-table-column label="状态" align="center">
        <div slot-scope="{row}">
          <div>{{formatAuditStatus(row['enable'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="一级分类">
        <div slot-scope="{row}">
          <div>{{formatNoneValue(row['rootName'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="二级分类">
        <div slot-scope="{row}">
          <div>{{formatNoneValue(row['parentName'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="三级分类">
        <div slot-scope="{row}">
          <div>{{formatNoneValue(row['categoryName'])}}</div>
        </div>
      </el-table-column>
    </el-table>
    <el-button size="small" type="primary" style="float:left;margin:20px 0" @click="handleSort">更新排序</el-button>
  </div>
</template>

<script>
import { asyncGoodsSourceMaterialSort } from '@/api/merchantGoods'
export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.formatAuditStatus = auditStatus => {
      const status = {
        'false': '已禁用',
        'true': '已启用'
      }
      return status[auditStatus] || '-'
    }
    return {}
  },
  methods: {
    handleEdit(row) {
      this.$router.push({
        path: 'merchantGoodsDetail?code=' + row.shopCode
      })
    },
    handleLog(row) {
      this.$router.push({
        path: 'merchantGoodsLog?code=' + row.shopCode
      })
    },
    handleSort() {
      let arr = []
      arr = this.tableData.map(item => {
        return {
          id: item.id,
          sort: item.sort
        }
      })
      asyncGoodsSourceMaterialSort(arr).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '修改排序成功')
        }
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
