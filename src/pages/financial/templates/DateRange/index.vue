<template>
  <el-form-item :label="label" :prop="prop">
    <el-date-picker
      v-model="startTime"
      type="date"
      placeholder="开始日期"
      value-format="yyyy-MM-dd"
      :picker-options="PickerOptionsStart"
      @change="handleStartTimeChange"
    />
    <el-date-picker
      v-model="endTime"
      type="date"
      placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="PickerOptionsEnd"
      @change="handleEndTimeChange"
    />
  </el-form-item>
</template>
<script>
  import dayjs from 'dayjs'
  export default {
    name: 'SplitDate',
    props: {
      startTime: String,
      endTime: String,
      label: String,
      prop: String
    },
    data() {
      return {
        PickerOptionsStart: {},
        PickerOptionsEnd: {}
      }
    },
    created() {
      this.PickerOptionsStart = {
        disabledDate: (time) => {
          if (this.endTime) {
            return dayjs(this.endTime).subtract(3, 'month').unix() > dayjs(time).unix() || dayjs(time).unix() > dayjs(this.endTime).unix()
          }
          return false
        }
      }
      this.PickerOptionsEnd = {
        disabledDate: (time) => {
          if (this.startTime) {
            return dayjs(this.startTime).add(3, 'month').unix() < dayjs(time).unix() || dayjs(time).unix() < dayjs(this.startTime).unix()
          }
          return false
        }
      }
    },
    methods: {
      handleStartTimeChange(value) {
        this.$emit('update:startTime', value)
      },
      handleEndTimeChange(value) {
        this.$emit('update:endTime', value)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
