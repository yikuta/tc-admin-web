<template>
  <div>
    <div class="list-line bg-seat padding-sm" v-for="(item, index) in config.content.list" :key="index">
      <div class="left-opt" v-if="config.systemConfig.num > 1">
        <div class="btn-top cursor" :class="{ 'text-seat': index === 0, 'text-hover-brand': index !== 0 }" @click.stop="handleSeat(index, 'up')">
          <i class="el-icon-top"></i>
        </div>
        <div class="btn-bottom  cursor" :class="{ 'text-seat': index === config.content.list.length - 1, 'text-hover-brand':index !== config.content.list.length - 1 && config.content.list.length > 1 }" @click.stop="handleSeat(index, 'down')">
          <i class="el-icon-bottom"></i>
        </div>
      </div>
      <div class="right-opt">
        <div class="line-image bg-sec margin-right-sm cursor" @click.stop="handleSelect(index, 'image')" v-if="showImage">
          <img :src="item.image" />
        </div>
        <div class="line-content cursor" @click.stop="handleSelect(index, 'common')">
          <div class="text-sm text-second padding-bottom-sm" v-if="item.title !== undefined" @click.stop>标题：<el-input type="text" size="mini" v-model="item.title" style="width:80%;vertical-align: middle;" placeholder="请输入标题名称" :maxLength="config.enName === 'vajra' ? 5 : 25" /></div>
          <div class="text-sm text-second padding-bottom-sm">链接类型：{{ item.typeName }}</div>
          <div class="text-sm text-second" v-if="item.typeId === 1">
            <div>链接目标：{{ item.content.baseData && item.content.baseData.name || '' }}</div>
          </div>
          <div class="text-sm text-second" v-if="item.typeId === 2">
            <div>价格：{{ item.content.baseData && item.content.baseData.minSalePrice || item.content.baseData.maxSalePrice || '' }}</div>
          </div>
          <div class="text-sm text-second" v-if="item.typeId === 3">
            <div>分类名称：{{ item.content.baseData && item.content.baseData || '' }}</div>
          </div>
          <div class="text-sm text-second" v-if="item.typeId === 4">
            <div>名称：{{ item.content.baseData && item.content.baseData.name || '' }}</div>
          </div>
          <div class="text-sm text-second" v-if="item.typeId === 5">
            <div>名称：{{ item.content.baseData && item.content.baseData.name || '' }}</div>
          </div>
          <div class="text-sm text-second" v-if="item.typeId === 6">
            <div class="padding-bottom-sm">链接目标：{{ item.content.baseData && item.content.baseData.value || '' }}</div>
            <div>链接地址：{{ item.content.platformLink || '' }}</div>
          </div>
        </div>
        <div class="delete-icon">
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.stop="handleDelete(index)" v-if="config.content.list.length > 1"></el-button>
        </div>
      </div>
    </div>
    <div class="padding-top-sm text-right">
      <el-button type="primary" size="mini" @click="handleAdd">添加({{ config.content.list.length }}/{{ config.systemConfig.num }})</el-button>
    </div>
    <image-dialog :visible.sync="imageVisible" @success="handleSuccess"></image-dialog>
    <common-dialog :visible.sync="commonVisible" @success="handleSuccess"></common-dialog>
  </div>
</template>

<script>
  import { commonDialogConfig } from '../../config'
  export default {
    name: 'CommonImage',
    components: {
      ImageDialog: resolve => {
        return require(['../../components/image'], resolve)
      },
      CommonDialog: resolve => {
        return require(['../../components/commonDialog'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      },
      showImage: {
        type: Boolean,
        default: true
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
      handleAdd() {
        // 添加一个图片选项
        if (this.config.content.list.length === this.config.systemConfig.num) {
          this.$message.warning(`当前只能添加${this.config.systemConfig.num}个图片`)
          return
        }
        // 添加循环第一个数组的参数进行操作，因为涉及到如 title 这类单独的字段
        const baseObj = this.config.content.list[0]
        let newObj = {}
        for (let key in baseObj) {
          if (baseObj.hasOwnProperty(key)) {
            newObj[key] = ''
          }
        }
        // 插入内容
        this.config.content.list.push({
          ...newObj,
          content: {
            ...commonDialogConfig
          }
        })
      },
      handleDelete(index) {
        // 删除
        if (this.config.content.list.length === 1) return
        this.config.content.list.splice(index, 1)
      },
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
          this.config.content.list[this.dialogCache.index].image = result.fileUrl
        } else {
          this.config.content.list.splice(this.dialogCache.index, 1, {
            ...this.config.content.list[this.dialogCache.index],
            typeId: result.typeId,
            typeName: result.typeName,
            content: {
              ...commonDialogConfig,
              ...result.content
            }
          })
          // this.config.content.list[this.dialogCache.index] = {
          //   ...this.config.content.list[this.dialogCache.index],
          //   typeId: result.typeId,
          //   typeName: result.typeName,
          //   content: {
          //     ...commonDialogConfig,
          //     ...result.content
          //   }
          // }
        }
        this.$emit('change')
      },
      handleSeat(index, opt) {
        // 位置移动
        if (opt === 'up') {
          // 往上
          if (index === 0) {
            // 如果已经等于0则不操作
            return
          }
        } else {
          if (index === this.config.content.list.length - 1) {
            // 最后一个不能再往下
            return
          }
        }
        // 细细品尝
        this.config.content.list.splice(opt === 'up' ? index - 1 : index + 1, 0, this.config.content.list.splice(index, 1)[0])
      },
      getValid() {
        // 验证数组是否已经选择了数据
        // 如果数组为空，直接返回 false
        if (!this.config.content.list.length) {
          this.$message.error('最少需要添加一项')
          this.handleAdd()
          return false
        }
        let flag = true // 设置当前的返回状态
        for (let i = 0; i < this.config.content.list.length; i++) {
          // 如果 typeId 为空，则表明没有选择数据，是否选择了内容在弹窗里面已经做了验证，所以只需要验证 typeId
          if (!this.config.content.list[i].typeId || (this.config.content.list[i].title !== undefined && !this.config.content.list[i].title)) {
            flag = false
            break
          }
        }
        return flag
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/common";
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
</style>
