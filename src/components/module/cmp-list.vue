<template>
  <div class="cmp-list">
    <div class="cmp-title" @click="handleClick">组件</div>
    <div class="list">
      <div v-for="(item, index) in config" :key="index">
        <div class="module-title">{{ item.name }}</div>
        <div class="module-list">
          <el-row :gutter="10">
            <el-col :span="8" v-for="(module, j) in item.list" :key="j" v-if="module.systemConfig.type.includes(status)">
              <div class="module-box" @click="handleClick(module)" :class="{ 'is-disabled': !getDisable(module) }">
                <div class="module-icon">
                  <svg-icon :icon-class="`module_${module.enName}`"></svg-icon>
                </div>
                <div class="module-name">{{ module.name }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config, { disableComponents } from '@/components/module/config'
  export default {
    name: 'CmpList',
    props: {
      status: { // 'index'首页, 'special'专题
        type: String,
        default: 'special'
      }
    },
    data() {
      return {
        config
      }
    },
    methods: {
      handleClick(item) {
        // 需要对组件做过滤处理，禁止用户选中被屏蔽的组件
        if (this.getDisable(item)) {
          this.$emit('success', JSON.parse(JSON.stringify(item)))
        }
      },
      getDisable(item) {
        /*
        * 获得对应数据的组件禁用信息
        * true 表示通过
        * */
        const id = this.$route.query.id
        // 如果没有获取到 id，直接通过
        if (!id) return true
        const cmp = disableComponents.filter(o => o.id === Number(id))
        if (cmp.length) {
          // 如果匹配到数据了，就进行处理
          if (cmp[0].disabled.includes(item.enName)) {
            // 如果禁用里面有这个组件，直接返回 false
            console.error(`组件<${item.name}>在当前页面不可用！`) // eslint-disable-line
            return false
          } else {
            return true
          }
        } else {
          // 如果没有匹配到数据，也直接通过
          return true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cmp-list{border:1px solid #E4E7ED;width:300px;padding:20px;
    .cmp-title{font-size:18px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #f1f1f1;
    }
    .list{
      .module-title{font-size:14px;margin-bottom:10px;}
      .module-list{text-align: center;
        .module-box{border:1px solid #ccc;padding:10px;color:#303133;cursor: pointer;user-select: none;
          &.is-disabled{
            border:1px solid #ccc;cursor: not-allowed;
            .module-icon{color:#ccc;}
            .module-name{color:#ccc;}
          }
          &:hover{
            &:not(.is-disabled){border-color:#409EFF;color:#409EFF;}
          }
          &:last-child{margin-bottom:10px;}
          .module-icon{font-size:24px;}
          .module-name{font-size:12px;padding-top:10px;}
        }
      }
    }
  }
</style>
