<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="图片" width="100" align="center">
        <div slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.imgUrl" fit="fill"></el-image>
        </div>
      </el-table-column>
      <el-table-column label="商品名称" width="200" prop="goodsName"></el-table-column>
      <el-table-column label="商品简介" prop="goodsInfo"></el-table-column>
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
      <el-table-column label="创建时间" width="200">
        <div slot-scope="{row}">
          <span>{{formatNoneValue(row['createTime'])}}</span>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot:default="{ row, column }">
          <el-link class="btnText" type="primary" @click='handlePreview(row)'>预览</el-link>
          <el-link class="btnText" type="primary" @click="handleEdit(row, column)">编辑</el-link>
          <el-link class="btnText" type="primary" @click="handleStatus(row)">{{row['enable']?'禁用':'启用'}}</el-link>
          <el-link class="btnText" type="primary" @click="handleDelete(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    handlePreview(row) {
      this.$emit('on-preview', row)
    },
    handleEdit(row) {
      this.$router.push({
        path: 'merchantGoodsMaterialDetail?code=' + row.id
      })
    },
    handleLog(row) {
      this.$router.push({
        path: 'merchantGoodsLog?code=' + row.shopCode
      })
    },
    handleStatus(row) {
      this.$emit('update-status', row.id)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除${row.goodsName}吗？`, '提示', {}).then(() => {
        this.$emit('delete', row.id)
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
