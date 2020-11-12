<template>
  <div class="app-container">
    <el-row class="title">基本信息</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="12" :style="{fontSize:'0px',display:'flex'}">
          <span :style="{fontSize:'15px'}">基础商品：</span>
          <el-link type="primary" @click="handleCheckBaseGoods">{{curGoods['commodityName']}}</el-link>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">商品名称：{{curSupplyGoods['channelCommodityName']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">商品简介：{{curSupplyGoods['introduction']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :style="{display:'flex',flexDirection:'row'}">
          <span>商品分类：</span>
          <span style="white-space:pre;">{{formatCategory()}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">基础销量：{{curSupplyGoods.baseSale}}{{curSupplyGoods.unit | statusDescrible}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">展示排序：{{curSupplyGoods.sort}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="((curSupplyGoods.channelCommoditySub || {}).shelfOnMode || {}).value === 2">上架时间:{{(curSupplyGoods.channelCommoditySub || {}).nextUpperDate}}</div>
          <div v-else>上架时间:{{((curSupplyGoods.channelCommoditySub || {}).shelfOnMode || {}).describe}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div v-if="((curSupplyGoods.channelCommoditySub || {}).shelfOffMode || {}).value === 2">下架时间:{{(curSupplyGoods.channelCommoditySub || {}).nextLowerDate}}</div>
          <div v-else>下架时间:{{((curSupplyGoods.channelCommoditySub || {}).shelfOffMode || {}).describe}}</div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="title">商品SKU</el-row>
    <el-row class="content">
      <el-col :span="24">
        <sku-table :tableData="channelCommoditySpecificationList || []" :colsMap="skuTableConfig" />
      </el-col>
    </el-row>
    <el-row class="title">商品图片</el-row>
    <el-row class="content">
      <el-row v-if="supplyGoodsCover">
        <div class="image-square">
          <div>
            <el-image class="multiple-image" :style="{marginTop:'0px',marginRight:'0px'}" :src="supplyGoodsCover" :preview-src-list="[supplyGoodsCover]"></el-image>
          </div>
          <div>供应商品封面</div>
        </div>
      </el-row>
      <el-row :style="{display: 'flex',flexWrap:'wrap'}" v-if="goodsCover">
        <span class="image-square">
          <div>
            <el-image class="multiple-image" :style="{marginTop:'10px',marginRight:'0px'}" :src="goodsCover" :preview-src-list="imgAllList"></el-image>
          </div>
          <div>基础商品封面</div>
        </span>
        <span class="image-square" v-for="(item,idx) of imageList" :key="idx">
          <div>
            <el-image class="multiple-image" :style="{marginTop:'10px',marginRight:'0px'}" :src="item" :preview-src-list="imgAllList"></el-image>
          </div>
          <div>基础商品详情{{idx+1}}</div>
        </span>
      </el-row>
    </el-row>
    <el-row class="title">商品视频</el-row>
    <el-row class="content">
      <el-row :style="{display: 'flex',flexWrap:'wrap',marginTop:'10px'}">
        <div :style="{display: 'flex'}" v-if="videoCover">
          <span class="image-square">
            <div>
              <el-image class="multiple-image" :style="{marginTop:'10px',marginRight:'0px'}" :src="videoCover" :preview-src-list="[videoCover]"></el-image>
            </div>
            <div>视频封面</div>
          </span>
          <span class="image-square">
            <div :style="{position:'relative'}">
              <div class="player" @click="playVideo"></div>
              <el-image class="multiple-image" :style="{marginTop:'10px',marginRight:'0px'}" :src="videoCover"></el-image>
            </div>
            <div>商品视频</div>
          </span>
        </div>
      </el-row>
    </el-row>
    <el-row class="title">商品参数</el-row>
    <el-row class="content">
      <el-col :span="24">
        <template v-for="(item,idx) of curGoods['baseCommodityParamList']">
          <div :key="'param'+idx" :style="{marginTop:'10px',marginBottom:'10px'}">{{item.paramName}}</div>
          <el-table :data="item.paramValue" border style="width: 100%" :key="idx">
            <el-table-column prop="name" label="参数名称" width="180"></el-table-column>
            <el-table-column prop="value" label="参数值"></el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
    <el-row class="title">商品详情</el-row>
    <el-row class="content">
      <el-col :span="24">
        <custom-detail-module ref="detail" :isEditor="false"></custom-detail-module>
      </el-col>
    </el-row>
    <el-dialog title="视频播放" :visible.sync="videoDialog" @close="handleCloseDialog">
      <video ref="video" :src="videoUrl" controls autoplay :style="{width:'100%',height:'100%'}" />
    </el-dialog>
  </div>
</template>

<script>
import { SupplyGoodsPreview } from './components'
import SkuTable from '@/components/SkuTable/index'
import CustomDetailModule from '@/components/CustomDetailModule/index'
import { reqBaseGoodsById } from '@/api/baseGoods'
import { reqMallGoodsInfoById } from '@/api/mallGoods'

export default {
  name: 'baseGoodsDetail',
  components: { ...SupplyGoodsPreview, SkuTable, CustomDetailModule },
  data() {
    return {
      id: 0,
      curGoods: '',
      curSupplyGoods: {}, // 当前供应商品
      supplyGoodsCover: '', // 供应商品封面
      detailList: new Array(3).fill(0), // 头部详情，基础详情，尾部详情
      baseCategoryPath: '',
      imageList: [],
      goodsCover: '',
      imgAllList: [],
      videoUrl: '',
      videoCover: '',
      detail: '',
      videoDialog: false,
      channelCommoditySpecificationList: [],
      skuTableConfig: [
        { prop: 'weight', label: '重量(Kg)' },
        { prop: 'stock', label: '库存' },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价' }
      ]
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.$nextTick(() => {
      this._reqMallGoodsInfoById(this.id)
    })
  },
  methods: {
    /**
     * @description: 查看基础商品详情
     */
    handleCheckBaseGoods() {
      this.$router.push({
        name: 'baseGoodsDetail',
        query: { id: this.curSupplyGoods.baseCommodityId }
      })
    },
    /**
     * @description: 格式化商品分类
     */
    formatCategory() {
      const categories = (this.curSupplyGoods.channelCategoryList || []).reduce((pre, item) => {
        pre.push(item.parent ? `${item.parent.name} > ${item.name}` : `${item.name}`)
        return pre
      }, [])
      return categories.join('\n\n')
    },
    playVideo() {
      this.videoDialog = true
      if (this.$refs['video']) this.$refs['video'].load()
    },
    handleCloseDialog() {
      if (this.$refs['video']) this.$refs['video'].pause()
    },
    getDataType(obj) {
      return Reflect.apply(Object.prototype.toString, obj, [])
        .replace(/^\[object\s(\w+)\]$/, '$1')
        .toUpperCase()
    },
    /**
     * @description: 请求基础商品
     */
    _reqBaseGoodsById(id) {
      return reqBaseGoodsById(id).then(res => {
        if (res.code === 200) {
          this.curGoods = res.result || {}
          this.baseCategoryPath = this.curGoods.baseCategoryPath || ''
          let baseCommodityMediaList = this.curGoods.baseCommodityMediaList || []
          baseCommodityMediaList.map(item => {
            // 详情
            if (item.type && item.type.value === 3) {
              this.detailList[1] = item
              this.detailList = this.detailList.filter(item => {
                if (item !== 0) return true
                return false
              })
              this.detailList = this.detailList.map(item => {
                return JSON.parse(item.typeValue)
              })
              let content = []
              this.detailList.map(item => {
                Array.prototype.push.apply(content, item)
                return item
              })
              this.$refs['detail'].setContent(JSON.stringify(content))
            }
            // 视频
            if (item.type && item.type.value === 2) {
              if (item.cover) {
                this.videoCover = item.typeValue
              } else {
                this.videoUrl = item.typeValue
                // this.videoUrl = 'https://www.w3school.com.cn//i/movie.ogg'
              }
            }
            if (item.type && item.type.value === 1) {
              if (item.cover) {
                this.goodsCover = item.typeValue
              } else {
                this.imageList.push(item.typeValue)
              }
            }
          })
          this.imgAllList = JSON.parse(JSON.stringify(this.imageList))
          this.imgAllList.unshift(this.goodsCover)
          let baseCommodityParamList = this.curGoods['baseCommodityParamList'] || []
          baseCommodityParamList = baseCommodityParamList.map(item => {
            let paramValue = JSON.parse(item.paramValue) || []
            paramValue = paramValue.map(p => {
              let selectedValue = ''
              if (this.getDataType(p.selectedValue) === 'STRING') {
                selectedValue = p.selectedValue
              }
              if (this.getDataType(p.selectedValue) === 'OBJECT') {
                selectedValue = p.selectedValue.name
              }
              if (this.getDataType(p.selectedValue) === 'ARRAY') {
                if (p.selectedValue.length) {
                  if (this.getDataType(p.selectedValue[0]) === 'OBJECT') {
                    selectedValue = p.selectedValue.map(pSelectedValue => {
                      return pSelectedValue.name
                    })
                    selectedValue = selectedValue.join(';')
                  } else {
                    selectedValue = p.selectedValue.join(';')
                  }
                }
              }
              return {
                name: p.name,
                value: selectedValue
              }
            })
            return {
              paramName: item.paramName,
              paramValue
            }
          })
          this.curGoods['baseCommodityParamList'] = baseCommodityParamList
        }
      })
    },
    /**
     * @description: 请求渠道商品详情
     */
    _reqMallGoodsInfoById(id) {
      return reqMallGoodsInfoById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.channelCommoditySpecificationList = result.channelCommoditySpecificationList
            this.curSupplyGoods = result
            this.supplyGoodsCover = ''
            let channelCommodityMediaList = this.curSupplyGoods.channelCommodityMediaList || []
            channelCommodityMediaList.map(item => {
              if (item.type && item.type.value === 1) {
                this.supplyGoodsCover = item.typeValue
              }
            })
            // 商品富文本详情
            if (channelCommodityMediaList) {
              channelCommodityMediaList.map(item => {
                if (item.type && item.type.value === 4) this.detailList[0] = item // 头部详情
                if (item.type && item.type.value === 5) this.detailList[2] = item // 尾部详情
                return item
              })
            }
            return result.baseCommodityId
          }
        })
        .then(id => {
          this._reqBaseGoodsById(id)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  font-size: 15px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    font-size: 17px;
  }
  .content {
    padding: 30px;
  }
  .el-col {
    margin-bottom: 30px;
  }
  .multiple-image {
    width: 150px;
    height: 150px;
    margin-right: 20px;
    margin-top: 10px;
    flex-shrink: 0;
  }
  .player {
    position: absolute;
    width: 150px;
    height: 150px;
    top: 10px;
    bottom: 0;
    left: 0;
    right: 20px;
    background: url('../../../assets/images/play.png') no-repeat center;
    background-size: 30px 30px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 1000;
  }
  .image-square {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
