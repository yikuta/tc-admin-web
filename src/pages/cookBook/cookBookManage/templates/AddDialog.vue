<template>
  <div class="app-container">
    <el-dialog title="设置标签" :visible="visible" @update:visible="onChange" width="720px" @open='handleOpen'>
      <div class="tags">
        <el-checkbox-group v-model="checkList" :max='10'>
          <el-checkbox v-for="(item, index) in tagList" :key="index" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleSave">提交</el-button>
        <el-button type="plain" size="mini" @click="onChange(false)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchCookBookTagList } from '@/api/cookBook'
  import { MatchType, DataType } from '@/constants/search'
  import searchTool from '@/utils/searchTool'
  import { deepClone } from '@/utils/util'
  export default {
    name: 'AddDialog',
    props: {
      visible: Boolean,
      ids: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        tagList: [],
        checkList: [],
        form: {
          enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
        }
      }
    },
    methods: {
      onChange(visible) {
        this.$emit('update:visible', visible)
      },
      handleClose(isSuccess) {
        this.$emit('update:visible', false)
        this.$emit('close', isSuccess)
      },
      handleTagList() {
        const searches = searchTool(deepClone(this.form))
        fetchCookBookTagList({
          pageNo: 1,
          pageSize: 999999,
          orderbys: ['sort', 'createTime'],
          sorts: ['desc', 'desc'],
          searchs: searches.length ? JSON.stringify(searches) : null
        }).then(res => {
          if (res.code === 200) {
            this.tagList = res.result.itemVOs || []
          } else {
            this.tagList = []
          }
        })
      },
      handleSave() {
        this.$emit('set', this.checkList)
      },
      handleOpen() {
        this.checkList = this.ids
        this.handleTagList()
      }
    }
  }
</script>

<style lang='scss' scoped>
.tags{
  .el-checkbox{
    margin-bottom: 14px;
  }
}
</style>
