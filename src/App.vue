<template>
  <div id="app">
<!--    <template v-if="$store.state.permission.buttonPermission.length || !$store.state.user.token">-->
<!--      <router-view></router-view>-->
<!--    </template>-->
<!--    <template v-else>-->
<!--      <div v-if="!$store.state.user.token">努力加载中……</div>-->
<!--      <div v-else>-->
<!--        努力加载中，长时间没有响应请<a href="javascript:void(0)" @click="handleReload">刷新</a>或<a href="javascript:void(0)" @click="handleLogout">退出登录</a>-->
<!--      </div>-->
<!--    </template>-->
    <router-view></router-view>
  </div>
</template>

<script>
  // import dayjs from 'dayjs'

  function getCurrentTime() {
    return Math.round(new Date().getTime() / 1000)
  }

  const timeOut = 30 * 60 // 超时时间 30分钟
  export default {
    name: 'App',
    data() {
      return {
        lastTime: getCurrentTime() // 最后一次点击时间
      }
    },
    created() {
      if (this.$store.state.user.token) {
        this.$store.dispatch('getPermissions')
        // 禁用掉了
        // this.startWatchNoOperation()
      }
    },
    methods: {
      // 更新每一次点击
      fetchLastTime() {
        const currentTime = getCurrentTime()
        if (this.lastTime && (currentTime - this.lastTime > timeOut)) {
          // this.$store.dispatch('logout')
          // console.log('logout====>',
          //   dayjs(currentTime * 1000).format('YYYY-MM-DD HH:mm:ss'), '===>', currentTime,
          //   ' | ',
          //   dayjs(this.lastTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
          //   '====>', this.lastTime,
          //   this.lastTime && (currentTime - this.lastTime > timeOut)) // eslint-disable-line
        } else {
          this.lastTime = currentTime
        }
      },
      handleReload() {
        location.reload()
      },
      handleLogout() {
        this.$store.dispatch('logout')
      },
      startWatchNoOperation() {
        window.addEventListener('scroll', this.fetchLastTime)
        window.addEventListener('click', this.fetchLastTime)
      },
      stopWatchNoOperation() {
        window.removeEventListener('scroll', this.fetchLastTime)
        window.removeEventListener('click', this.fetchLastTime)
      }
    },
    destroyed() {
      // this.stopWatchNoOperation()
    }
  }
</script>

<style lang="scss">
@import '../node_modules/font-awesome/css/font-awesome.css';
$fa-css-prefix: el-icon-fa;

@mixin dialog-footer-style {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;

  button:first-child {
    margin-left: 10px;
  }
}

.el-message-box {
  .el-message-box__btns {
    @include dialog-footer-style;
  }
}

.el-dialog {
  .dialog-footer {
    @include dialog-footer-style;
  }
}

[class^='el-icon-fa'],
[class*=' el-icon-fa'] {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome !important;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mobile-el-dialog {
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__headerbtn {
    display: none;
  }
}
</style>
