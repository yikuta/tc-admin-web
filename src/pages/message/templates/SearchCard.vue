<template>
  <div class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="标题" prop="title.value">
        <el-input v-model="form.title.value" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="模板状态" prop="templateStatus.value">
        <el-select v-model="form.templateStatus.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of templateStatus" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType.value">
        <el-select v-model="form.messageType.value" placeholder="请选择" clearable>
          <el-option label="全部" value="" />
          <el-option v-for="item in messageTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务判别" prop="businessType.value" v-if="hasBusiness">
        <el-select v-model="form.businessType.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of businessTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
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
        title: { value: '', name: 'title', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        messageType: { value: '', name: 'messageType', matchType: MatchType.EQUAL, type: DataType.STRING },
        templateStatus: { value: '', name: 'templateStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
        businessType: { value: '', name: 'businessType', matchType: MatchType.EQUAL, type: DataType.STRING }
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
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
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
