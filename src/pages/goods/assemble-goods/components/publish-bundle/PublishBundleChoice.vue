<template>
  <div class="app-container">
    <el-row class="title-main">套餐主商品</el-row>
    <GoodSquare type="main" @click.native="handleChangeType('main')" />
    <el-row class="title-main">套餐搭配商品</el-row>
    <div class="retinueArea">
      <GoodSquare :style="{marginRight: '15px',marginBottom: '10px'}" v-for="item of bundleRetinueGoods" type="retinue" :retinueGoods="item" @click.native="handleChangeType('retinue')" :key="item.id" />
      <GoodSquare type="add" @click.native="handleChangeType('retinue')" v-show="bundleRetinueGoods.length<25" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Cascader from '@/components/Cascader'
import GoodSquare from './GoodSquare'
import { reqBaseGoodsList } from '@/api/mallGoods'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishGoodsChoice',
  components: { Pagination, Cascader, GoodSquare },
  computed: {
    ...mapState('assembleGoods', ['bundleRetinueGoods'])
  },
  provide() {
    return {
      vm: this // 给子组件注入该vue实例
    }
  },
  data() {
    this.formateStatus = row => {
      return row['enable'] ? '启用' : '停用'
    }
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      selectedType: 'main' // main-选择主商品 retinue-选择搭配商品
    }
  },
  methods: {
    ...mapActions('assembleGoods', []),
    /**
     * @description: 改变选择的商品类型 选主商品还是搭配商品
     */
    handleChangeType(type) {
      this.selectedType = type
    },
    // ***请求处理***
    _reqBaseGoodsList(data) {
      return reqBaseGoodsList({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .title-main {
    font-weight: bold;
    margin: 20px 0;
  }
  .text-second {
    color: rgb(215, 215, 215);
  }
  .retinueArea {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
