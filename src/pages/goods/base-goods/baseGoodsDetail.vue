<template>
  <div class="app-container">
    <el-row class="title">分类信息</el-row>
    <el-row class="content">
      <el-row>
        <category-show :id="baseCategoryPath" />
      </el-row>
    </el-row>
    <el-row class="title">商品信息</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="12">商品编码：{{curGoods['commodityNo']}}</el-col>
        <el-col :span="12">商品名称：{{curGoods['commodityName']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">商品简介：{{curGoods['introduction']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">商品单位：{{curGoods['unit']?curGoods['unit'].describe:'-'}}</el-col>
      </el-row>
      <el-row :style="{display: 'flex',flexWrap:'wrap'}">
        <span :style="{flexShrink: '0'}">商品图片：</span>
        <div v-if="goodsCover">
          <el-image class="multiple-image" :src="goodsCover" :preview-src-list="imgAllList"></el-image>
          <template v-for="(item,idx) of imageList">
            <el-image class="multiple-image" :src="item" :preview-src-list="imgAllList" :key="idx"></el-image>
          </template>
        </div>
      </el-row>
      <el-row :style="{display: 'flex',flexWrap:'wrap',marginTop:'10px'}">
        <span :style="{flexShrink: '0'}">商品视频：</span>
        <div :style="{display: 'flex'}" v-if="videoCover">
          <el-image class="multiple-image" :src="videoCover" :preview-src-list="[videoCover]"></el-image>
          <div :style="{position:'relative'}">
            <div class="player" @click="playVideo"></div>
            <el-image class="multiple-image" :src="videoCover"></el-image>
          </div>
        </div>
      </el-row>
    </el-row>
    <el-row class="title">商品SKU</el-row>
    <el-row class="content">
      <el-col :span="24">
        <sku-table :tableData="curGoods['baseCommoditySpecificationList'] || []" :colsMap="skuTableConfig" />
      </el-col>
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
import CategoryShow from './components/CategoryShow'
import SkuTable from '@/components/SkuTable/index'
import CustomDetailModule from '@/components/CustomDetailModule/index'
import { reqBaseGoodsById } from '@/api/baseGoods'

export default {
  name: 'baseGoodsDetail',
  components: { CategoryShow, SkuTable, CustomDetailModule },
  data() {
    return {
      id: 0,
      curGoods: '',
      baseCategoryPath: '',
      imageList: [],
      goodsCover: '',
      imgAllList: [],
      videoUrl: '',
      videoCover: '',
      detail: '',
      videoDialog: false,
      skuTableConfig: [
        { prop: 'price', label: '税后供货价' },
        { prop: 'weight', label: '重量(Kg)' },
        { prop: 'stock', label: '可售量' },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' }
      ]
    }
  },
  beforeMount() {
    const { id } = this.$route.query
    this.id = id
  },
  mounted() {
    this.$nextTick(() => {
      this._reqBaseGoodsById(this.id)
    })
  },
  methods: {
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
    _reqBaseGoodsById(id) {
      return reqBaseGoodsById(id).then(res => {
        if (res.code === 200) {
          this.curGoods = res.result || {}
          this.baseCategoryPath = this.curGoods.baseCategoryPath || ''
          let baseCommodityMediaList = this.curGoods.baseCommodityMediaList || []
          baseCommodityMediaList.map(item => {
            // 详情
            if (item.type && item.type.value === 3) {
              this.detail = item.typeValue
              this.$refs['detail'].setContent(this.detail)
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
}
</style>
