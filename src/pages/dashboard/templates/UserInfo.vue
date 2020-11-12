<template>
  <div class="userInfo">
    <div class="order-head">用户信息</div>
    <div class="part-line">
      <ve-line :data="chartData" :legend-visible="false"  :colors="colors" width='100%' :extend="chartExtend"></ve-line>
      <p class="text">近15天新增用户</p>
    </div>
  </div>
</template>
<script>
import { registerSumBy15Day } from '@/api/dashboard'
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
      chartData: {
        columns: ['日期', '用户'],
        rows: []
      }
    }
  },
  mounted() {
    this.handleDataList()
  },
  methods: {
    handleDataList() {
      registerSumBy15Day().then(res => {
        if (res.code === 200) {
          if (res.result) {
            Object.keys(res.result).forEach(key => {
              this.chartData.rows.push({
                '日期': this.format(key, 'MM-dd'),
                '用户': res.result[key] ? res.result[key] * 1 : 0
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
    }
  }
}
</script>
<style lang="scss" scoped>
.userInfo{
  .part-line{
    width: 90%;
    margin: 0 auto;
  }
  .order-head{
    font-size: 16px;
    font-weight: 500;
  }
  .text{
    text-align: center;
    margin: 0;
    font-size: 14px;
    color: #7F7F7F;
  }
}
</style>