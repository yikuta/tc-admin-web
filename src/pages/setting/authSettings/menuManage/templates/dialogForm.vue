<template>
  <el-dialog
    class="dialog-form"
    :center="true"
    :title="`${form.id ? '编辑' : '添加'}菜单`"
    :visible="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form :model="form" :rules="formRules" size="small" ref="form" label-width="80px">

      <el-form-item label="上级菜单" prop="parentIds">
        <el-cascader
          :disabled="!isAdmin"
          v-model="form.parentIds"
          :options="this.menusList"
          placeholder="请选择上级菜单"
          @change="handleMenuChange"
          :props="props"
          style="width: 100%"
          ref="parentMenu"
        ></el-cascader>
      </el-form-item>

      <el-alert
        style="width: calc(100% - 80px);margin: 0 0 10px 80px"
        title="目录和菜单会展示在左侧栏，页面和按钮只能在菜单页面中展示;上级菜单为“目录”时只能添加目录或菜单，上级菜单为“菜单”时只能添加页面或按钮"
        type="success" :closable="false"
      />

      <el-form-item label="菜单类型" prop="authType">
        <el-radio-group v-model="form['authType']" :disabled="!isAdmin">
          <el-radio v-for="item in filterMenuTypes" :label="item.id" :key="item.value">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item label="授权标识" prop="code">
        <el-input v-model="form.code" autocomplete="off" placeholder="请输入授权标识" :disabled="!isAdmin" />
      </el-form-item>

      <el-form-item label="显示排序" prop="sortNum">
        <el-input-number v-model="form.sortNum" :min="0" :max="9999" label="显示排序"></el-input-number>
      </el-form-item>

<!--      <el-form-item label="菜单图标" prop="icon">-->
<!--        <el-input v-model="form.icons" autocomplete="off" placeholder="请输入菜单图标class 如：fas fa-camera" />-->
<!--      </el-form-item>-->

<!--      <el-alert-->
<!--        style="width: calc(100% - 80px);margin: -10px 0 10px 80px"-->
<!--        title="获取图标请访问：http://fontawesome.io/icons/"-->
<!--        type="success" :closable="false"-->
<!--      />-->

      <el-form-item label="备注说明" prop="remark">
        <el-input type="textarea" :rows="3" v-model="form.remark" autocomplete="off" placeholder="请输入备注说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">确定{{form.id ? '编辑' : '添加'}}</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addPermission, updatePermission } from '@/api/setting/authSetting'
  import { filterEmptyParams, deepClone } from '@/utils/util'
  import { menuTypes, formRules, folderSubsets, menuTypeMap } from '../constant'

  function filterInvalidData(data, id) {
    return data.filter(item => {
      if (item.id === id) return false
      if (item.children && item.children.length) {
        item.children = filterInvalidData(item.children, id)
      }
      return true
    })
  }

  export default {
    name: 'dialogForm',
    props: {
      parentRow: {
        type: Object,
        default: () => ({})
      },
      form: {
        type: Object,
        default: () => ({})
      },
      menuList: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formRules,
        props: {
          children: 'children',
          label: 'name',
          value: 'id',
          clearable: true,
          checkStrictly: true,
          lazy: true,
          lazyLoad: this.lazyChildren
        },
        menusList: [],
        filterMenuTypes: menuTypes,
        isAdmin: !!this.$route.query.admin // 是否管理员
      }
    },
    methods: {
      setMenuTypes() {
        if (this.$parent.parentRow['authTypeValue']) {
          this.filterMenuTypes = folderSubsets[this.$parent.parentRow['authTypeValue']]
        } else {
          this.filterMenuTypes = menuTypes
        }
        if (!this.filterMenuTypes.some(item => item.id === this.form.authType)) {
          this.form.authType = null
        }
      },
      handleOpen() {
        this.menusList = deepClone(this.menuList)
        // 清空重装数据
        if (this.form.id) {
          filterInvalidData(this.menusList, this.form.id)
        }
        this.setMenuTypes()
      },
      lazyChildren(node, resolve) {
        if (node.data) {
          this.$parent.fetchMenusList(node.data, resolve)
        }
      },
      handleCancel(type) { // true：成功 ｜ false：失败
        if (this.visible) {
          this.$emit('close', type)
        }
      },
      handleMenuChange() {
        this.$parent.parentRow = this.$refs.parentMenu.getCheckedNodes()[0].data || {}
        this.setMenuTypes()
      },
      handleSubmit() {
        /*  if (!this.form.parentIds.length) {
            this.$message.warning('请选择上级菜单')
            return false
          }*/
        this.$refs.form.validate(validate => {
          if (validate) {
            const { id, authType, code, name, parentIds, sortNum, remark, icons } = this.form
            const postData = filterEmptyParams({
              id, authType, code, name, sortNum, remark, icons,
              parentId: parentIds.slice(-1)[0]
            })
            this.$confirm(`确定要${id ? '编辑' : '添加'}${menuTypeMap[authType]}吗？`, '提示', {
              closeOnPressEscape: false,
              closeOnClickModal: false,
              showClose: false
            }).then(() => {
              // const promise = this.form.id ? updatePermission(postData) : addPermission(postData)
              // promise.then((res) => {
              //   if (res.code === 200) {
              //     this.$message.success(this.form.id ? `${menuTypeMap[authType]}修改成功` : `${menuTypeMap[authType]}添加成功`)
              //     this.$emit('close', true, res.result)
              //   }
              // })
              let fn = this.form.id ? updatePermission : addPermission
              fn(postData).then((res) => {
                if (res.code === 200) {
                  this.$message.success(this.form.id ? `${menuTypeMap[authType]}修改成功` : `${menuTypeMap[authType]}添加成功`)
                  this.$emit('close', true, res.result)
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-form {
    /deep/ .el-dialog {
      min-width: 500px;
      .el-dialog__body {
        padding: 20px;
      }
    }
    /deep/ .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
</style>
