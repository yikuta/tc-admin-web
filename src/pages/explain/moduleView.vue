<template>
  <div class="module-view">
    <div class="desc-list">
      <div class="desc-item">
        <span class="label">模块名称：</span>
        <span class="content">{{ module.name }}</span>
      </div>
      <div class="desc-item">
        <span class="label">模块状态：</span>
        <span class="content">
          <el-badge is-dot class="badge-item" :type="module.enable ? 'success' : 'danger'" />
          <span>{{module.enable ? '正常' : '停用'}}</span>
        </span>
      </div>
      <div class="desc-item">
        <span class="label">模块内容：</span>
        <span>
          <custom-detail-module ref="customDetailModule" :isEditor="false"></custom-detail-module>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { reqModuleById } from '@/api/mallGoods'
  export default {
    name: 'moduleReview',
    components: {
      CustomDetailModule: resolve => {
        require(['@/components/CustomDetailModule/index'], resolve)
      }
    },
    data() {
      return {
        module: {
          name: '',
          enable: false
        }
      }
    },
    created() {
      if (this.$route.query.id) {
        // 如果有 id 就进行处理
        this.getDetail(this.$route.query.id)
      } else {
        this.$message.error('当前没有需要预览的内容')
      }
    },
    methods: {
      getDetail(id) {
        reqModuleById({ id }).then(res => {
          if (res.code === 200) {
            this.module = res.result
            this.$refs['customDetailModule'].setContent(res.result.value)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .module-view{width:800px;margin:0 auto;}
</style>
