<template>
  <div class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="用户编号" prop="memberCode.value">
        <el-input v-model="form.memberCode.value" placeholder="用户编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="memberPhone.value">
        <el-input v-model="form.memberPhone.value" placeholder="用户手机" clearable></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="memberName.value">
        <el-input v-model="form.memberName.value" placeholder="昵称" clearable></el-input>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
import { fetchInitMessageTemplate } from '@/api/message'
export default {
  name: 'Search',
  props: {
    hasBusiness: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      form: {
        memberCode: { value: '', name: 'memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberName: { value: '', name: 'memberName', matchType: MatchType.CONTAIN, type: DataType.STRING }
      },
      templateStatus: [],
      businessTypes: [],
      messageTypes: []
    }
  },
  mounted() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      fetchInitMessageTemplate().then(res => {
        if (res.code === 200) {
          this.templateStatus = res.result.templateStatus || []
          this.messageTypes = res.result.messageTypes || []
          this.businessTypes = res.result.businessTypes || []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.search-content {
  display: flex;
  margin-top: 20px;
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 30%;
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
