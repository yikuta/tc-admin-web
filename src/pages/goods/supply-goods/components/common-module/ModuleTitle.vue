<template>
  <div>
    <div class="item">
      <span>标题名称：</span>
      <el-input
        v-model="form.title"
        style="width:300px;"
        size="small"
        @input="onChange('title', form.title)"
      ></el-input>
    </div>
    <div class="item">
      <span>显示样式：</span>
      <el-radio-group v-model="form.style" @change="onChange('style', form.style)">
        <el-radio :label="1">样式一</el-radio>
        <el-radio :label="2">样式二</el-radio>
        <el-radio :label="3">样式三</el-radio>
      </el-radio-group>
    </div>
    <div class="item">
      <span>显示方式：</span>
      <el-radio-group v-model="form.type" @change="onChange('type', form.type)">
        <el-radio label="left">居左</el-radio>
        <el-radio label="center">居中</el-radio>
        <el-radio label="right">居右</el-radio>
      </el-radio-group>
    </div>
    <div class="item">
      <span>上下边距：</span>
      <el-slider
        v-model="form.marign"
        style="float:left;width:80%"
        height='32px'
        @change="onChange('marign', form.marign)"
      ></el-slider>
    </div>
    <div class="item">
      <span>背景颜色：</span>
      <el-color-picker
        v-model="form.background"
        size='small'
        @change="onChange('background', form.background)"
      ></el-color-picker>
    </div>
    <div class="item">
      <span>文字颜色：</span>
      <el-color-picker
        v-model="form.color"
        size='small'
        @change="onChange('color', form.color)"
      ></el-color-picker>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        title: '',
        style: 1,
        type: 'left',
        marign: 20,
        background: '',
        color: ''
      }
    }
  },
  methods: {
    onChange(key, value) {
      this.$emit('handleChange', key, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  span {
    float: left;
  }
}
</style>