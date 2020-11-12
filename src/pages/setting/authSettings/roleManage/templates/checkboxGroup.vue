<template>
  <div class="group-wrap">
    <div class="auth-header">
      <h4 class="title">{{currentItem.name}}</h4>
<!--      <el-switch-->
<!--        v-model="currentItem.silentAuth"-->
<!--        @change="handleChange(currentItem)"-->
<!--        active-color="#13ce66"-->
<!--        inactive-color="#dcdfe6">-->
<!--      </el-switch>-->
    </div>
    <div class="auth-children" v-if="currentItem['childPermList'] && currentItem['childPermList'].length">
        <template v-for="item in currentItem['childPermList']">
          <el-checkbox
            :key="item.id"
            v-if="!item['childPermList'] || !item['childPermList'].length"
            v-model="item.checked"
            :label="item.name"
          />
          <checkbox-group v-else :currentItem="item" />
        </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'checkBox',
    props: {
      currentItem: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      checkboxGroup: resolve => require(['./checkboxGroup'], resolve)
    },
    methods: {
      handleChange(data) {
        if (data['silentAuth']) {
          (data['childPermList'] || []).forEach(item => {
            item.checked = true
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .group-wrap {

    .auth-header {
      padding-bottom: 16px;

      .title {
        font-weight: 500;
        display: inline-block;
        line-height: 20px;
        margin: 0 5px 0 6px;
        vertical-align: middle;
      }

      &:before {
        content: '';
        width: 4px;
        height: 16px;
        background-color: #00a0e9;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .auth-children {
      padding-left: 20px;
    }

    /deep/ .el-checkbox {
      margin-bottom: 16px;
    }
  }
</style>
