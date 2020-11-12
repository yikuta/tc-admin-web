<template>
  <div>
    <el-form :model="sceneSetting" ref="sceneSettingForm" :rules="rules" label-width="120px" size="mini" class="app-form">
      <el-form-item label="投放范围" prop="channelTypeSet" v-show="sceneSetting.sceneType == 'COLLECTION_CENTER'">
        <el-checkbox-group v-model="sceneSetting.channelTypeSet" :disabled="showDisabled || releaseDisabled">
          <!-- <el-checkbox v-for="(item, index) in term" :label="item.id" :key="index">{{ item.name }}</el-checkbox> -->
          <el-checkbox label="APP_TINCERE_LIFE">天呈生活APP</el-checkbox>
          <el-checkbox label="MP_TINCERE_LIFE">天呈生活小程序</el-checkbox>
          <el-checkbox label="MP_TINCERE_CLEAN_FOOD">天呈净菜小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发放总数" prop="launchNum">
        <el-input class="input-width" type="text" placeholder="" :disabled="showDisabled" v-model="sceneSetting.launchNum" />张
      </el-form-item>
      <el-form-item label="单用户可领" prop="singleUserLimitNum">
        <div v-if="sceneSetting.singleUserLimitType == 'UNLIMITED'" style="color: #606266;">不限制</div>
        <div v-else>
          <el-radio-group v-model="sceneSetting.singleUserLimitType">
            <el-radio label="UPPER_LIMIT">最多</el-radio>
            <el-radio label="EVERY_DAY" v-show="sceneSetting.sceneType !== 'FOR_NEW_PEOPLE' && sceneSetting.sceneType !=='FOR_INVITATION'">每天</el-radio>
          </el-radio-group>
          <el-input class="input-width" type="text" placeholder="" :disabled="showDisabled" v-model="sceneSetting.singleUserLimitNum" />张
        </div>
      </el-form-item>
      <el-form-item label="可领用户" prop="userRangeType" v-show="sceneSetting.sceneType !== 'FOR_NEW_PEOPLE' && sceneSetting.sceneType !=='FOR_INVITATION'">
        <el-radio-group v-model="sceneSetting.userRangeType" :disabled="showDisabled || releaseDisabled">
          <el-radio label="ALL">全部</el-radio>
          <el-radio label="NEW_USER">新用户</el-radio>
          <el-radio label="OLD_USER">老用户</el-radio>
          <el-radio label="FIRST_PARTICIPATION">首次领券用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领券时间" prop="receiveTimeList" v-if="sceneSetting.sceneType !== 'FOR_NEW_PEOPLE' && sceneSetting.sceneType !=='FOR_INVITATION'">
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
import term from '../json/term.json'
export default {
  name: 'sceneSetting',
  props: {
    sceneSetting: {
      type: Object,
      default: () => {}
    },
    // term: {
    //   type: Array,
    //   default: () => []
    // },
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
  data() {
    return {
      term
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
