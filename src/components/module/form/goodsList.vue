<template>
  <div class="goodsList padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">商品列表</div>
      <div class="text-df padding-bottom-sm text-convention">数据来源</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">
          <el-button type="primary" size="mini" @click="dataVisible = true" :disabled="$route.query.type === 'INDEX'">选择数据</el-button>
        </el-col>
        <el-col :span="16" class="padding-top-sm text-df text-second">
          {{ config.config.dataSources.dataType | dataType }}-{{ config.config.dataSources.serviceId | serviceId }}
        </el-col>
      </el-row>
      <div class="text-df padding-bottom-sm text-convention">标题设置</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.title" placeholder="请输入标题" />
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">副标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.subTitle" placeholder="请输入副标题" />
        </el-col>
      </el-row>
<!--      <div class="text-df padding-bottom-sm text-convention">展示形式</div>-->
<!--      <el-row class="">-->
<!--        <el-col :span="8" class="text-df text-second">默认展示</el-col>-->
<!--        <el-col :span="16">-->
<!--          <el-radio-group v-model="config.config.display">-->
<!--            <el-radio label="flex">平铺</el-radio>-->
<!--            <el-radio label="block">列表</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row class="padding-top-sm">-->
<!--        <el-col :span="8" class="text-df text-second">切换按钮</el-col>-->
<!--        <el-col :span="16">-->
<!--          <el-radio-group v-model="config.config.displayButton">-->
<!--            <el-radio :label="true">展示</el-radio>-->
<!--            <el-radio :label="false">隐藏</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <div class="text-df padding-bottom-sm text-convention padding-top-sm">排列方式</div>
      <el-row class="">
        <el-col :span="8" class="text-df text-second">默认排序</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.order" disabled>
            <el-radio label="">默认</el-radio>
            <el-radio label="saleCount">销量</el-radio>
            <el-radio label="minSalePrice">价格</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-top-sm">
        <el-col :span="8" class="text-df text-second">切换按钮</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.orderButton">
            <el-radio :label="true">展示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div class="text-df padding-bottom-sm text-convention padding-top-sm">展示内容</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">商品信息</el-col>
        <el-col :span="16">
          <div>
            <el-checkbox v-model="config.config.goods.title">商品标题</el-checkbox>
          </div>
          <div>
            <el-checkbox disabled v-model="config.config.goods.subTitle">副标题</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.estimateTime">预计到货时间</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.salePrice">当前售价</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.marketPrice">市场售价</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.sales">30天销量</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row class="">
        <el-col :span="8" class="text-df text-second">展示标签</el-col>
        <el-col :span="16">
          <div>
            <el-checkbox v-model="config.config.tags.service">所属业务</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.tags.group">拼团</el-checkbox>
          </div>
          <div>
            <el-checkbox disabled v-model="config.config.tags.coupon">领券</el-checkbox>
          </div>
          <div>
            <el-checkbox disabled v-model="config.config.tags.secKill">秒杀</el-checkbox>
          </div>
        </el-col>
      </el-row>
    </div>
    <data-common :visible.sync="dataVisible" @success="handleSuccess"></data-common>
  </div>
</template>

<script>
  import { filterData } from '../config'
  export default {
    name: 'goodsList',
    components: {
      DataCommon: resolve => {
        return require(['../components/dataCommon'], resolve)
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
        dataVisible: false
      }
    },
    filters: {
      dataType(value) {
        if (value) {
          const info = filterData.dataSources.dataType.filter(o => o.name === value)
          if (info.length) {
            return info[0].value
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      serviceId(value) {
        if (value) {
          const info = filterData.dataSources.types.filter(o => o.id === value)
          if (info.length) {
            return info[0].value
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
    },
    created() {
      // 如果是首页配置，就需要对数据来源进行处理
      if (this.$route.query.type === 'INDEX') {
        // 将排序强制改为默认
        this.config.config.order = ''
        this.init()
      }
    },
    methods: {
      init() {
        // 固定的数据需要固定数据信息
        const id = String(this.$route.query.id)
        if (id === '1') {
          // APP 首页
          this.config.config.dataSources = {
            dataType: 'MIXING', // 数据来源类型
            serviceId: null, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '2') {
          // APP 净菜
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 4, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '3') {
          // APP 快递到家首页
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 1, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '4') {
          // APP 爆品预售
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 2, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '5') {
          // 小程序净菜
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 4, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '6') {
          // 快递到家
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 1, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else if (id === '7') {
          // 爆品预售
          this.config.config.dataSources = {
            dataType: 'BUSINESS', // 数据来源类型
            serviceId: 2, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          }
        } else {
          // 不作处理
        }
      },
      getValid() {
        // 验证
        if (!this.config.content.title || !this.config.content.subTitle) {
          this.$message.error('标题或副标题不能为空')
          return false
        }
        return true
      },
      handleSuccess(result) {
        // 选择数据成功
        this.config.config.dataSources = result
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
</style>
