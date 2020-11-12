<template>
  <div class="base-table">
    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        v-if="selection"
        type="selection"
        :selectable="selectableCallback"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.id"
        :prop="item.prop"
        :label="item.title"
        :width="item.width"
      >
        <template slot-scope="{ row, $index }">
          <template v-if="!item.slot">
            <span v-if="!item.formatter">{{item.prop !== '$index' ? row[item.prop] : $index + 1}}</span>
            <span v-else v-html="item.formatter(row, item, $index)"></span>
          </template>
          <slot v-else-if="item.slot" :name="item.prop" :row="row" :index="$index" :column="item"></slot>
        </template>
      </el-table-column>
      <slot name="operates"></slot>
    </el-table>
    <pagination
      v-if="pagination"
      :pageSize="pagination.pageSize"
      :total="pagination.total"
      :current="pagination.pageNo"
      @onSizeChange="handleSizeChange"
      @onPageChange="handlePageChange"
    ></pagination>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'
  export default {
    name: 'BaseTable',
    components: {
      Pagination
    },
    props: {
      selection: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default() {
          return null
        }
      },
      columns: {
        type: Array,
        default: () => []
      },
      selectableCallback: {
        type: Function,
        default: () => { return true }
      }
    },
    methods: {
      handleSizeChange(pageSize) {
        this.$emit('change', { pageSize, pageNo: this.pagination.pageNo })
      },
      handlePageChange(pageNo) {
        this.$emit('change', { pageNo, pageSize: this.pagination.pageSize })
      },
      handleSelectionChange(value) {
        this.$emit('selection-change', value)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
