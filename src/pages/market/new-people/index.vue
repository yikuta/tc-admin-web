<template>
  <div class="app-container">
    <el-card>
      <div class="title">数据总览</div>
      <el-divider></el-divider>
      <div>
        <span>券码总数：{{data.couponCount}}</span>
        <span>总发放数量：{{data.launchCount}}</span>
      </div>
      <div>
        <span>失效券数量：{{data.invalidCount}}</span>
        <span>已发放数量：{{data.claimedCount}}</span>
      </div>
      <div>
        <span>沉默券数量：{{data.notInvalidCount}}</span>
        <span>已使用数量：{{data.usedCount}}</span>
      </div>
    </el-card>
    <el-card>
      <div class="title">业务终端数据</div>
      <el-divider></el-divider>
      <div v-for="(item, index) in data.items" :key="index">
        <div class="table-title">
          <span>{{item.name}}</span>
          <div>
            <el-link type="primary" v-np="'SCENARIO_RECRUIT_GIFT_COUPON_RULE_MANAGE'" @click="$router.push({ path: '/market/scene/new-people/release', query: { type: item.type }})">管理</el-link>
            <el-link type="primary" v-np="'SCENARIO_RECRUIT_GIFT_COUPON_RECORD_VIEW'" @click="$router.push({ path: '/market/scene/new-people/participate', query: { type: item.type }})">参与记录</el-link>
            <el-link type="primary" @click="$router.push({ path: '/market/log', query: { title: '新人礼操作日志', code: 'new_people' }})" v-np="'COMMON_OPERATE_LOG'">操作日志</el-link>
          </div>
        </div>
        <!-- <el-divider></el-divider> -->
        <el-table :data="item.data" border>
          <el-table-column label="券码总数" prop="couponCount"></el-table-column>
          <el-table-column label="失效数量" prop="invalidCount"></el-table-column>
          <el-table-column label="总发放数量" prop="launchCount"></el-table-column>
          <el-table-column label="已发放数量" prop="claimedCount"></el-table-column>
          <el-table-column label="已使用数量" prop="usedCount"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { reqNewPeopleCouponCollect } from '@/api/coupon'
  export default {
    name: 'newPeople',
    data() {
      return {
        data: {
          totle: 100,
          totleNum: 1000,
          cannotUse: 1,
          claimedNum: 5,
          chenmoNum: 1,
          usedNum: 10,
          item: [
            { name: '通用新人礼', data: [{ totle: 4, cannotUse: 5, totleNum: 1000, claimedNum: 5, usedNum: 10 }] }
          ]
        }
      }
    },
    mounted() {
      this._reqNewPeopleCouponCollect()
    },
    methods: {
      _reqNewPeopleCouponCollect() {
        return reqNewPeopleCouponCollect().then((res) => {
          if (res.code === 200) {
            this.data = res.result
            let items = []
            for (const key in res.result.items) {
              const element = res.result.items[key]
              let arr = []
              arr.push(element)
              let item = ''
              if (key === '1') {
                item = {
                  name: '通用',
                  type: 'ALL',
                  data: arr
                }
              } else if (key === '2') {
                item = {
                  name: '天呈生活APP',
                  type: 'APP_TINCERE_LIFE',
                  data: arr
                }
              } else if (key === '3') {
                item = {
                  name: '天呈生活小程序',
                  type: 'MP_TINCERE_LIFE',
                  data: arr
                }
              } else if (key === '4') {
                item = {
                  name: '天呈净菜小程序',
                  type: 'MP_TINCERE_CLEAN_FOOD',
                  data: arr
                }
              }
              items.push(item)
            }
            this.data.items = items
            // let arr = []
            // arr.push(res.result.items['1'])
            // let item = [{
            //   name: '通用新人礼',
            //   data: arr
            // }]
            // this.data = res.result
            // this.data.items = item
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    > div:first-child {
      margin-bottom: 20px;
    }
    .title {
      font-size: 26px;
      margin-bottom: 12px;
    }
    /deep/ .el-divider {
      margin: 12px 0;
    }
    .table-title {
      margin-top: 8px;
      padding: 12px 8px;
      border: 1px solid #EBEEF5;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
