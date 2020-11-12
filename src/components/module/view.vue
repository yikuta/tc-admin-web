<template>
  <div class="cmp-view">
    <div class="view-head">
      <div class="phone-bar">
        <div class="time">{{ nowTime }}</div>
        <div class="right">
          <svg-icon icon-class="signal"></svg-icon>
          <svg-icon icon-class="wifi"></svg-icon>
          <svg-icon icon-class="power"></svg-icon>
        </div>
      </div>
      <div class="phone-title">
        <div class="title-name">{{ moduleName }}</div>
        <div class="opt">
          <div class="">
            <i class="el-icon-more"></i>
          </div>
          <div class="">
            <svg-icon icon-class="yuan"></svg-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="view-content">
      <div class="relative-content" v-if="configType === 'INDEX'">
        <div class="address">
          <svg-icon icon-class="dot"></svg-icon>
          太平洋保险大厦18楼{{ activeIndex }}
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="search-bar">
          <i class="el-icon-search"></i>
          输入门店或菜品名称
        </div>
      </div>
      <div class="module-view">
        <vue-draggable v-model="module" @end="handleMoveEnd" draggable=".can-sort">
          <div class="module-line" v-for="(item, index) in module" :key="index" :class="[{active: activeIndex === index, 'no-border': !item.systemConfig.border, 'can-sort': item.systemConfig.sort}, `modules-${item.enName}` ]" @click="handleClick(index)">
            <component :config="item" :is="item.enName"></component>
            <div class="delete-icon cursor" @click.stop="handleDelete(index)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </vue-draggable>
      </div>
    </div>
  </div>
</template>

<script>
  import VueDraggable from 'vuedraggable'
  export default {
    name: 'CmpView',
    components: {
      VueDraggable,
      carousel: resolve => {
        return require(['./templates/carousel.vue'], resolve)
      },
      images: resolve => {
        return require(['./templates/images.vue'], resolve)
      },
      vajra: resolve => {
        return require(['./templates/vajra.vue'], resolve)
      },
      notice: resolve => {
        return require(['./templates/notice.vue'], resolve)
      },
      pureText: resolve => {
        return require(['./templates/pureText.vue'], resolve)
      },
      secKill: resolve => {
        return require(['./templates/secKill.vue'], resolve)
      },
      makeGroup: resolve => {
        return require(['./templates/makeGroup.vue'], resolve)
      },
      goodsList: resolve => {
        return require(['./templates/goodsList.vue'], resolve)
      },
      goodsRecommend: resolve => {
        return require(['./templates/goodsRecommend.vue'], resolve)
      },
      ppvShop: resolve => {
        return require(['./templates/ppvShop.vue'], resolve)
      },
      positionBall: resolve => {
        return require(['./templates/positionBall.vue'], resolve)
      }
    },
    props: {
      moduleName: {
        type: String,
        default: '天呈净菜'
      },
      module: {
        type: Array,
        default: () => {
          return []
        }
      },
      activeIndex: {
        type: Number,
        default: 0
      },
      configType: {
        type: String,
        default: 'INDEX'
      }
    },
    watch: {
    },
    computed: {
      nowTime() {
        const time = new Date()
        return `${time.getHours()}:${time.getMinutes()}`
      }
    },
    methods: {
      handleMoveEnd(e) {
        // 计算默认索引的数值
        // 注意自行整理拖动判断索引逻辑
        if (this.activeIndex === e.oldIndex) {
          // 当索引和旧的一样，则表示拖动的是选中的
          this.$emit('update:activeIndex', e.newIndex)
        } else {
          // 当拖动的不一样的时候，需要判断拖动的方向
          if (e.newIndex > e.oldIndex) {
            // 从上往下拖动
            if (this.activeIndex === e.newIndex || (this.activeIndex < e.newIndex && this.activeIndex > e.oldIndex)) {
              // 如果相等，则减一
              // 当新的超过了索引，则减一
              this.$emit('update:activeIndex', --this.activeIndex)
            }
          } else {
            // 从下往上拖动
            if (this.activeIndex === e.newIndex || (this.activeIndex > e.newIndex && this.activeIndex < e.oldIndex)) {
              // 如果相等，则加一
              // 当新的超过了索引，则加一
              this.$emit('update:activeIndex', ++this.activeIndex)
            }
          }
        }
        this.$emit('update:module', this.module)
      },
      handleClick(index) {
        this.$emit('update:activeIndex', index)
      },
      handleDelete(index) {
        // 删除
        this.$confirm('模块删除后现有新增的数据无法恢复。', '提示', {}).then(() => {
          const item = this.module.splice(index, 1)[0]
          if (this.activeIndex === index) {
            // 如果删除的是当前的索引，则重置索引为0
            this.$emit('update:activeIndex', 0)
          }
          if (this.activeIndex > index) {
            const i = this.activeIndex - 1
            this.$emit('update:activeIndex', i)
          }
          this.$emit('change', item)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cmp-view{width:395px;border:1px solid #E4E7ED;user-select: none;position:relative;
    .view-head{
      .phone-bar{display: flex;justify-content: space-between;padding:5px;
        .time{}
        .right{}
      }
      .phone-title{position:relative;height:50px;line-height: 50px;border-bottom:1px solid #E4E7ED;
        .title-name{text-align: center;}
        .opt{position:absolute;width:70px;border:1px solid #ccc;display: flex;border-radius:100px;justify-content: space-between;padding:5px 10px;right:10px; top:7px;line-height: initial;font-size:14px;
          >div{
            &:first-child{border-right:1px solid #ccc;padding-right:8px;}
          }
        }
      }
    }

    .view-content{height:585px;overflow: auto;background:#F8F8F8;
      .relative-content{margin-bottom:10px;
        .address{text-align:center;font-size:14px;padding:10px 0;}
        .search-bar{background:#DCDFE6;color:#F2F6FC;border-radius:100px;text-align: center;margin:0 10px;padding:10px 0;font-size:14px;}
      }
      .module-view{height:510px;
        .module-line{position:relative;
          &.no-border{position:static;}
          &:hover:not(.no-border),&.active:not(.no-border){
            &:before{position:absolute;height:100%;width:100%;top:0;left:0;border:2px dashed #409EFF;content: '';z-index:10;}
            .delete-icon{display: block;z-index:10;}
          }
          /*处理悬浮球的样式*/
          &:hover,&.active{
            .positionBall{
              &:before{position:absolute;height:100%;width:100%;top:0;left:0;border:2px dashed #409EFF;content: '';z-index:10;}
            }
            &.modules-positionBall{
              .delete-icon{bottom:20px;right:20px;z-index:101;display: inline-block;}
            }
          }
          .delete-icon{position:absolute;right:0;bottom:0;background:rgba(0,0,0,0.2);color:#fff;padding:2px 10px;cursor: pointer;display: none;
            &:hover{
              background:#409EFF;
            }
          }
        }
      }
    }
  }
</style>
