<template>
  <div>
    <div class="item">
      <span>上下边距：</span>
      <el-slider
        v-model="form[text]"
        style="float:left;width:80%"
        height='32px'
        @change="onChange(text, form[text])"
      ></el-slider>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: String
  },
  data() {
    return {
      form: {
        tinymceMargin: ''
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