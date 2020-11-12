<template>
  <div class="sku-box">
    <spec-group :specList="specList" :noModify="noModify" @change="_handleChangeSpecGroup" />
    <!--<sku-list :specList="effectiveSpecList" />-->
    <div class="section" v-if="specList.length > 0">
      <sku-table
        :columnsMap="columnsMap"
        ref="sku_table"
        :effectiveSpecList="effectiveSpecList"
        :skuList="skuList"
      />
      <batch-setting
        :columnsMap="columnsMap"
        :effectiveSpecList="effectiveSpecList"
        :skuList="skuList"
      />
    </div>
    <div class="section" v-else>
      <sku-table-new  ref="sku_table_new" :skuNewList="skuNewList" />
    </div>
  </div>
</template>
<script>
import SpecGroup from './templates/spec-group'
import SkuList from './templates/sku-list'
import SkuTable from './templates/sku-table'
import SkuTableNew from './templates/sku-table-new'
import BatchSetting from './templates/batch-setting'
import { columnsMap } from './config'
import {
  generateDimensionalCompose,
  createUniqueString,
  deepClone,
  flatIds
} from './util'
export default {
  name: 'skuBox',
  components: {
    SpecGroup,
    SkuList,
    SkuTable,
    BatchSetting,
    SkuTableNew
  },
  props: {
    noModify: {
      // 根据业务做调整，编辑时不能增加/删除规格组
      type: Boolean,
      default: false
    },
    columnsMap: {
      type: Array,
      default: () => columnsMap
    },
    fetchSuggestions: {
      type: Function,
      default: null
    },
    valueKey: {
      type: String,
      default: 'name'
    },
    skuNewList: {
      type: Array,
      default: () => [{}]
    },
    specList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // specList: [],
      effectiveSpecList: [],
      skuList: [],
      isBatchSetting: false,
      batchValue: null
    }
  },
  mounted() {
    // this.setSkuData(exampleSpecList)
  },
  methods: {
    // 获取有效数据
    _getEffectiveSpecList(specList) {
      const results = []
      specList.forEach(spec => {
        const newTags = (spec.tags || []).filter(tag => tag.selected)
        if (!spec.isEdit && newTags.length) {
          results.push({ ...spec, tags: deepClone(newTags) })
        }
      })
      return results
    },
    // 添加规格组
    _addSpecAssignment() {
      // 无操作
    },
    // 删除规格组
    _deleteSpecAssignment() {
      const newEffectiveSpecList = this._getEffectiveSpecList(this.specList)
      if (flatIds(newEffectiveSpecList) !== flatIds(this.effectiveSpecList)) {
        let newSkuList = this.generateSkuList(newEffectiveSpecList)
        this.effectiveSpecList = newEffectiveSpecList
        this.skuList = newSkuList
      }
    },
    // 编辑规格组
    _editSpecAssignment() {
      this.effectiveSpecList = this._getEffectiveSpecList(this.specList)
    },
    // 添加或删除规格名
    _addOrDeleteTagAssignment() {
      this.effectiveSpecList = this._getEffectiveSpecList(this.specList)
      let newSkuList = this.generateSkuList(this.effectiveSpecList)
      this.skuList = newSkuList.map(new_item => {
        let equalItem = null
        for (let i = 0, length = this.skuList.length; i < length; i++) {
          if (flatIds(new_item.tags) === flatIds(this.skuList[i].tags)) {
            equalItem = this.skuList[i]
            break
          }
        }
        if (equalItem) {
          return { ...equalItem }
        } else {
          new_item.id = createUniqueString() + '_sku_id'
          return new_item
        }
      })
    },
    // 编辑规格值名称
    _editTagAssignment(spec_index, tag_index) {
      const tagItem = this.specList[spec_index].tags[tag_index]
      if (tagItem.selected) {
        this.effectiveSpecList = this._getEffectiveSpecList(this.specList)
      }
      // 更新skuList内tag
      for (let skuItem of this.skuList) {
        for (let tag of skuItem.tags) {
          if (tag.id === tagItem.id.toString()) {
            tag.name = tagItem.name
            break
          }
        }
      }
    },
    // 规格组发生变化
    _handleChangeSpecGroup({ type, spec_index, tag_index }) {
      switch (type) {
        case 'add_spec':
          this._addSpecAssignment()
          break
        case 'delete_spec':
          this._deleteSpecAssignment()
          break
        case 'edit_spec':
          this._editSpecAssignment()
          break
        case 'add_tag':
          this._addOrDeleteTagAssignment()
          break
        case 'delete_tag':
          this._addOrDeleteTagAssignment()
          break
        case 'edit_tag':
          this._editTagAssignment(spec_index, tag_index)
          break
      }
    },
    // 生成表格
    generateSkuList(effectiveSpecList) {
      return generateDimensionalCompose(effectiveSpecList).map(item => {
        const defaultColumns = columnsMap.filter(item => item.defaultValue)
        const skuItem = {
          id: createUniqueString() + '_sku_id',
          tags: deepClone(item.tags)
        }
        defaultColumns.forEach(col => {
          skuItem[col.value] = col.defaultValue
        })
        return skuItem
      })
    },
    // 数据初始化
    setSkuData(specList, skuList) {
      const effectiveSpecList = this._getEffectiveSpecList(specList)
      this.specList = specList
      this.effectiveSpecList = effectiveSpecList
      if (skuList && skuList.length) {
        this.skuList = skuList
      } else {
        this.skuList = this.generateSkuList(effectiveSpecList)
      }
    },
    // 获取数据
    getSkuData() {
      if (this.specList.length > 0) {
        return {
          specList: this.specList,
          effectiveSpecList: this.effectiveSpecList,
          skuList: this.skuList
        }
      } else {
        return {
          specList: this.specList,
          effectiveSpecList: this.effectiveSpecList,
          skuList: this.skuNewList,
          skuNewList: this.skuNewList
        }
      }
    },
    // 验证Sku数据
    validateSku() {
      if (this.specList.length > 0) {
        return this.$refs.sku_table.validateSkuTable()
      } else {
        return this.$refs.sku_table_new.validateSkuTable()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.section {
  margin-top: 20px;
  font-size: 12px;
  color: #666;
  padding: 10px;
  border: 1px solid #e5e5e5;
}
.sku-box {
}
</style>
