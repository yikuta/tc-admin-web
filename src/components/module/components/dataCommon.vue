<template>
  <dialog-model title="常用" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" showClose @success="handleSubmit">
    <div class="">
      <div>
        <el-radio v-model="dataType" label="MIXING">混合推荐</el-radio>
      </div>
      <div class="padding-top-sm">
        <el-radio v-model="dataType" label="BUSINESS">指定业务</el-radio>
        <el-select v-model="serviceId" placeholder="请选择业务类型" size="mini" v-if="dataType === 'BUSINESS'">
          <el-option v-for="(item, index) in option.types" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </div>
      <div class="padding-top-sm">
        <el-radio v-model="dataType" label="CATEGORY">指定分类</el-radio>
        <el-select v-model="serviceId" placeholder="请选择业务类型" size="mini" v-if="dataType === 'CATEGORY'">
          <el-option v-for="(item, index) in option.classes" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
        <div class="inline-block" v-if="serviceId === 1 && dataType === 'CATEGORY'" :key="1">
          <cascader v-model="classifyId" placeholder="请选择分类" :checkStrictly="true" :ajax="getChannelCategoryList" :leafLevel="1" clearable ref="cascader" @on-change-cascader="getCheckedNodes"></cascader>
        </div>
        <div class="inline-block" v-if="serviceId === 2 && dataType === 'CATEGORY'" :key="2">
          <cascader v-model="classifyId" placeholder="请选择分类" :checkStrictly="true" :ajax="getChannelCategoryList" :leafLevel="1" clearable ref="cascader" @on-change-cascader="getCheckedNodes"></cascader>
        </div>
      </div>
    </div>
  </dialog-model>
</template>

<script>
  import { getChannelCategoryList } from '@/api/showClassify'
  export default {
    name: 'DataCommon',
    components: {
      DialogModel: resolve => {
        return require(['./dialog/index'], resolve)
      },
      Cascader: resolve => {
        return require(['@/components/Cascader'], resolve)
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        dataType: 'MIXING',
        option: {
          types: [
            { id: 1, value: '快递到家' },
            { id: 2, value: '爆品预售' },
            { id: 4, value: '净菜' }
          ],
          classes: [
            { id: 1, value: '快递到家' },
            { id: 2, value: '爆品预售' }
          ]
        },
        serviceId: null,
        classifyId: null,
        classifyName: []
      }
    },
    watch: {
      visible(n) {
        this.dialogVisible = n
      },
      dialogVisible(n) {
        this.$emit('update:visible', n)
      }
    },
    methods: {
      handleSubmit() {
        // 保存需要校验选择相应的数据的时候是否选择了对应的类型或者分类的值，防止客户端获取不到数据导致的意外错误
        if (this.dataType === 'MIXING') {
          // 混合推荐
        } else if (this.dataType === 'BUSINESS') {
          // 指定业务
          if (!this.serviceId) {
            this.$message.error('请选择指定业务')
            return
          }
        } else {
          // 指定分类
          if (!this.serviceId || !this.classifyId.length) {
            this.$message.error('请选择指定业务或分类')
            return
          }
        }
        this.$emit('update:visible', false)
        this.$emit('success', {
          dataType: this.dataType,
          serviceId: this.serviceId,
          classifyId: this.classifyId,
          classifyName: this.classifyName
        })
      },
      getChannelCategoryList(id) {
        return id ? getChannelCategoryList({ parentId: id, businessNo: this.serviceId }) : id !== 0 ? getChannelCategoryList({ businessNo: this.serviceId }) : getChannelCategoryList({ parentId: id, businessNo: this.serviceId })
      },
      getCheckedNodes(value, nodes) {
        // 处理对应的分类名称
        const getName = (parent) => {
          this.classifyName.unshift(parent.label)
          if (parent.parent) {
            getName(parent.parent)
          }
        }
        if (nodes.length) {
          getName(nodes[0])
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/common.scss'
</style>
