<template>
  <div class="time-picker">
    <div>
      <el-select v-model="hour" style="width:100px" @change="val => handleTime(val, 'hour')">
        <el-option v-for="count in hourList" :disabled="isRange && count*1 > nextHour*1" :key="count" :label="count" :value="count"></el-option>
      </el-select>&nbsp;:&nbsp;
      <el-select v-model="min" style="width:100px" @change="val => handleTime(val, 'min')">
        <el-option v-for="count in minList" :key="count" :disabled="isRange && hour == nextHour && count*1 > nextMin*1" :label="count" :value="count"></el-option>
      </el-select>
    </div>
    <div v-if="isRange">
      &nbsp;{{rangeSeparator}}&nbsp;
      <el-select v-model="nextHour" style="width:100px" @change="val => handleTime(val, 'hour', true)">
        <el-option v-for="count in hourList" :disabled="count*1 < hour*1" :key="count" :label="count" :value="count"></el-option>
      </el-select>&nbsp;:&nbsp;
      <el-select v-model="nextMin" style="width:100px" @change="val => handleTime(val, 'min', true)">
        <el-option v-for="count in nextMinList" :key="count" :disabled="hour == nextHour && count*1 < min*1" :label="count" :value="count"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isRange: {
      type: Boolean,
      default: () => false
    },
    rangeSeparator: {
      type: String,
      default: () => '-'
    },
    time: {
      type: String,
      default: () => ''
    },
    times: {
      type: Array,
      default: () => ['', '']
    }
  },
  data() {
    return {
      hourList: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      hour: '',
      min: '00',
      nextHour: '',
      nextMin: '00'
    }
  },
  computed: {
    minList() {
      return this.hour === '23' ? ['00', '30', '59'] : ['00', '30']
    },
    nextMinList() {
      return this.nextHour === '23' ? ['00', '30', '59'] : ['00', '30']
    }
  },
  watch: {
    times(n) {
      if (n && n[0]) {
        this.hour = this.times[0].split(':')[0]
        this.min = this.times[0].split(':')[1]
        this.nextHour = this.times[1].split(':')[0]
        this.nextMin = this.times[1].split(':')[1]
      }
    },
    time(n) {
      if (n) {
        this.hour = this.time.split(':')[0]
        this.min = this.time.split(':')[1]
      }
    }
  },
  methods: {
    handleTime(val, type, hasRange) {
      let first = this.isRange ? this.times[0] : this.time
      let last = this.isRange ? this.times[1] : ''
      if (hasRange) {
        if (type === 'hour') {
          this.nextMin = '00'
        }
        first = `${this.hour}:${this.min}`
        last = type === 'hour' ? `${val}:${this.nextMin}` : `${this.nextHour}:${val}`
      } else {
        if (type === 'hour') {
          this.min = '00'
        }
        first = type === 'hour' ? `${val}:${this.min}` : `${this.hour}:${val}`
      }
      if (this.isRange) {
        // this.$emit('update:times', [first, last])
        this.$emit('change', [first, last])
      } else {
        // this.$emit('update:time', first)
        this.$emit('change', first)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.time-picker{
  display: flex;
}
</style>