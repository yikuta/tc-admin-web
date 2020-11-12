<template>
  <div>
    <div class="item">
      <span>上下边距：</span>
      <el-slider
        v-model="form.marign"
        style="float:left;width:80%"
        height='32px'
        @change="onChange('tinymceMargin', form.tinymceMargin)"
      ></el-slider>
    </div>
    <div class="item">
      <u-editor></u-editor>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    UEditor: resolve => {
      return require(['@/components/UEditor/index'], resolve)
    }
  },
  data() {
    return {
      form: {
        tinymceMargin: 20,
        tinymce: ''
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