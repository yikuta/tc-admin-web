<template>
  <el-dialog
    class="dialog-wrap"
    title="绑定打印机"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
    @open="handleOpen"
  >
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="110px" size="small">
      <div class="search-form" v-if="!isEdit">
        <el-form-item label="门店编码" prop="shopCode" label-width="70px">
          <el-input v-model="form['searchShopCode']" placeholder="请输入查询门店编号"></el-input>
          <el-button type="primary" size="mini" @click="handleSearchShop">查 询</el-button>
        </el-form-item>
      </div>
      <div class="shop-info" v-if="isEdit || form.shopCode">
        <el-form-item label="门店编码">
          <el-input disabled v-model="form.shopCode" placeholder="请输入门店编码"></el-input>
        </el-form-item>

        <el-form-item label="门店名称">
          <el-input disabled v-model="form.name" placeholder="请输入门店名称"></el-input>
        </el-form-item>

        <el-form-item label="门店地址">
          <el-input disabled v-model="form.address" placeholder="请输入查询门店编号"></el-input>
        </el-form-item>

        <el-form-item label="打印机品牌" prop="terminalName">
          <el-select v-model="form.terminalName" placeholder="请选择打印机品牌">
            <el-option v-for="item in printerBrands" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印机类型" prop="terminalType">
          <el-select v-model="form.terminalType" placeholder="请选择打印机类型">
            <el-option v-for="item in printerTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="打印机终端号" prop="terminalNum">
          <el-input v-model="form.terminalNum" placeholder="请输入打印机终端号"></el-input>
        </el-form-item>

        <el-form-item label="打印机密钥" prop="terminalPassword">
          <el-input v-model="form.terminalPassword" placeholder="请输入打印机密钥"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!form.shopCode" size="small" @click="handleConfirm">确 认</el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { reqShopList, bindTerminal } from '@/api/seller'
  import searchFormat from '@/utils/searchFormat'
  const printerBrands = [{
    value: '易联云',
    label: '易联云'
  }]
  const printerTypes = [{
    value: 'k4 wifi版',
    label: 'k4 wifi版'
  }]
  const rules = {
    terminalName: [{ required: true, message: '请选择打印机品牌', trigger: 'blur' }],
    terminalType: [{ required: true, message: '请选择打印机类型', trigger: 'blur' }],
    terminalNum: [{ required: true, message: '请输入打印机终端号', trigger: 'blur' }],
    terminalPassword: [{ required: true, message: '请输入打印机密钥', trigger: 'blur' }]
  }
  export default {
    name: 'BindPrinter',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      form: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        printerBrands,
        printerTypes,
        rules,
        isEdit: false
      }
    },
    methods: {
      handleClose() {
        this.$emit('close', 'fail')
      },
      handleOpen() {
        this.isEdit = Boolean(this.$parent.dialogForm.shopCode)
      },
      handleConfirm() {
        this.$refs.form.validate(validate => {
          if (validate) {
            const { shopCode, terminalName, terminalType, terminalNum, terminalPassword } = this.form
            bindTerminal({
              shopCode, terminalName, terminalType, terminalNum, terminalPassword
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit('close', 'success')
              }
            })
          }
        })
      },
      handleSearchShop() {
        if (this.form['searchShopCode']) {
          reqShopList({
            pageNo: 1,
            pageSize: 20,
            searchs: JSON.stringify(searchFormat({
              shopCode: { value: this.form.searchShopCode, name: 'shopCode', matchType: 'EQUAL', type: 'STRING' }
            }))
          }).then(res => {
            if (res.code === 200) {
              if (res.result.itemVOs[0]) {
                const { shopCode, name, address } = res.result.itemVOs[0]
                this.form.name = name
                this.form.shopCode = shopCode
                this.form.address = address
              } else {
                this.$message.error('没查询到对应编号门店')
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .dialog-wrap {
    /deep/ .el-dialog__body {
      padding: 10px 25px 0 20px;
    }
    /deep/ .el-select.el-select--small {
      width: 100%;
    }
  }
  .search-form {
    .el-input {
      width: 310px
    }
    .el-button--mini {
      display: inline-block;
      margin-left: 10px;
    }
  }
</style>
