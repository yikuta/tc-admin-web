<template>
  <div>
    <el-form size="mini">
      <el-form-item label="请选择专题：">
        <el-select v-model="specialId" placeholder="请选择专题">
          <el-option v-for="(item, index) in option.special" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getSpecialList } from '@/api/cms'
  export default {
    name: 'Special',
    data() {
      return {
        specialId: null,
        option: {
          special: []
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getSpecialList({
          pageSize: 1000,
          pageNo: 1,
          searchs: '[{"tempMatchType":"4","propertyName":"renovationType","propertyValue1":"SPECIAL","tempType":"String"}]'
        }).then(res => {
          this.option.special = res.result.itemVOs
          if (this.option.special.length) {
            this.specialId = this.option.special[0].id
          }
        })
      },
      getData() {
        const info = this.option.special.filter(o => o.id === this.specialId)
        if (info.length) {
          return {
            specialId: this.specialId,
            baseData: info[0]
          }
        } else {
          return {
            specialId: this.specialId,
            baseData: null
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
