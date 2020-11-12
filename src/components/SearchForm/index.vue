<template>
  <div class="search-form-wrap">
    <el-form ref="form" :model="form" :rules="rules" :inline="true" :label-width="labelWidth" :size="size">

      <template v-for="item in formConfig">
        <slot v-if="item.slot" :name="item.prop"></slot>
        <template v-else>
          <!--input-->
          <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop" :key="item.prop">
            <el-input
              v-if="item.type === 'input'"
              v-model="form[item.prop].value"
              :placeholder="`请输入${item.label}`"
            ></el-input>
          </el-form-item>
          <!--select-->
          <el-form-item v-else-if="item.type === 'select'" :label="item.label" :prop="item.prop" :key="item.prop">
            <el-select
              v-model="form[item.prop].value"
              :placeholder="`请选择${item.label}`"
            >
              <el-option v-for="option in item.options" :label="option.label" :value="option.value" :key="option.value" />
            </el-select>
          </el-form-item>
          <!-- address -->
          <form-item-address
            v-else-if="item.type === 'address'"
            v-model="form[item.prop].value"
            :label="item.label"
            :prop="item.prop"
            :deep="item.deep"
            :valueKey="item.valueKey"
            :placeholder="`请选择${item.label}`"
          />
          <!--dateRange-->
          <el-form-item v-else-if="item.type === 'dateRange'" :label="item.label" :prop="item.prop">
            <el-date-picker
              v-model="form[item.prop].value"
              align="left"
              type="daterange"
              :size="size"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </template>
      </template>

      <slot name="form"></slot>

      <div class="operates" :class="mode">
        <slot name="operates">
          <el-button
              v-if="buttons.includes('reset')"
              type="default"
              icon="el-icon-refresh-right"
              :size="size"
              @click="handleOperatesChange('reset')"
          >重置</el-button>
          <el-button
              v-if="buttons.includes('search')"
              type="primary"
              icon="el-icon-search"
              :size="size"
              @click="handleOperatesChange('search')"
          >查询</el-button>
          <el-button
              v-if="buttons.includes('add')"
              type="primary"
              icon="el-icon-plus"
              :size="size"
              @click="handleOperatesChange('add')"
          >{{addButtonText}}</el-button>
          <slot name="more-operates"></slot>
        </slot>
      </div>
    </el-form>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    name: 'SearchForm',
    components: {
      FormItemAddress: () => import('@/components/FormItemAddress')
    },
    props: {
      mode: {
        type: String,
        default: 'inline' // inline | block | flex
      },
      formConfig: {
        type: Array,
        default: () => ([])
      },
      form: {
        type: Object,
        default: () => ({})
      },
      rules: {
        type: Object,
        default: () => ({})
      },
      size: {
        type: String,
        default: 'mini'
      },
      labelWidth: {
        type: String,
        default: '70px'
      },
      addButtonText: {
        type: String,
        default: '添加'
      },
      buttons: {
        type: Array,
        default: () => {
          return ['reset', 'search', 'add']
        }
      }
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return dayjs(time).endOf('day').unix() > dayjs().endOf('day').unix()
          }
        }
      }
    },
    methods: {
      handleOperatesChange(type) {
        if (type === 'search') {
          this.$refs.form.validate(validate => {
            if (validate) {
              this.$emit('change', type)
            } else {
              this.message.warn('搜索表单验证失败')
            }
          })
        } else {
          if (type === 'reset') {
            this.$refs.form.resetFields()
          }
          this.$emit('change', type)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-form-wrap {
    border-bottom: 1px solid #eee;

    .el-form {
      text-align: left;

      .el-input {
        width: 172px;
      }

      &:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
      }
      /deep/ .el-form-item {
        white-space: nowrap;
      }
    }

    .operates {
      padding-bottom: 18px;
    }

    .operates.flex {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .operates.inline {
      float: right;
      display: inline-block;
    }
  }
</style>
