<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields">
      <search ref="searchForm" />
    </search-area>
    <content-area contentTitle="商品订阅列表">
      <table-area :tableData="dataList" />
      <pagination :current="1" :total="1000" />
    </content-area>
  </div>
</template>

<script>
import { Common, ProductSubscribe } from './components'
import Pagination from '@/components/Pagination'

export default {
  name: 'productSubscribe',
  components: { ...Common, ...ProductSubscribe, Pagination },
  data() {
    return {
      dataList: [
        {
          name: 'U2009327567',
          price: '￥19.90-￥20.00',
          status: '正常',
          goodsPic:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587536564948&di=667afb256d782d29af55b210e2143c98&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190527%2Fbab59041e4d6455e8bc66d544aedd596.jpeg',
          phone: '13988888888',
          nick: '测试',
          platform: '平台',
          subscribeTime: '2020-04-09 10:21:21'
        }
      ]
    }
  },
  methods: {
    resetFields() {
      this.$refs['searchForm'].resetFields()
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
}
</style>