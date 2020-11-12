<template>
  <div class="wrapper">
    <el-card class="empty-card" v-if="!tableData.length" shadow="never">
      <div class="empty-data">暂无数据</div>
    </el-card>
    <el-card
      class="empty-card"
      v-else
      v-for="(item, index) in tableData"
      :key="index" shadow="never"
    >
      <div class="top">
        <div class="name">{{item.name}} <span class="shipping-type" v-if="item.shippingFree">(卖家承担运费)</span></div>
        <div>
          <el-tag size="small" type="warning" effect="dark" v-if="item.isSetFreeCondition">已配置包邮条件</el-tag>
          <el-tag size="small" :type="item.enable ? 'success' : 'danger'" effect="dark">{{ item.enable ? '使用中' : '已停用' }}</el-tag>
          <el-button type="text" @click="handleCopy(item)">复制</el-button>
          <el-button type="text" v-if="!item.enable" @click="handleOpen(item, index)">启用</el-button>
          <el-button type="text" v-else @click="handleStop(item)">停用</el-button>
          <el-button type="text" v-np="'SHIPPING_ORDER_TEMPLATE_EDIT'" @click="handleEdit(item)">编辑</el-button>
          <el-button type="text" @click="handleDelete(item)">删除</el-button>
        </div>
      </div>
      <div class="table-template" v-if="!item.shippingFree">
        <el-table :data="item.policyList" style="width: 100%" :cell-style="cellStyle" :header-cell-style="cellStyle" size="mini">
          <el-table-column label="运送方式">快递</el-table-column>
          <el-table-column label="配送范围" width="100" show-overflow-tooltip>
            <template slot-scope="{ row }">{{row.areaNames || '不限'}}</template>
          </el-table-column>
          <el-table-column :label="item.unitType === 1 ? '首件（个）' : '首重（kg）'" prop="minCount" />
          <el-table-column :label="'运费（元）'" prop="minAmount" />
          <el-table-column :label="item.unitType === 1 ? '续件（个）' : '续重（kg）'" prop="increaseCount" />
          <el-table-column :label="'运费（元）'" prop="increaseAmount" />
          <el-table-column :label="'计费方式'">{{item['unitTypeDesc']}}</el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { enableLogisticsModule, disableLogisticsModule, deleteLogisticsModule } from '@/api/logistics'
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
      cellStyle: { textAlign: 'center' }
    }
  },
  methods: {
    handleEdit(row) {
      this.$router.push({
        name: 'moduleForm',
        query: { id: row.id, type: 'edit' }
      })
    },
    handleCopy(row) {
      this.$router.push({
        name: 'moduleForm',
        query: { id: row.id, type: 'copy' }
      })
    },
    handleDelete(row) {
      this.$confirm('删除后，使用该模版的商品将不会收取运费，模版无法找回，确认要删除吗？', '启用提示', {}).then(() => {
        deleteLogisticsModule({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.$emit('onSearch')
          }
        })
      })
    },
    handleOpen(row) {
      this.$confirm('启用运费模版，之前使用过该模版的商品，按该模版开始计算运费？', '启用提示', {}).then(() => {
        enableLogisticsModule({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('启用成功')
            this.$emit('onSearch')
          }
        })
      })
    },
    handleStop(row) {
      this.$confirm('停用后，使用该模版的商品将不会收取运费，确认要停用吗？', '停用提示', {}).then(() => {
        disableLogisticsModule({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('停用成功')
            this.$emit('onSearch')
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@mixin flex($direction, $main, $second) {
  display: flex;
  flex-direction: $direction;
  justify-content: $main;
  align-items: $second;
}
.wrapper {
  .top {
    @include flex(row, space-between, center);
    margin-bottom: 10px;
    .name {
      color: #409eff;
      @include flex(row, center, center);
    }
    .shipping-type {
      margin-left: 12px;
      color: #F56C6C;
      font-size: 14px;
      display: inline-block;
    }
  }

  /deep/ .el-card {
    margin-bottom: 14px;
  }

  /deep/ .el-tag {
    margin-right: 10px;
  }

  .empty-card {
    border-color: rgba(217, 236, 255, 1);

    .empty-data {
      text-align: center;
      font-size: 13px;
      color: #97a8be;
    }
  }
}
</style>
