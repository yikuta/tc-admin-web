<template>
  <div class="depotArea">
    <el-card>
      基础分类
      <div v-for="(area, index) in kindArr" :key="index">
        <el-cascader
        size="small"
        v-model="kindArr[index]"
        :options="options" :props="optionProps" @change="handleChange(index)" @visible-change="visibleChange($event, index)"></el-cascader>
        <el-button size="small" v-if="kindArr.length < 10" @click="addKind(index)"><i class="el-icon-plus"></i></el-button>
        <el-button size="small" v-if="kindArr.length > 1" @click="delKind(index)"><i class="el-icon-minus"></i></el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
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
      // options: [],
      kindArr: [[]],
      kindObjArr: []
    }
  },
  mounted() {
    if (this.selected.length) {
      let kindArr = []
      this.selected.map((el) => {
        let arr = []
        arr[0] = el.kind1.id
        if (el.kind2) {
          arr[1] = el.kind2.id
        }
        kindArr.push(arr)
      })
      this.kindArr = kindArr
      this.kindObjArr = this.selected
    } else {
      this.kindArr = [[]]
    }
  },
  methods: {
    visibleChange(bol, index) {
      if (!bol) {
        let kind = this.kindArr[index]
        let item = {}
        this.options.map((el) => {
          if (el.id === kind[0]) {
            let kind1 = JSON.parse(JSON.stringify(el))
            delete kind1.children
            item.kind1 = kind1
            if (!kind[1]) {
              return false
            }
            el.children.map((el2) => {
              if (el2.id === kind[1]) {
                let kind2 = JSON.parse(JSON.stringify(el2))
                // delete kind2.children
                item.kind2 = kind2
              }
            })
          }
        })
        this.kindObjArr.splice(index, 1, item)
        this.$emit('on-select-kind', this.kindObjArr)
      }
    },
    handleChange() {
    },
    addKind(index) {
      // 1
      this.kindArr.splice(index + 1, 0, [])
    },
    delKind(index) {
      // 2
      // this.kindArr.splice(index, 1)
      if (this.kindArr.length === 1) {
        this.kindArr = [[]]
        this.kindObjArr = []
      } else {
        this.kindArr.splice(index, 1)
        this.kindObjArr.splice(index, 1)
      }
      this.$emit('on-select-kind', this.kindObjArr)
    }
  }
}
</script>
<style scoped lang="scss">
.input-width {
  width: 200px;
}
</style>