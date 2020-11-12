<template>
  <div class="secKill padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">秒杀专区</div>
      <div class="text-df padding-bottom-sm text-convention">展示内容</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">倒计时</el-col>
        <el-col :span="16">
          <el-switch v-model="config.config.countDown"></el-switch>
        </el-col>
      </el-row>
      <div class="text-df padding-bottom-sm text-convention">排列方式</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">每行展示</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.flex">
            <el-radio :label="3">三列</el-radio>
            <el-radio :label="4">四列</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">轮播方向</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.direction">
            <el-radio label="horizontal">向左</el-radio>
            <el-radio label="vertical">向上</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="">
        <el-col :span="8" class="text-df text-second">轮播周期</el-col>
        <el-col :span="16">
          <el-input v-model="config.config.interval" size="mini" placeholder="不填默认 3000 毫秒"><template slot="append">毫秒</template></el-input>
          <div class="text-sm text-seat padding-top-sm">请输入3000-9999之间的轮播周期（1000毫秒 = 1秒）</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'secKill',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      getValid() {
        this.config.config.interval = 3000
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
</style>
