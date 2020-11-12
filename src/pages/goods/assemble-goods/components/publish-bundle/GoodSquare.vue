<template>
  <div class="wrapper">
    <template v-if="type==='main'">
      <div class="square" @click="showSelector" v-show="!bundleMainGoods">
        <i class="el-icon-plus" />
        <span>添加套餐主商品</span>
      </div>
      <div class="square-goods" @mouseover="showMainDel='visible'" @mouseout="showMainDel='hidden'" v-show="bundleMainGoods">
        <img :src="bundleMainGoods['thumbnailImage']" />
        <span>{{bundleMainGoods['commodityName']}}</span>
        <span
          :style="{color:'red'}"
        >{{bundleMainGoods['marketPrice']?bundleMainGoods['marketPrice']:bundleMainGoods.minMarketPrice^bundleMainGoods.maxMarketPrice?`￥${Number(bundleMainGoods.minMarketPrice).toFixed(2)}-￥${Number(bundleMainGoods.maxMarketPrice).toFixed(2)}`:`￥${Number(bundleMainGoods.minMarketPrice).toFixed(2)}`}}</span>
        <span class="pic-delete-area" :style="{visibility:showMainDel}" @click="handleRemove">
          <i class="el-icon-close" :style="{color:'white',transform:'rotate(-45deg)'}"></i>
        </span>
      </div>
    </template>
    <template v-if="type==='retinue'">
      <div class="square-goods" @mouseover="showMainDel='visible'" @mouseout="showMainDel='hidden'">
        <el-image :src="retinueGoods['thumbnailImage']"></el-image>
        <span>{{retinueGoods['commodityName']}}</span>
        <span
          :style="{color:'red'}"
        >{{retinueGoods['marketPrice']?retinueGoods['marketPrice']:retinueGoods.minMarketPrice^retinueGoods.maxMarketPrice?`￥${Number(retinueGoods.minMarketPrice).toFixed(2)}-${Number(retinueGoods.maxMarketPrice).toFixed(2)}`:`￥${Number(retinueGoods.minMarketPrice).toFixed(2)}`}}</span>
        <span class="pic-delete-area" :style="{visibility:showMainDel}" @click="handleRemove">
          <i class="el-icon-close" :style="{color:'white',transform:'rotate(-45deg)'}"></i>
        </span>
      </div>
    </template>
    <template v-if="type==='add'">
      <div class="square" @click="showSelector">
        <i class="el-icon-plus" />
        <span>添加搭配商品</span>
      </div>
    </template>
    <goods-selector :visible.sync="dialogVisible" />
    <el-dialog title="警告" :visible.sync="delDialogVisible" width="30%">
      <span>移除商品后可以重新添加该商品到套餐，确定要移除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">我再想想</el-button>
        <el-button type="primary" @click="sureDel">确定移除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GoodsSelector from './GoodsSelector'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'GoodSquare',
  components: { GoodsSelector },
  props: {
    type: String,
    retinueGoods: Object
  },
  computed: {
    ...mapState('assembleGoods', ['bundleMainGoods', 'curBundleDetail'])
  },
  data() {
    return {
      dialogVisible: false, // 选择商品dialog
      delDialogVisible: false, // 删除商品dialog
      showMainDel: 'hidden'
    }
  },
  methods: {
    ...mapActions('assembleGoods', ['clearBundleMainGoods', 'setBundleMainGoods', 'rmSingleRetinueGoods']),
    showSelector() {
      this.dialogVisible = true
    },
    handleRemove(e) {
      e.stopPropagation()
      this.delDialogVisible = true
    },
    /**
     * @description: 确定移除
     */
    sureDel() {
      if (this.type === 'main') {
        if (this.curBundleDetail) {
          this.$message('编辑套餐不能更改主商品')
          return
        }
        this.clearBundleMainGoods()
      } else {
        this.rmSingleRetinueGoods(this.retinueGoods)
      }
      this.delDialogVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
@mixin square-common {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(215, 215, 215, 1);
  cursor: pointer;
  width: 200px;
  height: 255px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrapper {
  display: flex;
  flex-direction: row;
  .square {
    @include square-common;
    justify-content: center;
    span {
      font-size: 13px;
      margin-top: 10px;
    }
  }
  .square-goods {
    @include square-common;
    img {
      width: 150px;
      height: 150px;
      margin-top: 10px;
    }
    .el-image {
      width: 150px;
      height: 150px;
      margin-top: 10px;
    }
    span {
      font-size: 13px;
      margin-top: 10px;
      padding: 0 10px;
    }
    .pic-delete-area {
      font-size: 15px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      margin-top: 0px;
      padding: 0;
      background-color: red;
      width: 70px;
      height: 50px;
      position: absolute;
      top: -20px;
      right: -30px;
      transform: rotate(45deg);
      i {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
