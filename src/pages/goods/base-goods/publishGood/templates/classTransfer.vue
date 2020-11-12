<template>
  <div>
    <el-card class="class-transfer" size="mini">
      <div slot="header">
        <span>请选择商品分类</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="card-box" size="mini">
            <div v-for="(item, index) in transfer[0]" :key="index" class="text item" :class="[{'active': classList[0] && item.id === classList[0]}]"
                 @click="handleSelectCategory(0, item)">
              {{ item.name }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card-box" size="mini">
            <div v-for="(item, index) in transfer[1]" :key="index" class="text item" :class="{ 'active': classList[1] && item.id === classList[1] }"
                 @click="handleSelectCategory(1, item)">
              {{ item.name }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="card-box" size="mini">
            <div v-for="(item, index) in transfer[2]" :key="index" class="text item" :class="{ 'active': classList[2] && item.id === classList[2] }"
                 @click="handleSelectCategory(2, item)">
              {{ item.name }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-card size="mini">您当前选择的商品类别是：
      <template v-for="(item, index) in selectName">
        <span v-if="index !== 0 && item"> <i class="el-icon-arrow-right"/> </span>
        {{ item }}
      </template>
    </el-card>
  </div>
</template>

<script>
  import { getBaseCategoryList } from '@/api/baseCategory'

  export default {
    name: 'classTransfer',
    props: {
      classList: {
        type: Array,
        default: () => []
      },
      selectName: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        transfer: []
      }
    },
    mounted() {
      this.getTransferList(0)
    },
    methods: {
      // 获取商品分类
      getTransferList(index, parentId) {
        getBaseCategoryList({
          parentId: parentId || null,
          status: true
        }).then(res => {
          const { code, result } = res
          if (code === 200) {
            this.$set(this.transfer, index, result)
            if (result && result.length) {
              // 默认选中第一项
              this.$emit('select', { index, item: result[0] })
              if (index < 2) {
                this.getTransferList(index + 1, result[0].id)
              }
            } else {
              let count = 2
              while (count >= index) {
                this.$emit('select', { index: count, item: {}})
                count--
              }
              this.$set(this.transfer, 2, [])
            }
          }
        })
      },
      // 选择分类
      handleSelectCategory(index, item) {
        this.$emit('select', { index, item: { id: item.id, name: item.name }})
        if (index < 2 && item.id) {
          this.getTransferList(index + 1, item.id)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .class-transfer {
    .card-box {
      overflow-y: auto;
      height: 300px;

      .item {
        padding: 5px 0;
        font-size: 14px;
        cursor: pointer;
        text-indent: 10px;

        &:hover {
          background: #409eff;
          color: #fff;
        }

        &.active {
          background: #409eff;
          color: #fff;
        }
      }
    }
  }
</style>
