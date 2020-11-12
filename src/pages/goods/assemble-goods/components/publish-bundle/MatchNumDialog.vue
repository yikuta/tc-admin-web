<template>
  <div class="wrapper">
    <el-dialog title="搭配数量设置" :visible="visible" @update:visible="onChange">
      <p :style="{paddingLeft:'13px'}">搭配数量是指商品在此套餐中需要购买的数量，同一个商品中任意规格购买此数量即可</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini" @submit.native.prevent>
        <el-form-item label="搭配数量" prop="matchNum">
          <el-input v-model="form.matchNum" placeholder="请输入搭配数量" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onChange(false)">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MatchNumDialog',
  props: {
    visible: Boolean,
    goods: { type: Object, default: () => ({}) }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.form.matchNum = this.goods['matchNum']
        }
      }
    }
  },
  data() {
    return {
      form: {
        matchNum: ''
      },
      rules: {
        matchNum: [{ validator: this.validator, trigger: 'blur' }]
      }
    }
  },
  methods: {
    onChange(visible) {
      this.$refs['form'].resetFields()
      this.form.matchNum = this.goods['matchNum']
      this.$emit('update:visible', visible)
    },
    handleSure() {
      this.$refs['form'].validate(isSuccess => {
        if (isSuccess) {
          this.goods['matchNum'] = this.form.matchNum
          this.onChange(false)
        }
      })
    },
    validator(rule, value, callback) {
      if (!value) {
        callback('请输入1万以内的整数')
      } else if (!/^\d+$/.test(value)) {
        callback('请输入1万以内的整数')
      } else if (Number(value) < 1 || Number(value) > 9999) {
        callback('请输入1万以内的整数')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
