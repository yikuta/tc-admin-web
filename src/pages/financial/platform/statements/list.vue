<template>
  <div class="app-container">
    <div :class="{ noNextButton: noNextButton }">
      <el-calendar v-model="currentDate">
        <template slot="dateCell" slot-scope="{date, data}">
          <div>
            {{ data.day.split('-')[1]}}月{{data.day.split('-')[2]}}
            <el-link v-if="list[data.day]" class="file-url" :href="list[data.day].fileUrl" type="primary">{{list[data.day] && list[data.day].fileUrl}}</el-link>
          </div>
        </template>
      </el-calendar>
      <div class="annotation">
        *注：
        <ul>
          <li>1、点击文件名可下载对账单（对账单为txt格式，请自行转换为Excel）；</li>
          <li> 2、当天9:00后可下载前一天的对账单；</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import { fetchFinancialStatement, fetchFinancialStatementList } from '@/api/financial/platform'
  const currentDateTime = dayjs(dayjs().format('YYYY-MM')).unix()
  export default {
    name: 'MarketDetail',
    data() {
      return {
        noNextButton: true,
        currentDate: dayjs().format('YYYY-MM'),
        list: {}
      }
    },
    watch: {
      currentDate: {
        handler: function(value, oldValue) {
          const oldDate = dayjs(oldValue).format('YYYY-MM')
          const currentDate = dayjs(value).format('YYYY-MM')
          if (oldDate !== currentDate) {
            this.currentDate = currentDate
            this.noNextButton = currentDateTime <= dayjs(currentDate).unix()
            this.fetchFinancialStatementList()
          }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      this.fetchFinancialStatementList()
    },
    methods: {
      // 某一天文件
      fetchFinancialStatement() {
        fetchFinancialStatement({
          date: this.currentDate
        }).then(() => {
        })
      },
      // 某一个月文件
      fetchFinancialStatementList() {
        fetchFinancialStatementList({
          date: this.currentDate
        }).then(res => {
          this.list = res.result
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .noNextButton {
    /deep/ .el-calendar__button-group {
      .el-button-group button:last-child {
        display: none !important;
      }
    }
  }
  .describe-table {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #e4e4e4;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
    /*color: #606266;*/
  }
  .file-url {
    display: block;
    width: 100%;
    /deep/ .el-link--inner {
      margin-top: 12px;
      width: 100%;
      height: 34px;
      display: inline-block;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
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
        color: #F56C6C;
      }
    }
  }
</style>
