<template>
  <el-dialog
    class="dialog-form"
    title="数据字典值详情"
    :visible="visible"
    :close-on-click-modal="false"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form size="mini" ref="dictionaryForm">
      <el-form-item label="值编码:" label-width="80px">
       <div class="detail" v-text="item.code"></div>
      </el-form-item>

      <el-form-item label="值名称:" label-width="80px">
        <div class="detail" v-text="item.name"></div>
      </el-form-item>

      <el-form-item label="预留1:" label-width="80px">
        <div class="detail" v-text="item.value"></div>
      </el-form-item>

      <el-form-item label="预留2:" label-width="80px">
        <div class="detail" v-text="item.value2"></div>
      </el-form-item>

      <el-form-item label="预留3:" label-width="80px">
        <div class="detail" v-text="item.value3"></div>
      </el-form-item>

      <el-form-item label="备注说明:" label-width="80px">
        <div class="detail" v-text="item.remark"></div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    name: 'dialogDetail',
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleCancel() {
        if (this.visible) {
          this.$emit('close', false)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
