<template>
  <div class="text-component" :style="{ backgroundImage:`url('${config.content.image}')` }">
    <div class="title" :style="{ fontSize: `${config.config.titleSize}px`, textAlign: config.config.align }">{{ config.content.title }}</div>
    <div class="title" :style="{ fontSize: `${config.config.contentSize}px` }">{{ config.content.content }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Text',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 5,
            name: '纯文本',
            enName: 'pureText',
            num: 10,
            related: [],
            type: ['special'],
            push: 'start',
            sort: true, // 是否可以拖动
            config: {
              titleSize: 14, // 标题字体大小
              align: 'left', // 标题位置
              contentSize: 14 // 正文字体大小
            },
            content: {
              title: '', // 标题
              content: '', // 文本
              image: '' // 背景图 建议图片尺寸宽度150×150，支持类型：jpg、png。
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-component{
    min-height:100px;background-size:100% 100%;
  }
</style>
