<template>
  <el-row class="">
    <el-col :span="6" class="text-right">跳转页面</el-col>
    <el-col :span="18" class="">
      <el-radio-group v-model="radioValue">
        <div class="padding-bottom-sm" v-for="(item, index) in tableData" :key="index"><el-radio :label="item.id">{{ item.name }}</el-radio></div>
      </el-radio-group>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'CommonPage',
    props: {
      value: {
        type: Boolean,
        default: 1
      }
    },
    data() {
      return {
        radioValue: 1,
        tableData: [
          { id: 1, name: '首页' },
          { id: 2, name: '净菜首页' },
          { id: 3, name: '快递到家首页' },
          { id: 4, name: '爆品预售首页' },
          { id: 5, name: '领券中心' }
        ]
      }
    },
    watch: {
      radioValue() {
        this.$emit('input', this.radioValue)
      }
    },
    created() {
      this.radioValue = this.value
    },
    methods: {
      getData() {
        const info = this.tableData.filter(o => o.id === this.radioValue)
        return {
          pageId: this.radioValue,
          baseData: info[0] || null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .padding-bottom-sm{padding-bottom: 10px;}
</style>
