<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="50px" inline size="mini">
      <el-form-item label="分类" prop="address">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="rootId.value">
              <el-select
                v-model="form.rootId.value"
                placeholder="请选择"
                @change='val=>handleChange(val,"type2")'
              >
                <el-option
                  v-for="item in type1List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="parentId.value">
              <el-select
                v-model="form.parentId.value"
                placeholder="请选择"
                @change='val=>handleChange(val, "type3")'
              >
                <el-option
                  v-for="item in type2List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="categoryId.value">
              <el-select
                v-model="form.categoryId.value"
                placeholder="请选择"
                @change='val=>handleChange(val,"")'
              >
                <el-option
                  v-for="item in type3List"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="状态" prop="enable.value">
        <el-select v-model="form.enable.value" placeholder="请选择" clearable style="width:150px">
          <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName.value" label-width="80px">
        <el-input v-model="form.goodsName.value" placeholder="商品名称" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
import { queryBaseCategory } from '@/api/baseCategory'
export default {
  name: 'Search',
  data() {
    return {
      form: {
        // enterStatus: { value: '', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING }, // 查询审核通过的门店
        goodsName: { value: '', name: 'goodsName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        rootId: { value: '', name: 'rootId', matchType: MatchType.EQUAL, type: DataType.STRING },
        parentId: { value: '', name: 'parentId', matchType: MatchType.EQUAL, type: DataType.STRING },
        categoryId: { value: '', name: 'categoryId', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      typeOption: [
        { value: '', label: '全部' },
        { value: '0', label: '已禁用' },
        { value: '1', label: '已启用' }
      ],
      type1List: [],
      type2List: [],
      type3List: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(id) {
      queryBaseCategory({
        parentId: id || null
      }).then(res => {
        if (res.code === 200) {
          this.type1List = res.result.filter(item => item.merchantCategoryFlag) || []
        } else {
          this.type1List = []
        }
      })
    },
    handleChange(id, name) {
      if (id && name) {
        queryBaseCategory({ parentId: id }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            if (name === 'type2') {
              this.form.parentId.value = ''
              this.form.categoryId.value = ''
            } else {
              this.form.categoryId.value = ''
            }
          } else {
            this[`${name}List`] = []
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
