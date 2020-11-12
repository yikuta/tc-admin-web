<template>
  <div class="select-dialog">
    <el-dialog
    :title="selectType == 'depot' ? '选择可用店铺' : '选择可用商品'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="85%">
      <el-form :model="depotForm" v-if="selectType == 'depot'">
        <!-- <el-form-item label="">
          <select-depots :selected="depotForm" :options="depotOptions" :optionProps="depotListOptionProps" :putOnStatusOptions="typeList" @on-select-depots="onSelectDepot"></select-depots>
        </el-form-item> -->
      </el-form>
      <el-form v-else>
        <el-form-item label="">
          <select-goods :form="form" :selected="goodsForm" :pre_sale="pre_sale" :logistics="logistics" :optionProps="goodsOptionProps" @on-select-goods="onSelectGoods"></select-goods>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // let id = 0
  import { MatchType, DataType } from '@/constants/search'
  // import { findAll } from '@/api/common'
  import { reqCategoryAll } from '@/api/coupon'
  import Pagination from '@/components/Pagination'
  // import SelectDepots from './select-depots'
  import SelectGoods from './select-goods'
  export default {
    name: 'SelectDialog',
    components: {
      Pagination,
      SelectGoods
    },
    props: {
      selectType: {
        type: String,
        default: 'depot'
      },
      shopSetlected: {
        type: Array,
        default: () => []
      },
      commoditySelected: {
        type: Array,
        default: () => []
      },
      form: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        dialogVisible: false,
        selectDepot: 'canAdd',
        depotForm: [],
        goodsForm: {},
        depotOptions: [],
        depotOptionProps: {
          checkStrictly: true,
          value: 'code',
          label: 'name'
        },
        depotListOptionProps: {
          checkStrictly: true,
          value: 'code',
          label: 'name'
        },
        businessType: '',
        pre_sale: [],
        logistics: [],
        goodsOptions: [],
        goodsOptionProps: {
          checkStrictly: true,
          value: 'id',
          label: 'name',
          children: 'children'
        },
        searchForm: {
          name: { value: '', name: 'channelCommodityName', matchType: MatchType.IN, type: DataType.STRING },
          code: { value: '', name: 'channelCategories.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          area: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.LIST }
        },
        typeList: [] // 门店type数组
      }
    },
    mounted() {
      // this._findAll()
      // this._reqShopTypeAll()
      this._reqCategoryAllOne()
      this._reqCategoryAllTwo()
    },
    methods: {
      businessNo(val) {
        // 适用业务改变时，商品分类改变
        if (val === 2) {
          this.goodsOptions = this.pre_sale
        } else {
          this.goodsOptions = this.logistics
        }
      },
      onSelectDepot(val) {
        // 指定门店改变
        this.depotForm = val
      },
      onSelectGoods(val) {
        // 指定商品改变
        this.goodsForm = val
      },
      showDialog() {
        this.dialogVisible = true
        this.depotForm = JSON.parse(JSON.stringify(this.shopSetlected))
        this.goodsForm = JSON.parse(JSON.stringify(this.commoditySelected))
      },
      cancel() {
        this.depotForm = []
        this.dialogVisible = false
      },
      save() {
        if (!this.goodsForm.id) {
          this.$message({
            message: '请选择拼团活动适用商品',
            type: 'error'
          })
          return false
        }
        this.$emit('on-dialog-save', this.goodsForm)
        this.dialogVisible = false
      },
      // _findAll() {
      //   return findAll().then((res) => {
      //     let data = res.result
      //     data.map((item) => {
      //       item.children.map((child) => {
      //         child.children.map((el) => {
      //           delete el.children
      //         })
      //       })
      //     })
      //     this.depotOptions = data
      //   })
      // },
      // _reqShopTypeAll() {
      //   return reqShopTypeAll({
      //   })
      //     .then(res => {
      //       if (res.code === 200) {
      //         this.typeList = res.result
      //       } else {
      //         // this.$message({
      //         //   message: res.message,
      //         //   type: 'error'
      //         // })
      //       }
      //     })
      // },
      _reqCategoryAllOne() {
        return reqCategoryAll({
          channelCommodityType: 1
        })
          .then(res => {
            if (res.code === 200) {
              this.logistics = res.result
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
            }
          })
      },
      _reqCategoryAllTwo() {
        return reqCategoryAll({
          channelCommodityType: 2
        })
          .then(res => {
            if (res.code === 200) {
              this.pre_sale = res.result
              // this.goodsOptions = this.pre_sale
            }
          })
      }
    }
  }
</script>

<style scoped lang="scss">
.box {
  margin-left: 110px;
  .checkbox {
    max-height: 400px;
  }
}
.input-width {
  width: 200px;
}
.depotSelect {
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
</style>
