<template>
  <div>
    <div class="list-line bg-seat padding-sm" v-for="(item, index) in config.content.list" :key="index">
      <div class="left-opt">
        <div class="btn-top cursor" :class="{ 'text-seat': index === 0, 'text-hover-brand': index !== 0 }" @click.stop="handleSeat(index, 'up')">
          <i class="el-icon-top"></i>
        </div>
        <div class="btn-bottom  cursor" :class="{ 'text-seat': index === config.content.list.length - 1, 'text-hover-brand':index !== config.content.list.length - 1 && config.content.list.length > 1 }" @click.stop="handleSeat(index, 'down')">
          <i class="el-icon-bottom"></i>
        </div>
      </div>
      <div class="right-opt" @click.stop="handleSelect(index, 'common')">
        <div class="line-image bg-sec margin-right-sm cursor">
          <img :src="item.image" />
        </div>
        <div class="line-content cursor">
          <div class="text-sm text-second">
            <div>标题：{{ item.name }}</div>
            <div>价格：{{ item.salePrice }}</div>
          </div>
        </div>
        <div class="delete-icon">
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.stop="handleDelete(index)" v-if="config.content.list.length > 1"></el-button>
        </div>
      </div>
    </div>
    <div class="padding-top-sm text-right">
      <el-button type="primary" size="mini" @click="handleAdd">添加({{ config.content.list.length }}/{{ config.systemConfig.num }})</el-button>
    </div>
    <common-dialog :visible.sync="commonVisible" @success="handleSuccess" :list="[2]" title="选择商品"></common-dialog>
  </div>
</template>

<script>
  export default {
    name: 'commonGoods',
    components: {
      CommonDialog: resolve => {
        return require(['../../components/commonDialog'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        dialogCache: {
          type: '', // 类型
          index: 0 // 缓存当前弹窗对应的索引
        },
        commonVisible: false
      }
    },
    methods: {
      handleAdd() {
        // 添加一个图片选项
        if (this.config.content.list.length === this.config.systemConfig.num) {
          this.$message.warning(`当前只能添加${this.config.systemConfig.num}个图片`)
          return
        }
        this.config.content.list.push({
          id: '',
          goodsTypeId: '',
          name: '',
          marketPrice: 0, // 市场价
          salePrice: 0, // 销售价
          image: '',
          shopCode: 0
        })
      },
      handleDelete(index) {
        // 删除
        if (this.config.content.list.length === 1) return
        this.config.content.list.splice(index, 1)
      },
      handleSelect(index, type) {
        // 进入弹窗选择
        this.dialogCache = {
          type,
          index
        }
        this[`${type}Visible`] = true
      },
      handleSuccess(result) {
        // 选择了图片
        if (this.dialogCache.type === 'image') {
          // 这个页面没有自定义图片的功能，可以忽略这段，存在的主要原因：懒
          this.config.content.list[this.dialogCache.index].image = result.fileUrl
        } else {
          this.config.content.list[this.dialogCache.index] = {
            id: result.content.goodsId,
            goodsTypeId: result.content.goodsTypeId,
            name: result.content.baseData.channelCommodityName,
            marketPrice: result.content.baseData.minMarketPrice || result.content.baseData.maxMarketPrice, // 市场价
            salePrice: result.content.baseData.minSalePrice || result.content.baseData.maxSalePrice, // 销售价
            image: result.content.baseData.thumbnailImage,
            shopCode: result.content.baseData.storeNo || 0 // 店铺编码
          }
        }
        this.$emit('change')
      },
      handleSeat(index, opt) {
        // 位置移动
        if (opt === 'up') {
          // 往上
          if (index === 0) {
            // 如果已经等于0则不操作
            return
          }
        } else {
          if (index === this.config.content.list.length - 1) {
            // 最后一个不能再往下
            return
          }
        }
        // 细细品尝
        this.config.content.list.splice(opt === 'up' ? index - 1 : index + 1, 0, this.config.content.list.splice(index, 1)[0])
      },
      getValid() {
        let flag = true // 设置当前的返回状态
        for (let i = 0; i < this.config.content.list.length; i++) {
          // 如果 goodsTypeId 为空，则表明没有选择数据，是否选择了内容在弹窗里面已经做了验证，所以只需要验证 goodsTypeId
          if (!this.config.content.list[i].goodsTypeId) {
            this.$message.error('请选择对应的跳转信息')
            flag = false
            break
          }
        }
        return flag
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/common";
  .list-line{display: flex;align-items: center;
    .left-opt{flex-shrink: 0;width:20px;}
    .right-opt{display:flex;align-items: center;flex-grow:1;
      .line-image{width:50px;height:50px;flex-shrink:0;
        img{width:100%;height:100%;}
      }
      .line-content{flex:1;width:0;
        >div{
          >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        }
      }
    }
  }
</style>
