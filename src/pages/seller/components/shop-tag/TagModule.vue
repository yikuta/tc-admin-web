<template>
  <el-dialog :title="title" :visible="visible" @close="onChange(false)" :close-on-click-modal='false'>
    <component 
      :is="tagList[activeIndex]"
      :shopLogoTag.sync='info.shopLogoTag'
      :characteristicTag.sync='info.characteristicTag'
      :shopTags.sync='info.shopTags'
      ref="BatchTags"></component>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="onChange(false)">我再想想</el-button>
      <el-button size="mini" type="primary" @click="handleUpdateTag" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import BatchStoreTags from './BatchStoreTags'
import BatchShopTags from './BatchShopTags'
import BatchFeatureTags from './BatchFeatureTags'
export default {
  components: { BatchStoreTags, BatchShopTags, BatchFeatureTags },
  props: {
    dialogVisible: Boolean,
    activeIndex: {
      type: Number,
      default: () => 0
    },
    title: String
  },
  data() {
    return {
      visible: false,
      tagList: [BatchStoreTags, BatchShopTags, BatchFeatureTags],
      loading: false,
      info: {}
    }
  },
  watch: {
    visible(n) {
      this.$emit('update:dialogVisible', n)
    },
    dialogVisible(n) {
      this.visible = n
      if (n) {
        const { shopTags, shopLogoTag, characteristicTag } = this.$parent.info
        this.info = {
          shopTags, shopLogoTag, characteristicTag
        }
      }
    }
  },
  methods: {
    onChange(visible) {
      this.visible = visible
      this.$emit('update:visible', visible)
    },
    handleUpdateTag() {
      this.$emit('update-tag', this.info)
    }
  }
}
</script>