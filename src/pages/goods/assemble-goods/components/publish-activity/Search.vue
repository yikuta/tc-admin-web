<template>
  <div class="wrapper">
    <el-form ref="form" inline :model="form" label-width="100px" size="mini">
      <el-form-item label="团长编号" prop="colonelCode.value">
        <el-input v-model="form.colonelCode.value" placeholder="请输入团长编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="account.value">
        <el-input v-model="form.account.value" placeholder="请输入团长登录账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="团长姓名" prop="colonelName.value">
        <el-input v-model="form.colonelName.value" placeholder="请输入团长姓名" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="团长类型" prop="status.value" v-if="!checkActiveName">
        <el-select v-model="form.status.value" clearable>
          <el-option v-for="item of coloneTypeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="加入日期" prop="joinTime.value">
        <el-date-picker v-model="form.joinTime.value" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="所属区域" prop="area.value">
        <el-select v-model="context.selectedCity" disabled></el-select>
        <el-select v-model="form.area.value" clearable>
          <el-option v-for="item of context.areaOption" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
        <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
        <el-button v-if="checkActiveName" type="primary" size="mini" @click="handleAdd">批量添加</el-button>
        <el-button v-else type="primary" size="mini" @click="handleRemove">批量移除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    activeName: String,
    cityId: { type: String | Number, default: 0 },
    form: { type: Object, default: () => ({}) }
  },
  inject: ['context'],
  computed: {
    checkActiveName() {
      return this.activeName === 'optional'
    }
  },
  data() {
    return {
      coloneTypeOptions: [
        { key: '个人', value: 1 },
        { key: '商户', value: 2 }
      ]
    }
  },
  methods: {
    submitQuery() {
      if (this.activeName === 'optional') {
        this.context.optional.reqForm = JSON.parse(JSON.stringify(this.context.optional.form))
        this.context.optional.onSearch()
      } else {
        this.context.selected.reqForm = JSON.parse(JSON.stringify(this.context.selected.form))
        this.context.selected.onSearch()
      }
    },
    handleAdd() {
      this.$emit('on-batch-add')
    },
    handleRemove() {
      this.$emit('on-batch-rm')
    },
    handleReset() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
