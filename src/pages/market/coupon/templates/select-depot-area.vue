<template>
  <div class="depotArea">
    <el-card>
      <div v-for="(area, index) in areaArr" :key="index">
        <el-cascader
        class="areaSelect"
        size="small"
        v-model="areaArr[index]"
        :options="options" :props="optionProps" @change="handleChange(index)"></el-cascader>
        <el-button size="small" v-if="areaArr.length < 10" @click="addAreas(index)"><i class="el-icon-plus"></i></el-button>
        <el-button size="small" v-if="areaArr.length > 1" @click="delAreas(index)"><i class="el-icon-minus"></i></el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'depotArea',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    optionProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      areaArr: [[]],
      areaObjArr: []
    }
  },
  mounted() {
    if (this.selected.length) {
      let areaArr = []
      this.selected.map((el) => {
        let arr = []
        arr[0] = el.province.code
        if (el.city) {
          arr[1] = el.city.code
        }
        if (el.county) {
          arr[2] = el.county.code
        }
        areaArr.push(arr)
      })
      this.areaArr = areaArr
      this.areaObjArr = this.selected
    } else {
      this.areaArr = [[]]
    }
  },
  methods: {
    handleChange(index) {
      let area = this.areaArr[index]
      let item = {}
      this.options.map((el) => {
        if (el.code === area[0]) {
          let sheng = JSON.parse(JSON.stringify(el))
          delete sheng.children
          item.province = sheng
          if (!area[1]) {
            return false
          }
          el.children.map((city) => {
            if (city.code === area[1]) {
              let shi = JSON.parse(JSON.stringify(city))
              delete shi.children
              item.city = shi
              if (!area[2]) {
                return false
              }
              city.children.map((qus) => {
                if (qus.code === area[2]) {
                  let qu = JSON.parse(JSON.stringify(qus))
                  // delete(shi.children)
                  item.county = qu
                }
              })
            }
          })
        }
      })
      this.areaObjArr.splice(index, 1, item)
      this.$emit('on-select-area', this.areaObjArr)
    },
    addAreas(index) {
      // 1
      this.areaArr.splice(index + 1, 0, [])
    },
    delAreas(index) {
      // 2
      if (this.areaArr.length === 1) {
        this.areaArr = [[]]
        this.areaObjArr = []
      } else {
        this.areaArr.splice(index, 1)
        this.areaObjArr.splice(index, 1)
      }
      this.$emit('on-select-area', this.areaObjArr)
    }
  }
}
</script>
<style scoped lang="scss">
.input-width {
  width: 200px;
}
.areaSelect {
  width: 420px;
}
</style>