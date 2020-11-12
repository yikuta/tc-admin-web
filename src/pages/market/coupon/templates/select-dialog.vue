<template>
  <div class="select-dialog">
    <el-dialog
    :title="selectType == 'depot' ? '选择可用店铺' : '选择可用商品'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="85%">
      <el-form :model="depotForm" v-if="selectType == 'depot'">
        <el-form-item label="">
          <div class="">
            <el-radio label="ALL" v-model="depotForm.usableType">全部店铺</el-radio>
          </div>
          <div class="coupon-setting">
            <el-radio label="USABLE" v-model="depotForm.usableType">指定可用</el-radio>
            <el-radio-group v-if="depotForm.usableType === 'USABLE'" v-model="depotForm.shopOptionalType">
              <el-radio label="TYPE">按门店类型</el-radio>
              <el-radio label="AREA">按门店区域</el-radio>
              <el-radio label="CODE">指定具体门店</el-radio>
            </el-radio-group>
            <div class="box">
              <template v-if="depotForm.usableType == 'USABLE' && depotForm.shopOptionalType == 'TYPE'">
                <select-depot-type :selected="depotForm.shopTypeList" :putOnStatusOptions="typeList" @on-checked-type="onCheckedType"></select-depot-type>
              </template>
              <template v-if="depotForm.usableType == 'USABLE' && depotForm.shopOptionalType == 'AREA'">
                <select-depot-area :selected="depotForm.areaList" :options="depotOptions" :optionProps="depotOptionProps" @on-select-area="onSelectArea"></select-depot-area>
              </template>
              <template v-if="depotForm.usableType == 'USABLE' && depotForm.shopOptionalType == 'CODE'">
                <select-depots :selected="depotForm.shopCodeList" :options="depotOptions" :optionProps="depotListOptionProps" :putOnStatusOptions="typeList" @on-select-depots="onSelectDepot"></select-depots>
              </template>
            </div>
          </div>
          <div class="coupon-setting">
            <el-radio label="UNUSABLE" v-model="depotForm.usableType">指定不可用</el-radio>
            <el-radio-group v-if="depotForm.usableType === 'UNUSABLE'" v-model="depotForm.shopOptionalType">
              <el-radio label="TYPE">按门店类型</el-radio>
              <el-radio label="AREA">按门店区域</el-radio>
              <el-radio label="CODE">指定具体门店</el-radio>
            </el-radio-group>
            <div class="box">
              <template v-if="depotForm.usableType == 'UNUSABLE' && depotForm.shopOptionalType == 'TYPE'">
                <select-depot-type :selected="depotForm.shopTypeList" :putOnStatusOptions="typeList" @on-checked-type="onCheckedType"></select-depot-type>
              </template>
              <template v-if="depotForm.usableType == 'UNUSABLE' && depotForm.shopOptionalType == 'AREA'">
                <select-depot-area :selected="depotForm.areaList" :options="depotOptions" :optionProps="depotOptionProps" @on-select-area="onSelectArea"></select-depot-area>
              </template>
              <template v-if="depotForm.usableType == 'UNUSABLE' && depotForm.shopOptionalType == 'CODE'">
                <select-depots :selected="depotForm.shopCodeList" :options="depotOptions" :optionProps="depotListOptionProps" :putOnStatusOptions="typeList" @on-select-depots="onSelectDepot"></select-depots>
              </template>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-form :model="goodsForm" v-else>
        <el-form-item label="">
          <div class="">
            <el-radio label="ALL" v-model="goodsForm.usableType">全部商品可用</el-radio>
          </div>
          <div class="coupon-setting">
            <el-radio label="USABLE" v-model="goodsForm.usableType">指定商品可用</el-radio>
            <el-radio-group v-if="goodsForm.usableType === 'USABLE'" v-model="goodsForm.commodityOptionalType">
              <el-radio label="TYPE">分类</el-radio>
              <el-radio label="CODE">商品</el-radio>
            </el-radio-group>
            <div class="box">
              <template v-if="goodsForm.usableType == 'USABLE' && goodsForm.commodityOptionalType == 'TYPE'">
                <select-goods-type :selected="goodsForm.categoryIdList" :businessType="businessType" :options="goodsOptions" :optionProps="goodsOptionProps" @on-select-kind="onSelectKind"></select-goods-type>
              </template>
              <template v-if="goodsForm.usableType == 'USABLE' && goodsForm.commodityOptionalType == 'CODE'">
                <select-goods :selected="goodsForm.commodityNoList" :businessType="businessType" :options="goodsOptions" :optionProps="goodsOptionProps" @on-select-goods="onSelectGoods"></select-goods>
              </template>
            </div>
          </div>
          <div class="coupon-setting">
            <el-radio label="UNUSABLE" v-model="goodsForm.usableType">指定商品不可用</el-radio>
            <el-radio-group v-if="goodsForm.usableType === 'UNUSABLE'" v-model="goodsUnusable">
              <el-radio label="TYPE">分类</el-radio>
              <el-radio label="CODE">商品</el-radio>
            </el-radio-group>
            <div class="box">
              <template v-if="goodsForm.usableType == 'UNUSABLE' && goodsUnusable == 'TYPE'">
                <select-goods-type :selected="goodsForm.categoryIdList" :businessType="businessType" :options="goodsOptions" :optionProps="goodsOptionProps" @on-select-kind="onSelectKind"></select-goods-type>
              </template>
              <template v-if="goodsForm.usableType == 'UNUSABLE' && goodsUnusable == 'CODE'">
                <select-goods :selected="goodsForm.commodityNoList" :businessType="businessType" :options="goodsOptions" :optionProps="goodsOptionProps" @on-select-goods="onSelectGoods"></select-goods>
              </template>
            </div>
          </div>
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
  import { findAll } from '@/api/common'
  import { reqShopTypeAll, reqCategoryAll } from '@/api/coupon'
  import Pagination from '@/components/Pagination'
  import SelectDepotType from './select-depot-type'
  import SelectDepotArea from './select-depot-area'
  import SelectDepots from './select-depots'
  import SelectGoodsType from './select-goods-type'
  import SelectGoods from './select-goods'
  export default {
    name: 'SelectDialog',
    components: {
      Pagination,
      SelectDepotType,
      SelectDepotArea,
      SelectDepots,
      SelectGoodsType,
      SelectGoods
    },
    props: {
      selectType: {
        type: String,
        default: 'depot'
      },
      shopSetlected: {
        type: Object,
        default: () => {}
      },
      commoditySelected: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        dialogVisible: false,
        selectDepot: 'canAdd',
        depotUsable: 'TYPE',
        depotUnusable: 'TYPE',
        depotForm: {
          usableType: 'ALL',
          shopOptionalType: 'TYPE',
          shopTypeList: [],
          areaList: [],
          shopCodeList: []
        },
        goodsUsable: 'TYPE',
        goodsUnusable: 'TYPE',
        goodsForm: {
          usableType: 'ALL',
          commodityOptionalType: 'TYPE',
          categoryIdList: [],
          commodityNoList: []
        },
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
          name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          code: { value: '', name: 'channelCategories.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          area: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.LIST }
        },
        typeList: [] // 门店type数组
      }
    },
    mounted() {
      this._findAll()
      this._reqShopTypeAll()
      this._reqCategoryAllOne()
      this._reqCategoryAllTwo()
    },
    methods: {
      businessTypeSet(type) {
        // 适用业务改变时，商品分类改变
        this.businessType = type
        let _this = this
        setTimeout(() => { // 用于编辑商品分类接口数据返回过慢导致无法回显的问题
          if (type === 'PRE_SALE') {
            _this.goodsOptions = _this.pre_sale
          } else {
            _this.goodsOptions = _this.logistics
          }
        }, 500)
      },
      onCheckedType(val) {
        // 门店type改变
        this.depotForm.shopTypeList = val
      },
      onSelectArea(val) {
        // 门店区域改变
        this.depotForm.areaList = val
      },
      onSelectDepot(val) {
        // 指定门店改变
        this.depotForm.shopCodeList = val
      },
      onSelectKind(val) {
        // 商品分类改变
        this.goodsForm.categoryIdList = val
      },
      onSelectGoods(val) {
        // 指定商品改变
        this.goodsForm.commodityNoList = val
      },
      showDialog() {
        this.dialogVisible = true
        this.depotForm = JSON.parse(JSON.stringify(this.shopSetlected))
        this.goodsForm = JSON.parse(JSON.stringify(this.commoditySelected))
      },
      cancel() {
        this.depotForm = {
          usableType: 'ALL',
          shopOptionalType: null,
          shopTypeList: [],
          areaList: [],
          shopCodeList: []
        }
        // if (this.selectType === 'depot') {
        //   this.$emit('on-dialog-cancel')
        // } else {
        //   this.$emit('on-dialog-cancel')
        // }
        this.dialogVisible = false
      },
      save() {
        if (this.selectType === 'depot') {
          if (this.depotForm.usableType === 'USABLE' || this.depotForm.usableType === 'UNUSABLE') {
            if (this.depotForm.shopOptionalType === 'TYPE' && this.depotForm.shopTypeList.length === 0) {
              this.$message({
                message: '请选择至少一个门店类型',
                type: 'error'
              })
              return false
            } else if (this.depotForm.shopOptionalType === 'AREA') {
              if (this.depotForm.areaList.length === 0) {
                this.$message({
                  message: '请选择至少一个门店区域',
                  type: 'error'
                })
                return false
              } else {
                // 校验门店区域
                if (this.depotForm.areaList.length >= 2) {
                  let arealist = JSON.parse(JSON.stringify(this.depotForm.areaList))
                  for (let index = 0; index < arealist.length; index++) {
                    let item = arealist[index]
                    for (let elindex = 0; elindex < arealist.length; elindex++) {
                      let el = arealist[elindex]
                      if (index < elindex) {
                        if (item.province.code === el.province.code) {
                          if (item.city && el.city) {
                            if (item.city.code === el.city.code) {
                              if (item.county && el.county) {
                                if (item.county.code === el.county.code) {
                                  // 区重复
                                  this.$message({
                                    message: '区域范围不能交叉',
                                    type: 'error'
                                  })
                                  return false
                                }
                              } else {
                                // 城市包含
                                this.$message({
                                  message: '区域范围不能交叉',
                                  type: 'error'
                                })
                                return false
                              }
                            }
                          } else {
                            // 省包含
                            this.$message({
                              message: '区域范围不能交叉',
                              type: 'error'
                            })
                            return false
                          }
                        }
                        // else {
                        //   if (item.city && el.city) {
                        //     if (item.city.code === el.city.code) {
                        //       if (item.county && el.county) {
                        //         if (item.county.code === el.county.code) {
                        //           // 区重复
                        //           this.$message({
                        //             message: '区域范围不能交叉，区重复2',
                        //             type: 'error'
                        //           })
                        //           return false
                        //         }
                        //       }
                        //     } else {
                        //       // 市包含
                        //       this.$message({
                        //         message: '区域范围不能交叉，城市包含2',
                        //         type: 'error'
                        //       })
                        //       return false
                        //     }
                        //   }
                        // }
                      }
                    }
                  }
                }
              }
            } else if (this.depotForm.shopOptionalType === 'CODE' && this.depotForm.shopCodeList.length === 0) {
              this.$message({
                message: '请选择至少一个指定门店添加到已选门店',
                type: 'error'
              })
              return false
            }
          }
          this.$emit('on-dialog-save', this.depotForm)
        } else {
          if (this.goodsForm.usableType === 'USABLE' || this.goodsForm.usableType === 'UNUSABLE') {
            if (this.goodsForm.commodityOptionalType === 'TYPE') {
              if (this.goodsForm.categoryIdList.length === 0) {
                this.$message({
                  message: '请选择至少一个商品分类',
                  type: 'error'
                })
                return false
              } else {
                if (this.goodsForm.categoryIdList.length >= 2) {
                  let goodslist = JSON.parse(JSON.stringify(this.goodsForm.categoryIdList))
                  for (let index = 0; index < goodslist.length; index++) {
                    let item = goodslist[index]
                    for (let elindex = 0; elindex < goodslist.length; elindex++) {
                      let el = goodslist[elindex]
                      if (index < elindex) {
                        if (item.kind1.id === el.kind1.id) {
                          if (item.kind2 && el.kind2) {
                            if (item.kind2.id === el.kind2.id) {
                              this.$message({
                                message: '商品分类范围不能交叉',
                                type: 'error'
                              })
                              return false
                            }
                          } else {
                            // 一级包含
                            this.$message({
                              message: '商品分类范围不能交叉',
                              type: 'error'
                            })
                            return false
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else if (this.goodsForm.commodityOptionalType === 'CODE' && this.goodsForm.commodityNoList.length === 0) {
              this.$message({
                message: '请选择至少一个指定商品添加到已选商品',
                type: 'error'
              })
              return false
            }
          }
          this.$emit('on-dialog-save', this.goodsForm)
        }
        this.dialogVisible = false
      },
      _findAll() {
        return findAll().then((res) => {
          let data = res.result
          data.map((item) => {
            item.children.map((child) => {
              child.children.map((el) => {
                delete el.children
              })
            })
          })
          this.depotOptions = data
        })
      },
      _reqShopTypeAll() {
        return reqShopTypeAll({
        })
          .then(res => {
            if (res.code === 200) {
              this.typeList = res.result
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
            }
          })
      },
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
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
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
