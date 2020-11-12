<template>
  <div class="vajra-component">
    <div class="vajra-line" v-for="(item, index) in config.content.list" :key="index" :style="{'flex-basis': ['', '100%', '50%', '33.33%', '25%', '20%'][config.config.flex]}" v-if="config.config.line === 1 ? index < config.config.flex : index < config.config.flex * 2">
      <div class="vajra-image">
        <img :src="item.image" />
      </div>
      <div class="vajra-name">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Vajra',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 3,
            name: '金刚区',
            enName: 'vajra',
            num: 10,
            related: [],
            type: ['index', 'special'],
            push: 'start',
            config: {
              line: 1, // 展示行数
              flex: 4 // 每行展示的数量
            },
            content: { // 内容
              /*
              * 最多添加10个图片，建议图片尺寸宽度750，高度200-1000，支持类型：jpg、png。
              * 参数
              * {
              *   image: '' // 图片
              *   title: '' // 标题
              *   url: '' // 链接
              * }
              * */
              list: [] // 金刚区域，最多十个
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vajra-component{display: flex;flex-wrap: wrap;min-height:100px;
    .vajra-line{min-height:100px;
      height:100px;flex-grow:1;flex-shrink: 0;text-align: center;padding-top:15px;
      .vajra-image{height:50px;width:50px;display: inline-block;
        img{width:100%;height:100%;}
      }
      .vajra-name{font-size:12px;padding: 5px 0;}
    }
  }
</style>
