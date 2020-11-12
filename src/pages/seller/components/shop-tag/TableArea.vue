<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
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
      <el-table-column label="门店标签" align="center">
        <div slot-scope="{row}">
          <div>{{formatTags(row['shopTagValues'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="店招标签" align="center">
        <div slot-scope="{row}">
          <div>{{formatNoneValue(row['shopLogoTagValue'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="特色标签" align="center">
        <div slot-scope="{row}">
          <div>{{formatNoneValue(row['characteristicTagValue'])}}</div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <span class="btnText" @click="handleChangeTag(scope.row, 0, false)">修改门店标签</span>
          <span class="btnText" @click="handleChangeTag(scope.row, 1, false)">修改店招标签</span>
          <span class="btnText" @click="handleChangeTag(scope.row, 2, false)">修改特色标签</span>
        </template>
      </el-table-column>
    </el-table>
    <tag-module ref="tagModule" :dialogVisible.sync='dialogVisible' :title="title" :activeIndex='activeIndex' @update-tag='handleUpdateShopTag'></tag-module>
  </div>
</template>

<script>
import TagModule from './TagModule'
import { asyncUpdateShopTags, asyncBatchUpdateShopTags } from '@/api/seller'
export default {
  name: 'TableArea',
  components: { TagModule },
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
        open: '营业中',
        relax: '已打烊',
        stop: '停业中'
      }
      return status[auditStatus] || '-'
    }
    this.formatTags = tags => {
      return tags && tags.length ? tags.join('、') : '-'
    }
    return {
      multipleSelection: [],
      info: {},
      dialogVisible: false,
      title: '',
      activeIndex: 0,
      isBatch: false
    }
  },
  methods: {
    handleChangeTag(row, status, flag) {
      this.info = row
      this.activeIndex = status
      if (status === 0) {
        this.title = '门店标签'
      } else if (status === 1) {
        this.title = '店招标签'
      } else {
        this.title = '特色标签'
      }
      this.handleStoreTag(flag)
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    /**
     * @description: 批量修改门店标签
     * @param {isBatch}: 是否是批量处理
     */
    handleStoreTag(isBatch) {
      this.isBatch = isBatch
      if (isBatch && (!this.multipleSelection || this.multipleSelection.length <= 0)) {
        this.$message('请至少选择一项')
        return
      }
      this.dialogVisible = true
    },
    // 修改门店标签
    handleUpdateShopTag(obj) {
      let info = {}
      if (this.activeIndex === 0) {
        info = {
          shopTagList: obj.shopTags
        }
      } else if (this.activeIndex === 1) {
        info = {
          shopLogoTag: obj.shopLogoTag
        }
      } else {
        info = {
          characteristicTag: obj.characteristicTag
        }
      }
      if (this.isBatch) {
        asyncBatchUpdateShopTags({
          shopCodeList: this.multipleSelection.map(item => item.shopCode),
          ...info
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '更新门店标签成功')
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      } else {
        asyncUpdateShopTags({
          shopCode: this.info.shopCode,
          ...info
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '更新门店标签成功')
            this.dialogVisible = false
            this.$emit('update')
          }
        })
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
