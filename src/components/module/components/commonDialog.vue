<template>
  <dialog-model :title="title" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" showClose @success="handleSubmit">
    <el-tabs v-model="activeIndex" @tab-click="handleTabClick" type="border-card">
      <el-tab-pane v-for="(item, index) in commonConfig" :key="index" :label="item.name" :name="`${index}`" :disabled="!list.includes(item.id)">
        <component :is="item.component" :ref="`cmp-${index}`" @success="handleSuccess"></component>
      </el-tab-pane>
    </el-tabs>
  </dialog-model>
</template>

<script>
  import DialogModel from './dialog/index'
  export default {
    name: 'CommonDialog',
    components: {
      DialogModel,
      ClassifyModal: resolve => {
        return require(['./templates/commonDialog/classify'], resolve)
      },
      CommonModal: resolve => {
        return require(['./templates/commonDialog/common'], resolve)
      },
      DefaultModal: resolve => {
        return require(['./templates/commonDialog/default'], resolve)
      },
      GoodsModal: resolve => {
        return require(['./templates/commonDialog/goods'], resolve)
      },
      ShopModal: resolve => {
        return require(['./templates/commonDialog/shop'], resolve)
      },
      SpecialModal: resolve => {
        return require(['./templates/commonDialog/special'], resolve)
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '选择预置链接'
      },
      list: {
        type: Array,
        default: () => {
          return [1, 2, 3, 4, 5, 6]
        }
      }
    },
    data() {
      return {
        commonConfig: [
          { id: 1, name: '常用', exp: '跳转页面', component: 'CommonModal' },
          { id: 2, name: '商品', exp: '选择商品', component: 'GoodsModal' },
          { id: 3, name: '分类', exp: '选择业务和分类', component: 'ClassifyModal' },
          { id: 4, name: '店铺', exp: '跳转店铺', component: 'ShopModal' },
          { id: 5, name: '专题', exp: '跳转专题页', component: 'SpecialModal' },
          { id: 6, name: '自定义', exp: '自定义跳转', component: 'DefaultModal' }
        ],
        dialogVisible: false,
        activeIndex: '0'
      }
    },
    watch: {
      visible(n) {
        this.dialogVisible = n
        if (n) {
          this.activeIndex = `${this.list[0] - 1}`
        }
      },
      dialogVisible(n) {
        this.$emit('update:visible', n)
      }
    },
    methods: {
      handleTabClick() {
        // 点击了标签
      },
      handleSubmit() {
        // 确定
        // 获取当前对应组件的内容并组装返回
        // 有的不一定会走到这里，这里是用户点击确定被动触发，而 handleSuccess 是主动触发
        const data = this.$refs[`cmp-${this.activeIndex}`][0].getData()
        if (data) {
          this.$emit('success', {
            typeId: this.commonConfig[this.activeIndex].id,
            typeName: this.commonConfig[this.activeIndex].name,
            content: {
              ...data
            }
          })
          this.dialogVisible = false
        }
      },
      handleSuccess(item) {
        // 组件内部调用成功，继续往上
        this.$emit('success', {
          typeId: this.commonConfig[this.activeIndex].id,
          typeName: this.commonConfig[this.activeIndex].name,
          content: {
            ...item
          }
        })
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped></style>
