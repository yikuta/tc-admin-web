<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="图片" width="100" align="center">
        <div slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.img" fit="fill"></el-image>
        </div>
      </el-table-column>
      <el-table-column label="商品信息">
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
            <span class="short" :title="row['introduction']">{{formatNoneValue(row['introduction'])}}</span>
          </div>
          <div class="text-style">
            <span>店铺分类：</span>
            <span>{{formatNoneValue(row['category'])}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="商品状态" align="center" width="100">
        <div slot-scope="{row}">
          <div>{{row['auditStatus']===10 ? '待审核' : (row['isUpshelf'] == 1 ? '已上架' : '已下架')}}</div>
        </div>
      </el-table-column>
      <el-table-column label="创建信息">
        <div slot-scope="{row}">
          <div class="text-style">
            <span>基础分类：</span>
            <span>{{formatNoneValue(row['showBaseCategory'])}}</span>
          </div>
          <div class="text-style">
            <span>创建时间：</span>
            <span>{{formatNoneValue(row['createTime'])}}</span>
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
      <el-table-column label="负责运维" width="200">
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
      <el-table-column label="操作" width="150">
        <template v-slot:default="{ row, column }">
          <el-link class="btnText" type="primary" @click="handlePreview(row, column)">预览</el-link>
          <el-link
            class="btnText"
            type="primary"
            v-if="(row.isUpshelf==='0' || row.isUpshelf===0) && row['auditStatus']!==10"
            @click="handleEdit(row, column)">编辑</el-link>
          <!-- <el-link class="btnText" type="primary" v-show="row['auditStatus']!=10 && row['isUpshelf'] === 0" @click="handleEdit(row, column)">编辑</el-link> -->
          <el-link class="btnText" v-np="'COMMON_OPERATE_LOG'" type="primary" @click="handleLog(row)">操作日志</el-link>
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
    return {}
  },
  methods: {
    handlePreview(row) {
      this.$emit('on-preview', row)
    },
    handleEdit(row) {
      this.$router.push({
        path: 'merchantGoodsDetail?code=' + row.id + '&type=goodsList' + '&shopCode=' + row.shopCode
      })
    },
    handleLog(row) {
      this.$router.push({
        path: 'merchantGoodsLog',
        query: { id: row.id, productName: row.channelCommodityName, category: row.category, baseCategory: row.showBaseCategory, shopCode: row.shopVo.shopCode, name: row.shopVo.name }
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
.short{
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
