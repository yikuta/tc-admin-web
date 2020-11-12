<template>
  <div class="wrapper">
    <div class="title">套餐主商品</div>
    <div class="goods-list">
      <el-card class="goods-item" v-if="mainGood.commodityId" @click="handleAddMainGood">
        <i class="el-icon-delete" @click="handleRemoveGood('main')"></i>
        <el-image style="width: 100%; height: 105px" :src="mainGood.thumbnailImage" :fit="'cover'">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <span class="goods-name">{{mainGood.commodityName}}</span>
        <span class="goods-price">{{mainGood.costPrice | formatMoney}}</span>
      </el-card>
      <el-button class="add-button" v-else type="text" @click="handleAddMainGood">+&nbsp;添加套餐主商品</el-button>
    </div>

    <div class="title">套餐搭配商品</div>
    <div class="goods-list">
      <el-card class="goods-item" v-for="(item, index) in mealGoods" :key="item.commodityId">
        <i class="el-icon-delete" @click="handleRemoveGood('meal', index)"></i>
        <el-image style="width: 100%; height: 105px" :src="item.thumbnailImage" :fit="'cover'">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <span class="goods-name">{{item.commodityName}}</span>
        <span class="goods-price">{{item.costPrice | formatMoney}}</span>
      </el-card>
      <el-button v-if="mealGoods.length < 25" class="add-button" type="text" @click="handleAddMealGood">+&nbsp;添加搭配商品</el-button>
    </div>

    <dialog-base-good-list
      :visible="dialogVisible"
      :addType="addType"
      @submit="handleSubmit"
      @close="handleCloseDialog"
    />
  </div>
</template>

<script>
  import { deepClone } from '@/utils/util'
  import DialogBaseGoodList from './dialogBaseGoodList'

  export default {
    name: 'publishGoodsChoice',
    components: { DialogBaseGoodList },
    props: {
      mainGood: {
        type: Object,
        default: () => ({})
      },
      mealGoods: {
        type: Array,
        default: () => []
      }
    },
    filters: {
      formatMoney: value => {
        const moneyArr = (value || 0).toString().split('-').map(item => `¥${item}`)
        return moneyArr.join('-')
      }
    },
    data() {
      return {
        dialogVisible: false,
        addType: 'main',
        currentPage: 1,
        currentSelected: '',
        currentMealGoodsSelected: []
      }
    },
    mounted() {},
    methods: {
      handleAddMainGood() {
        this.dialogVisible = true
        this.addType = 'main'
      },
      handleAddMealGood() {
        this.dialogVisible = true
        this.addType = 'meal'
      },
      handleRemoveGood(type, index) {
        this.$confirm('移除商品后可以重新添加该商品到套餐，确定要移除吗？', '移除提示', {
          confirmButtonText: '确定移除',
          cancelButtonText: '我再想想',
          type: 'warning'
        }).then(() => {
          if (type === 'main') {
            this.$parent.mainGood = {}
          } else {
            this.mealGoods.splice(index, 1)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      handleCloseDialog() {
        this.dialogVisible = false
      },
      handleSubmit(data) {
        data.forEach(item => {
          const newItem = deepClone(item)
          newItem.commodityId = item.id
          newItem.limitCount = 1
          newItem.collocationPrice = 0
          newItem.baseCommoditySpecificationList.forEach(spec => {
            spec.collocationPrice = 0
          })
          delete newItem.id
          if (this.addType === 'main') { // 套餐主商品
            this.$parent.mainGood = newItem
          } else { // 套餐搭配商品
            this.$parent.mealGoods.push({ ...newItem })
          }
        })
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang='scss' scoped>
  .wrapper {
    margin-top: 10px;

    .title {
      padding: 5px 12px;
      margin-bottom: 20px;
      border-left: 4px solid #00a0e9;
    }

    .add-button {
      border: 1px solid;
      width: 165px;
      height: 220px;
      margin: 0 15px 20px 15px;
    }
    .goods-list {
      font-size: 0;

      .goods-item {
        display: inline-block;
        vertical-align: middle;
        border: 1px solid #409EFF;
        width: 165px;
        margin: 0 15px 20px 15px;
        font-size: 14px;

        /deep/ .el-card__body {
          width: 100%;
          padding: 12px;
          display: flex;
          flex-direction: column;
          position: relative;

          img {
            width: 100%;
            max-width: 139px;
            max-height: 105px;
          }

          .el-icon-delete {
            position: absolute;
            right: 10px;
            z-index: 5;
            color: #f56c6c;
            cursor: pointer;
          }

          .image-slot, .demo-image__placeholder .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: #f5f7fa;
            color: #909399;
            font-size: 20px;
          }
        }

        .goods-name {
          height: 46px;
          margin: 10px 0;
          font-size: 14px;
          line-height: 23px;
          color: #606266;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .goods-price {
          text-align: center;
          color: #f56c6c;
          line-height: 23px;
        }
      }
    }
    .search-content {
      /deep/ .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 33%;
          .el-select {
            width: 100%;
          }
        }
      }
      .search-btn {
        text-align: right;
      }
    }
    .current-goods {
      margin: 10px 0 20px 0;
      text-align: center;
      color: #606266;
      font-size: 14px;
    }
  }
</style>

