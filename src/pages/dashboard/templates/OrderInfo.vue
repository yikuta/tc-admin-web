<template>
  <div class="orderInfo">
    <div class="order-head">订单信息</div>
    <div class="order-main">
      <div class="part-one">
        <p class="text" style="text-align: right;">{{new Date() | format('yyyy-MM-dd')}}</p>
        <ul class="part-main">
          <li v-for="(item, index) in linkList" :key="index" :style="`background: ${item.bgColor}`" @click="handleLink(item.link)">
            <p>{{item.name}}</p>
            <p style="margin-top:14px">{{item.count}}单</p>
          </li>
        </ul>
      </div>
      <div class='part-two'>
        <p class="text" style="text-align: right;">近7日订单趋势（不区分城市）</p>
        <div class="part-main">
          <div class="part-line">
            <ve-line 
              :data="preSaleData" 
              :legend-visible="false" 
              :colors="colors" 
              width='100%' 
              :extend="chartExtend"></ve-line>
            <p class="text">爆品预售</p>
          </div>
          <div class="part-line">
            <ve-line :data="chartData" :legend-visible="false"  :colors="colors" width='100%' :extend="chartExtend"></ve-line>
            <p class="text">快递到家</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { workbenchCountThreeOrder, workbenchCountTodayOrder } from '@/api/dashboard'
export default {
  data() {
    this.chartExtend = {
      'yAxis.0.splitLine.lineStyle.type': 'dashed',
      series(v) {
        v.forEach(i => {
          i.smooth = false
        })
        return v
      }
    }
    return {
      colors: ['rgb(64, 158, 255)'],
      linkList: [
        {
          name: '爆品预售',
          key: 'orderExplosivePreSaleNum',
          count: '0',
          link: '/order/productPreSale',
          bgColor: 'rgba(64, 158, 255, 1)'
        },
        {
          name: '快递到家',
          key: 'orderHomeDeliveryNum',
          count: '0',
          link: '/order/expressService',
          bgColor: 'rgba(103, 194, 58, 1)'
        },
        {
          name: '商家采购',
          key: 'orderBusinesPurchaseNum',
          count: '0',
          link: '/order/merchantProcurement',
          bgColor: 'rgba(230, 162, 60, 1)'
        },
        {
          name: '商家自营',
          key: 'orderMerchantOwnedNum',
          count: '0',
          link: '/order/merchantOwned',
          bgColor: 'rgba(245, 108, 108, 1)'
        }
      ],
      chartSettings: {
        stack: { '用户': ['访问用户', '下单用户'] },
        area: true
      },
      preSaleData: {
        columns: ['日期', '爆品预售'],
        rows: [
          { '日期': '7-31', '爆品预售': '3456' },
          { '日期': '8-1', '爆品预售': '2567' },
          { '日期': '8-2', '爆品预售': '3688' },
          { '日期': '8-3', '爆品预售': '3990' },
          { '日期': '8-4', '爆品预售': '5001' },
          { '日期': '8-5', '爆品预售': '4678' },
          { '日期': '8-6', '爆品预售': '3456' }
        ]
      },
      chartData: {
        columns: ['日期', '快递到家'],
        rows: [
          { '日期': '7-31', '快递到家': '3456' },
          { '日期': '8-1', '快递到家': '2567' },
          { '日期': '8-2', '快递到家': '3688' },
          { '日期': '8-3', '快递到家': '2999' },
          { '日期': '8-4', '快递到家': '3990' },
          { '日期': '8-5', '快递到家': '3695' },
          { '日期': '8-6', '快递到家': '2890' }
        ]
      }
    }
  },
  mounted() {
    this.handleDataList()
  },
  methods: {
    handleLink(link) {
      let date = this.format(new Date(), 'yyyy-MM-dd')
      this.$router.push({ path: link, query: { date }})
    },
    handleDataList() {
      workbenchCountThreeOrder('ORDER_EXPLOSIVE_PRE_SALE').then(res => {
        if (res.code === 200) {
          this.preSaleData.rows = res.result.map(item => {
            return {
              '日期': item.dateTime ? this.format(item.dateTime, 'MM-dd') : '',
              '爆品预售': item.num
            }
          })
        }
      })
      workbenchCountThreeOrder('ORDER_HOME_DELIVERY').then(res => {
        if (res.code === 200) {
          this.chartData.rows = res.result.map(item => {
            return {
              '日期': item.dateTime ? this.format(item.dateTime, 'MM-dd') : '',
              '快递到家': item.num
            }
          })
        }
      })
      workbenchCountTodayOrder().then(res => {
        if (res.code === 200) {
          if (res.result) {
            this.linkList.map(item => {
              Object.keys(res.result).forEach(key => {
                if (key === item.key) {
                  item.count = this.moneyFormat(res.result[key])
                }
              })
            })
          }
        }
      })
    },
    // 时间转换
    format(time, format) {
      if (!time) return '-'
      let t = new Date(time)
      let tf = function(i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'mm':
            return tf(t.getMinutes())
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours())
          case 'ss':
            return tf(t.getSeconds())
        }
      })
    },
    // 金额转换
    moneyFormat(money) {
      if (money) {
        // 判断是否为数字
        if (!isNaN(parseFloat(money)) && isFinite(money)) {
          money = Number(money)
          let str1 = parseInt(money % 10000)
          // 保留两位 （未处理四舍五入）
          if (str1.toString().length && str1.toString().length >= 2) {
            str1 = str1.toString().substring(0, 2)
          }
          let str2 = parseInt(money / 10000)
          if (str2) {
            str2 = str2.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',')
            return str2 + '.' + str1 + 'w'
          } else {
            return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',')
          }
        }
      } else {
        return money
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.orderInfo{
  .order-head{
    font-size: 16px;
    font-weight: 500;
  }
  .order-main{
    width: 90%;
    margin: 0 auto;
  }
  .text{
    text-align: center;
    margin: 0;
    font-size: 14px;
    color: #7F7F7F;
  }
  .part-one{
    ul{
      display: flex;
      justify-content: space-between;
      li{
        padding: 14px 0;
        list-style: none;
        width: 20%;
        height: 78px;
        cursor: pointer;
        text-align: center;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        p{
          margin: 0;
        }
      }
    }
  }
  .part-two{
    margin-top: 50px;
    .part-line{
      width: 49%;
    }
    .part-main{
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>