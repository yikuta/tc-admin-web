<template>
  <div class="wrapper">
    <content-area contentTitle="用户信息" :titleStyle="false">
      <el-row class="second-title">基本信息</el-row>
      <el-row class="content-text" :style="{marginBottom:'40px'}">
        <el-col :span="colSpan[2]">
          <el-row>
            <el-col :span="colSpan[1]">昵称：{{ user.nickName }}</el-col>
            <el-col class="space-between" :span="colSpan[1]">
              <span>性别：{{ user.sex | statusDescrible }}</span>
              <span>生日：{{ user.birthday | format('yyyy-MM-dd') }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="colSpan[1]">用户手机：{{ user.memberPhone }}</el-col>
            <el-col :span="colSpan[1]">城市：{{ user.city }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="colSpan[1]">用户编号：{{ user.memberCode }}</el-col>
            <el-col :span="colSpan[1]">终端来源：{{ user.terminalType | statusDescrible }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="colSpan[1]">微信绑定：{{ user.memberBingSituation | statusDescrible }}</el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="colSpan[1]">微博授权：{{ user.weibo }}</el-col>
          </el-row> -->
          <el-row>
            <el-col :span="colSpan[1]">会员等级：{{ user.gradeName }}</el-col>
            <el-col :span="colSpan[1]">信誉等级：{{ user.credit }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="colSpan[1]">
              地址信息：
              <el-link type="primary" v-np='"MEMBER_ADDRESS_VIEW"' @click="handleAddressList">{{ user.addressCount }}条</el-link>
            </el-col>
            <el-col :span="colSpan[1]">
              <el-link type="primary" v-np='"MEMBER_BROWSE_HISTORY_VIEW"' @click="handleGoodsLookHistory">商品浏览记录</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="colSpan[3]">
              用户标签：
              <el-tag
                :style="{marginRight:'10px',marginTop:'5px'}"
                v-for="item of user.lables"
                :key="item.value"
                v-if='item.describe !== "未知" && item.describe !== "无" && item.describe !== undefined'>{{ item.describe }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="end-column" :span="colSpan[0]">
          <el-row class="content-text-second">注册时间：{{ user.createTime | format('yyyy-MM-dd HH:mm:ss') }}</el-row>
          <el-row class="content-text-second">最后登录时间：{{ user.updateTime | format('yyyy-MM-dd HH:mm:ss') }}</el-row>
          <el-row :style="{marginTop:'60px',textAlign:'center'}">
            <el-image style="width: 100px; height: 100px" :src="user.photo" fit="fill"></el-image>
            <div>
              <el-button type="text" v-np='user.isBlack?"MEMBER_BLACK_LIST_REMOVE":"MEMBER_BLACK_LIST_ADD"' @click="handleSetting(1, user.isBlack ? 'remove':'add')">{{user.isBlack ? '移除黑名单' : '设为黑名单'}}</el-button>
              <el-button type="text" v-np='user.isGrey?"MEMBER_GRAY_LIST_REMOVE":"MEMBER_GRAY_LIST_ADD"' @click="handleSetting(2, user.isGrey ? 'remove':'add')">{{user.isGrey ? '移除灰名单' : '设为灰名单'}}</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="second-title">营销、订单、积分</el-row>
      <el-row>
        <el-table :data="tableData1" style="width: 100%;margin-top:20px;" size="mini" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
          <el-table-column prop="coupon" label="优惠券（张）">
            <el-link type="primary" slot-scope="{row}" v-np='"MEMBER_COUPON_LIST_VIEW"' @click="handleCouponList(row)">{{row['coupon']}}</el-link>
          </el-table-column>
          <el-table-column prop="sellerOrder" label="商家订单（条）">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('merchantOwned')">{{row['sellerOrder']}}</el-link>
          </el-table-column>
          <el-table-column prop="hotOrder" label="爆品订单（条）">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('productPreSale')">{{row['hotOrder']}}</el-link>
          </el-table-column>
          <el-table-column prop="expressOrder" label="快递到家订单">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('expressSerivice')">{{row['expressOrder']}}</el-link>
          </el-table-column>
          <el-table-column prop="score" label="可用积分">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('creditsLog')">{{row['score']}}</el-link>
            <!-- <span slot-scope="{row}">{{row['score']}}</span> -->
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="second-title">收藏信息</el-row>
      <el-row>
        <el-table :data="tableData2" style="width: 100%;margin-top:20px;" size="mini" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
          <el-table-column prop="store" label="门店">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('activityCollection')">{{row['activity']}}</el-link>
          </el-table-column>
          <el-table-column prop="goods" label="商品">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('goodsCollection')">{{row['goods']}}</el-link>
          </el-table-column>
          <el-table-column prop="menu" label="菜谱">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('menuCollection')">{{row['menu']}}</el-link>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- <el-row class="second-title">订阅信息</el-row>
      <el-row>
        <el-table :data="tableData3" style="width: 100%;margin-top:20px;" size="mini" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
          <el-table-column prop="goods" label="商品">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('productSubscribe')">{{row['goods']}}</el-link>
          </el-table-column>
          <el-table-column prop="activity" label="活动">
            <el-link type="primary" slot-scope="{row}" @click="handleRoute('activitySubscribe')">{{row['activity']}}</el-link>
          </el-table-column>
        </el-table>
      </el-row> -->
    </content-area>
  </div>
</template>

<script>
import { Common, Detail } from './components'
import { reqUserDetail, asyncBlackAdd, asyncBlackRemove } from '@/api/user'

export default {
  name: 'detail',
  components: { ...Common, ...Detail },
  data() {
    return {
      memberCode: '',
      memberId: '',
      colSpan: [9, 12, 15, 24],
      user: {
        nickName: '',
        sex: {},
        birthday: '',
        memberPhone: '',
        isBlack: false,
        isGrey: false,
        city: '',
        memberCode: '',
        terminalType: {},
        memberBingSituation: '',
        weibo: '-',
        gradeName: '',
        credit: '',
        couponList: [{ couponName: '这是个优惠券', expire: '2020-04-11' }],
        addressListNum: '3',
        lables: [],
        registerTime: '2020-04-01',
        lastLoginTime: '2020-04-01',
        avatar:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587536564948&di=667afb256d782d29af55b210e2143c98&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190527%2Fbab59041e4d6455e8bc66d544aedd596.jpeg'
      },
      tableData1: [],
      tableData2: [],
      tableData3: [{ goods: 5, activity: 2 }]
    }
  },
  mounted() {
    const { memberCode, memberId, memberPhone } = this.$route.query
    this.memberCode = memberCode || ''
    this.memberId = memberId || ''
    this.$nextTick(() => {
      this._reqUserDetail(this.memberCode, memberPhone)
    })
  },
  methods: {
    /**
     * @description: 地址列表
     */
    handleAddressList() {
      const { memberCode } = this.$route.query
      // 请求地址列表
      const h = this.$createElement
      this.$msgbox({
        title: '地址列表',
        customClass: 'address-list-model-style',
        message: h(
          'AddressTable',
          {
            props: {
              memberCode
            }
          },
          null
        ),
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: '关闭'
      }).catch(() => {
      })
    },
    /**
     * @description: 跳转商品浏览记录
     */
    handleGoodsLookHistory() {
      this.$router.push({
        path: '/user/productHistory',
        query: {
          code: this.user.memberCode
        }
      })
    },
    /**
     * @description: 优惠券列表
     */
    handleCouponList() {
      // 请求优惠券列表
      const h = this.$createElement
      this.$msgbox({
        title: '优惠券列表',
        customClass: 'coupon-list-model-style',
        message: h(
          'CouponTable',
          {
            props: {
              id: this.$route.query.memberId
            }
          },
          null
        ),
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: '关闭'
      }).catch(() => {
      })
    },
    /**
     * @description: 处理路由跳转
     */
    handleRoute(target = 'goodsCollection') {
      const routeList = {
        goodsCollection: '/user/productCollection',
        activityCollection: '/user/storeCollection',
        menuCollection: '/user/menuCollection',
        productSubscribe: '/user/productSubscribe',
        activitySubscribe: '/user/activitySubscribe',
        creditsLog: '/user/creditsLog',
        merchantOwned: '/order/merchantOwned',
        productPreSale: '/order/productPreSale',
        expressSerivice: '/order/expressService'
      }
      this.$router.push({
        path: routeList[target],
        query: {
          code: this.user.code,
          memberCode: this.$route.query.memberCode,
          memberPhone: this.$route.query.memberPhone
        }
      })
    },
    _reqUserDetail(memberCode, memberPhone) {
      return reqUserDetail({ memberCode, memberPhone })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.user = result
            this.tableData1 = [{
              coupon: result.couponCount || 0,
              sellerOrder: result.businessNumber || 0,
              hotOrder: result.explosiveNumber || 0,
              expressOrder: result.deliveryNumber || 0,
              score: result.pandaStone || 0
            }]
            this.tableData2 = [{
              goods: result.productCollectCount || 0,
              activity: result.shopCollectCount || 0,
              menu: result.collectCookbookCount || 0
            }]
          }
        })
        .catch(() => {})
    },
    handleSetting(type, opera) {
      if (opera === 'add') {
        this.$confirm(`用户被加入${type === 1 ? '黑名单' : '灰名单'}以后会是去相对应的操作权限，确认要加入吗?`, '确认', {}).then(() => {
          asyncBlackAdd({
            memberId: this.memberId,
            memberGreyBlackType: type === 1 ? 'BLACK' : 'GREY'
          }).then(res => {
            if (res.code === 200) {
              const { memberCode, memberPhone } = this.$route.query
              this.$message.success('设置成功')
              this._reqUserDetail(memberCode, memberPhone)
            }
          })
        })
      } else {
        asyncBlackRemove({
          memberId: this.memberId,
          memberGreyBlackType: type === 1 ? 'BLACK' : 'GREY'
        }).then(res => {
          if (res.code === 200) {
            const { memberCode, memberPhone } = this.$route.query
            this.$message.success('移除成功')
            this._reqUserDetail(memberCode, memberPhone)
          }
        }).catch(() => {
          this.$message.error('移除失败')
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@mixin title {
  border-left: 6px solid rgba(64, 158, 255, 1);
  padding-left: 10px;
  color: rgba(64, 158, 255, 1);
}
.wrapper {
  .second-title {
    @include title();
    margin-bottom: 20px;
  }
  .content-text {
    color: #7f7f7f;
    font-size: 15px;
  }
  .content-text-second {
    @extend .content-text;
    color: rgb(215, 215, 215);
  }
  /deep/ .el-card__body {
    padding: 20px 50px;
  }
  .space-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .end-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .el-row {
    margin-top: 20px;
  }
  /deep/ .el-table::before {
    height: 0px;
  }
  /deep/ .el-table td {
    border: none;
  }
}
</style>
<style lang='scss'>
@mixin list-model-style {
  width: 1000px;
  max-height: 700px;
}
.address-list-model-style {
  @include list-model-style();
}
.coupon-list-model-style {
  @include list-model-style();
}
</style>
