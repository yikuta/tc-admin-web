<template>
  <div class="uni-countdown">
    <div v-if="showDay" class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{d}}</div>
    <div v-if="showDay" class="uni-countdown__splitor" :style="{color:splitorColor}">天</div>
    <div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{h}}</div>
    <div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '时'}}</div>
    <div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{i}}</div>
    <div class="uni-countdown__splitor" :style="{color:splitorColor}">{{showColon ? ':' : '分'}}</div>
    <div class="uni-countdown__number" :style="{borderColor:borderColor, color:color, background:backgroundColor}">{{s}}</div>
    <div v-if="!showColon" class="uni-countdown__splitor" :style="{color:splitorColor}">秒</div>
  </div>
</template>
<script>
  export default {
    name: 'countdown',
    props: {
      showDay: {
        type: Boolean,
        default: true
      },
      showColon: {
        type: Boolean,
        default: true
      },
      runType: {
        type: String,
        default: 'watch'
      },
      backgroundColor: {
        type: String,
        default: '#FFFFFF'
      },
      borderColor: {
        type: String,
        default: '#000000'
      },
      color: {
        type: String,
        value: '#000000'
      },
      splitorColor: {
        type: String,
        default: '#000000'
      },
      day: {
        type: Number,
        default: 0
      },
      hour: {
        type: Number,
        default: 0
      },
      minute: {
        type: Number,
        default: 0
      },
      second: {
        type: Number,
        default: 0
      },
      timestamp: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        timer: null,
        d: '00',
        h: '00',
        i: '00',
        s: '00',
        leftTime: 0,
        seconds: 0
      }
    },
    watch: {
      second() {
        this.run()
      },
      timestamp() {
        this.run()
      }
    },
    created() {
      if (this.runType === 'created') {
        this.run()
      }
    },
    beforeDestroy() {
      this.timeUp()
    },
    methods: {
      run() {
        // 初始化运行
        this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second, this.timestamp)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds < 0) {
            this.timeUp()
            return
          }
          this.countDown()
        }, 1000)
      },
      toSeconds(day, hours, minutes, seconds, timestamp) {
        // 计算剩余秒数
        return (day * 60 * 60 * 24) + (hours * 60 * 60) + (minutes * 60) + seconds + (timestamp / 1000).toFixed(0)
      },
      timeUp() {
        clearInterval(this.timer)
        this.$emit('timeup')
      },
      countDown() {
        // 计算
        let seconds = this.seconds
        let [day, hour, minute, second] = [0, 0, 0, 0]
        if (seconds > 0) {
          day = Math.floor(seconds / (60 * 60 * 24))
          const cacheHour = Math.floor(seconds / (60 * 60)) - (day * 24)
          if (this.showDay) {
            hour = cacheHour
          } else {
            hour = cacheHour + day * 24
          }
          minute = Math.floor(seconds / 60) - (day * 24 * 60) - (cacheHour * 60)
          second = Math.floor(seconds) - (day * 24 * 60 * 60) - (cacheHour * 60 * 60) - (minute * 60)
        } else {
          this.timeUp()
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        this.d = day
        this.h = hour
        this.i = minute
        this.s = second
      }
    },
    destroyed() {
      this.timeUp()
    }
  }
</script>
<style lang="scss">
  $countdown-height:44upx;

  .uni-countdown {
    padding: 2px 0;
    display: inline-flex;
    flex-wrap: nowrap;
    justify-content: center;

    &__splitor {
      justify-content: center;
      line-height: $countdown-height;
      padding: 0 5px;
      font-size: 12px;
    }

    &__number {
      line-height: $countdown-height;
      justify-content: center;
      height: $countdown-height;
      border-radius: 5px;
      font-size: 12px;
      /*border: 1px solid #000000;*/
    }
  }
</style>
