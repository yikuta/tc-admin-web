<template>
  <div class="depotType">
    <el-card>
      <el-input
        class="input-width"
        size="mini"
        placeholder="输入关键词查询"
        prefix-icon="el-icon-search"
        v-model="searchForm.searchVal.value">
      </el-input>
      <el-button size="mini" type="primary" @click="searchType">查询</el-button>
      <div class="checkbox">
        <el-checkbox-group v-model="typeCheckedList" @change="typeCheckedChange">
          <el-checkbox  v-for="(item, index) in typeList" :key="index" :label="item.code">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>
  </div>
</template>
<script>
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'depotType',
  props: {
    putOnStatusOptions: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchForm: {
        searchVal: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING }
      },
      typeList: [],
      typeCheckedList: [],
      typeAllList: []
    }
  },
  mounted() {
    this.typeList = this.putOnStatusOptions
    let arr = []
    this.selected.map((el) => {
      arr.push(el.code)
    })
    this.typeCheckedList = arr
  },
  methods: {
    searchType() {
      // 1
      let searchArr = []
      this.putOnStatusOptions.map((item) => {
        if (item.name.indexOf(this.searchForm.searchVal.value) > -1) {
          searchArr.push(item)
        }
      })
      this.typeList = searchArr
    },
    typeCheckedChange() {
      let selected = []
      this.typeCheckedList.map((sel) => {
        this.putOnStatusOptions.map((item) => {
          if (item.code === sel) {
            selected.push(item)
          }
        })
      })
      this.$emit('on-checked-type', selected)
    }
  }
}
</script>
<style scoped lang="scss">
.input-width {
  width: 200px;
}
.checkbox {
  > div {
    display: flex;
    flex-flow: column;
  }
}
</style>
