<template>
  <div class="wrapper">
    <el-switch v-model="isOpen" active-text="使用系统库存" active-color="#13ce66"></el-switch>
  </div>
</template>

<script>
export default {
  name: 'StoreSettingSwitch',
  props: ['systemStock'],
  data() {
    return {
      isOpen: false
    }
  },
  watch: {
    isOpen: {
      handler: function(nval) {
        this.$emit('storeSettingSwitchChange', nval)
      }
    },
    systemStock: {
      handler: function(newVal) {
        this.isOpen = newVal
      },
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
