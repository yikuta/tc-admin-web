<template>
  <div>
    <el-form :model="sceneSetting" ref="sceneSettingForm" :rules="rules" label-width="120px" size="mini" class="app-form">
      <el-form-item label="投放范围" prop="channelTypeSet" v-if="sceneSetting.sceneType == 'COLLECTION_CENTER'">
        <el-checkbox-group v-model="sceneSetting.channelTypeSet" :disabled="showDisabled || releaseDisabled">
          <el-checkbox v-for="(item, index) in term" :label="item.id" :key="index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发放总数" prop="launchNum">
        <el-input class="input-width" type="text" placeholder="" :disabled="showDisabled" v-model="sceneSetting.launchNum" />张
      </el-form-item>
      <el-form-item label="单用户可领" prop="singleUserLimitNum">
        <el-input class="input-width" type="text" placeholder="" :disabled="showDisabled" v-model="sceneSetting.singleUserLimitNum" />张
      </el-form-item>
      <el-form-item label="可领用户" prop="userRangeType">
        <el-radio-group v-model="sceneSetting.userRangeType" :disabled="showDisabled || releaseDisabled">
          <el-radio label="ALL">全部</el-radio>
          <el-radio label="NEW_USER">新用户</el-radio>
          <el-radio label="OLD_USER">老用户</el-radio>
          <el-radio label="FIRST_PARTICIPATION">首次领券用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领券时间" prop="receiveTimeList">
        <el-date-picker :disabled="showDisabled || releaseDisabled"
          v-model="sceneSetting.receiveTimeList"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'sceneSetting',
  props: {
    sceneSetting: {
      type: Object,
      default: () => {}
    },
    term: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => {}
    },
    releaseDisabled: {
      type: Boolean,
      default: () => false
    },
    showDisabled: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    validateFn() {
      this.$refs['sceneSettingForm'].validate((valid) => {
        if (valid) {
          this.$emit('on-validate')
        } else {
          return false
        }
      })
    }
  }
}
</script>
