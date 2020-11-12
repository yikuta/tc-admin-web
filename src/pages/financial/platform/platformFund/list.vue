<template>
  <div class="app-container">
    <el-row :gutter="20" class="desc-list">
      <el-col :span="8" class="desc-item">
        <span class="label">统计开始时间：</span>
        <span class="content">{{collection['summaryBeginTime']}}</span>
      </el-col>

      <el-col :span="8" class="desc-item">
        <span class="label">统计截止时间：</span>
        <span class="content">{{collection['summaryEndTime']}}</span>
      </el-col>
    </el-row>
    <div class="card-list">
      <el-card class="card-item" v-for="card in cardList" :key="card.type">
        <div class="title">{{card.title}}</div>
        <div class="rows">
          <div class="row" v-for="item in card.descList" :key="item.prop">
            <span>{{item.label}}：</span>
            ¥ {{collection[card.prop] && collection[card.prop][item.prop]}}
          </div>
        </div>
        <div class="buttons">
          <el-button
            size="mini"
            type="danger"
            v-np="card.type == 3 ?'TL_BALANCE_RECHARGE':(card.type == 4 ? 'TL_MARKET_RECHARGE' :(card.type == 2 ? 'WEIXIN_RECHARGE':'ALIPAY_RECHARGE' ))"
            @click="handleOpenRecharge(card.type)"
          >充值记账</el-button>
          <el-button
            size="mini"
            type="success"
            v-np="card.type == 3 ?'TL_BALANCE_WITHDRAWAL':(card.type == 4 ? 'TL_MARKET_WITHDRAWAL' :(card.type == 2 ? 'WEIXIN_WITHDRAWAL':'ALIPAY_WITHDRAWAL' ))"
            @click="handleOpenWithdrawal(card.type)"
          >提&nbsp;&nbsp;现</el-button>
          <el-button size="mini" type="primary" plain @click="handleCheckDetail(card.type)">查看明细</el-button>
        </div>
      </el-card>
    </div>
    <div class="annotation">
      *注：
      <ul>
        <li>1、支付宝、微信账户目前仅针对商家采购的支付宝、微信直连付款；微信账户同时支持团长、快配员、加盟商的提现，提现前请向微信账户进行充值；</li>
        <li>2、通联账户对应小程序支付（微信支付）、天呈生活APP支付宝和微信支付、天呈生活商家版余额支付等；</li>
        <li>3、通联营销账户主要应用于结算给商家的优惠券相关支出；</li>
        <li>
          4、微信、支付宝账户的充值和所有账户的提现功能仅作账户的相关记录，实际操作请财务人员登录对应的商户后台操作；
          <span class="red-color">通联余额、通联营销账户的提现为实际提现，请财务人员谨慎操作；</span>
        </li>
        <li>5、支付宝账户、微信账户因未提供查询余额接口，查询实时余额请财务人员登录相应商户后台查看；</li>
      </ul>
    </div>
    <recharge-dialog :visible.sync="rechargeVisible" :type="rechargeType"></recharge-dialog>
    <withdrawal-dialog :visible.sync="withdrawalVisible" :type="withdrawalType"></withdrawal-dialog>
  </div>
</template>
<script>
import { cardList } from './const/list'
import { fetchPlatformSummary } from '@/api/financial/platform'
export default {
  name: 'PlatformFund',
  components: {
    RechargeDialog: () => import('./templates/RechargeDialog'),
    WithdrawalDialog: () => import('./templates/WithdrawalDialog')
  },
  data() {
    return {
      cardList,
      rechargeVisible: false,
      rechargeType: 1,
      withdrawalVisible: false,
      withdrawalType: 1,
      collection: {
        weChatAccount: {},
        tongLianStandardAccount: {},
        aliPayAccount: {},
        tongLianMarketingAccount: {}
      }
    }
  },
  mounted() {
    this.fetchPlatformSummary()
  },
  methods: {
    fetchPlatformSummary() {
      fetchPlatformSummary().then(res => {
        if (res.code === 200) {
          this.collection = res.result
        }
      })
    },
    handleOpenRecharge(rechargeType) {
      this.rechargeType = rechargeType
      this.rechargeVisible = true
    },
    handleOpenWithdrawal(withdrawalType) {
      this.withdrawalType = withdrawalType
      this.withdrawalVisible = true
    },
    handleCheckDetail(type) {
      if (type !== 4) {
        this.$router.push({
          path: '/financial/platform/platformFund/platformDetail',
          query: { accountType: type }
        })
      } else {
        this.$router.push({
          path: '/financial/platform/platformFund/marketDetail'
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.card-list {
  padding-top: 10px;
  font-size: 0;

  .card-item {
    display: inline-block;
    vertical-align: top;
    border: 1px solid #409eff;
    width: 298px;
    margin: 0 15px 20px 15px;
    font-size: 14px;

    .title {
      text-align: center;
      font-size: 23px;
      margin-bottom: 22px;
    }

    .rows {
      min-height: 240px;
      padding-left: 20px;

      .row {
        line-height: 40px;

        span {
          color: #999;
        }
      }
    }

    .buttons {
      padding-top: 24px;
      padding-bottom: 10px;
      text-align: center;
    }
  }
}
.annotation {
  font-size: 14px;
  line-height: 30px;

  ul {
    color: #666;
    list-style: none;
    margin-top: 0;

    .red-color {
      color: #f56c6c;
    }
  }
}
</style>
