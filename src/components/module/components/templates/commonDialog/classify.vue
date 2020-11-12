<template>
  <div class="">
    <el-form size="mini">
      <el-form-item label="所属业务">
        <el-select v-model="form.serviceId" placeholder="请选择商品状态" @change="handleChange">
          <el-option v-for="(item, index) in option.service" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择分类">
        <div>
          <cascader v-model="form.classifyId" placeholder="请选择分类" :checkStrictly="true" :ajax="getChannelCategoryList" :leafLevel="1" clearable v-if="form.serviceId === 1" @on-change-cascader="handlerCascaderChange"></cascader>
        </div>
        <div>
          <cascader v-model="form.classifyId" placeholder="请选择分类" :checkStrictly="true" :ajax="getChannelCategoryList" :leafLevel="1" clearable v-if="form.serviceId === 2" @on-change-cascader="handlerCascaderChange"></cascader>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getChannelCategoryList } from '@/api/showClassify'
  import Cascader from '@/components/Cascader'
  export default {
    name: 'Classify',
    components: { Cascader },
    data() {
      return {
        form: {
          serviceId: 1,
          classifyId: null,
          baseData: []
        },
        option: {
          service: [
            { id: 1, value: '快递到家' },
            { id: 2, value: '爆品预售' }
          ],
          classify: [
            { id: 1, value: '快递到家' },
            { id: 2, value: '爆品预售' },
            { id: 3, value: '净菜' }
          ]
        }
      }
    },
    methods: {
      getChannelCategoryList(id) {
        return id ? getChannelCategoryList({ parentId: id, businessNo: this.form.serviceId }) : id !== 0 ? getChannelCategoryList({ businessNo: this.form.serviceId }) : getChannelCategoryList({ parentId: id, businessNo: this.form.serviceId })
      },
      handleChange() {
        this.form.classifyId = null
      },
      handlerCascaderChange(val, node) {
        // 发生了变化
        this.form.baseData = node[0].pathLabels
      },
      getData() {
        if (!this.form.classifyId) {
          this.$message.error('请选择分类')
          return false
        }
        return this.form
      }
    }
  }
</script>

<style lang="scss" scoped></style>
