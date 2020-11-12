<template>
  <el-dialog
    :title="type === '1' ? '灰名单设置' : '黑名单设置'"
    :visible.sync="dialogVisible"
    width="720px"
    :close-on-click-modal='false'
    :before-close="handleClose">
    <el-checkbox-group v-model="checkedList" class="list-group">
      <el-checkbox v-for="(item, index) in lists" :label="item.code" :key="index">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { findDataListByCode } from '@/api/common'
import { fetchBlackDetail, fetchGreyDetail, asyncBlacklisSetting } from '@/api/user'
export default {
  props: {
    type: {
      type: String,
      default: () => '1'
    },
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      dialogVisible: false,
      checkedList: [],
      lists: [],
      blackList: [],
      greyList: []
    }
  },
  mounted() {
    this.handleDataList('BLACKLIST_PERMISSION', 'blackList')
    this.handleDataList('GREYLIST_PERMISSION', 'greyList')
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.lists = this.type === '1' ? this.greyList : this.blackList
        this.handleDetail()
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {
      let obj = {}
      this.lists.map(item => {
        if (this.checkedList.includes(item.code)) {
          obj[item.code] = '1'
        } else {
          obj[item.code] = '0'
        }
      })
      asyncBlacklisSetting(obj).then(res => {
        if (res.code === 200) {
          this.$message.success('设置成功')
          this.handleClose()
        }
      })
    },
    handleDetail() {
      let fn = this.type === '1' ? fetchGreyDetail : fetchBlackDetail
      fn().then(res => {
        if (res.code === 200) {
          let arr = (res.result || []).filter(item => item.value === '1')
          this.checkedList = arr.map(item => item.code)
        } else {
          this.checkedList = []
        }
      })
    },
    handleDataList(code, name) {
      findDataListByCode(code).then(res => {
        if (res.code === 200) {
          this[name] = res.result || []
        } else {
          this[name] = []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-group{
  .el-checkbox{
    margin-bottom: 20px;
    min-width: 160px;
  }
}
</style>