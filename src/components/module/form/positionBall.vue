<template>
  <div class="positionBall padding">
    <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">悬浮</div>
    <el-row class="padding-bottom-sm">
      <el-col :span="8" class="text-df text-second">展示内容</el-col>
      <el-col :span="16">
        <el-radio-group v-model="config.config.type">
          <el-radio label="cart">购物车</el-radio>
          <el-radio label="top">回到顶部</el-radio>
          <el-radio label="default">自定义</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <div class="padding-top-sm" v-if="config.config.type === 'default'">
      <div class="text-sm text-seat padding-top-sm">建议图片尺寸宽度150，支持类型：jpg、png。</div>
      <div class="content-list padding-top-sm">
        <div class="list-line bg-seat padding-sm">
          <div class="right-opt">
            <div class="line-image bg-sec margin-right-sm cursor" @click.stop="handleSelect(0, 'image')">
              <img :src="config.content.image" />
            </div>
            <div class="line-content cursor" @click.stop="handleSelect(0, 'common')">
              <div class="text-sm text-second padding-bottom-sm">类型：{{ config.content.typeName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <image-dialog :visible.sync="imageVisible" @success="handleSuccess"></image-dialog>
    <common-dialog :visible.sync="commonVisible" @success="handleSuccess"></common-dialog>
  </div>
</template>

<script>
  import { commonDialogConfig } from '../config'

  export default {
    name: 'positionBall',
    components: {
      ImageDialog: resolve => {
        return require(['../components/image'], resolve)
      },
      CommonDialog: resolve => {
        return require(['../components/commonDialog'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        imageVisible: false, // 图片弹窗
        commonVisible: false, // 通用弹窗
        dialogCache: {
          type: '', // 类型
          index: 0 // 缓存当前弹窗对应的索引
        }
      }
    },
    methods: {
      handleSelect(index, type) {
        // 进入弹窗选择
        this.dialogCache = {
          type,
          index
        }
        this[`${type}Visible`] = true
      },
      handleSuccess(result) {
        // 选择了图片
        if (this.dialogCache.type === 'image') {
          this.config.content.image = result.fileUrl
        } else {
          this.config.content = {
            ...this.config.content,
            typeId: result.typeId,
            typeName: result.typeName,
            content: {
              ...commonDialogConfig,
              ...result.content
            }
          }
        }
      },
      getValid() {
        if (this.config.config.type !== 'default') {
          return true
        } else {
          if (!this.config.content.typeId) {
            this.$message.error('请选择对应的跳转信息')
            return false
          }
          if (!this.config.content.image) {
            this.$message.error('请选择悬浮球图片')
            return false
          }
          return true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
  .content-list{
    .list-line{display: flex;align-items: center;
      .left-opt{flex-shrink: 0;width:20px;}
      .right-opt{display:flex;align-items: center;flex-grow:1;
        .line-image{width:50px;height:50px;flex-shrink:0;
          img{width:100%;height:100%;}
        }
        .line-content{flex:1;width:0;
          >div{
            >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
          }
        }
      }
    }
  }
</style>
