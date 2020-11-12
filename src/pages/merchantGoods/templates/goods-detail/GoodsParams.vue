<template>
  <el-form-item label="商品参数">
    <div class="list-item" v-for="item in paramsGroupList" :key="item.id">
      <div class="title">{{item.name}}</div>
      <div class="content">
        <div v-for="param in item.baseParamOptionList" :key="param.id">
          <!--单选框-->
          <template v-if="param.paramType.value === 1">
            <el-form-item :label-width="param.name | setLabelWidth" :label="param.name">
              <el-radio-group v-model="param.selectedValue">
                <el-radio v-for="option in param.value" :key="option.id" :label="option.name" />
              </el-radio-group>
            </el-form-item>
          </template>

          <!--复选框-->
          <template v-else-if="param.paramType.value === 2">
            <el-form-item :label-width="param.name | setLabelWidth" :label="param.name">
              <el-checkbox-group v-model="param.selectedValue">
                <el-checkbox v-for="option in param.value" :key="option.id" :label="option.name" />
              </el-checkbox-group>
            </el-form-item>
          </template>

          <!--下拉选项-->
          <template v-else-if="param.paramType.value === 3">
            <el-form-item :label-width="param.name | setLabelWidth" :label="param.name">
              <el-select v-model="param.selectedValue">
                <el-option v-for="option in param.value" :value="option.name" :key="option.id" :label="option.name" />
              </el-select>
            </el-form-item>
          </template>

          <!--单行文本-->
          <template v-else-if="param.paramType.value === 4">
            <el-form-item  :label-width="param.name | setLabelWidth" :label="param.name">
              <el-input type="text" :maxlength="250" show-word-limit v-model="param.selectedValue" placeholder="请输入文本"></el-input>
            </el-form-item>
          </template>

          <!--多行文本-->
          <template v-else-if="param.paramType.value === 5">
            <el-form-item :label-width="param.name | setLabelWidth" :label="param.name">
              <el-input type="textarea" :maxlength="250" show-word-limit v-model="param.selectedValue" placeholder="请输入文本"></el-input>
            </el-form-item>
          </template>
        </div>
      </div>
    </div>
  </el-form-item>
</template>

<script>
  export default {
    name: 'goodParams',
    props: {
      paramsGroupList: {
        type: Array,
        default: () => []
      }
    },
    filters: {
      setLabelWidth: (value) => {
        if (value) {
          return (value.length * 18).toString()
        }
        return 'auto'
      }
    }
  }
</script>

<style>

</style>
