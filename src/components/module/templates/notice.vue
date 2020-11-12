<template>
  <div class="notice-component">
    <div class="notice-image">
      <img :src="config.content.image" />
    </div>
    <div class="notice-line">
      <div class="" v-for="(item, index) in config.content.list" :key="index" v-if="(config.config.line === 2 && index < 2) || (config.config.line === 1 && index < 1)">
        · {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Notice',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 4,
            name: '公告',
            enName: 'notice',
            num: 2,
            related: [],
            type: ['index', 'special'],
            push: 'start',
            config: {
              line: 1 // 每行展示的数量
            },
            content: { // 内容
              image: '', // 公告图片，建议图片尺寸宽度150×150，支持类型：jpg、png
              /*
             * 参数
             * {
             *   title: '' // 标题
             *   url: '' // 链接
             * }
             * */
              list: [] // 公告，最多两个
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .notice-component{display: flex;max-height:100px;min-height:50px;align-items: center;
    .notice-image{height:50px;width:50px;flex-shrink: 0;
      img{width:100%;height:100%;}
    }
    .notice-line{flex:1;width:0;
      >div{font-size:14px;color:#545454;text-indent:10px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
        &:nth-child(2){padding-top:10px;}
      }
    }
  }
</style>
