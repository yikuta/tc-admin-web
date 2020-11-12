<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="100px" inline size="mini">
      <!--<el-form-item label="门店所属业务" prop="reason">
        <el-radio-group v-model="form.businessType" size="medium">
          <el-radio v-for="item in businessTypes" :key="item.value" :label="item.label" :value="item.value"></el-radio>
        </el-radio-group>
      </el-form-item>-->
      <div style="color: red">审核通过后，此门店只能绑定{{legalPersonName}} 的银行卡</div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'AuditPass',
    props: {
      legalPersonName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {
          businessType: '净菜'
        },
        businessTypes: [
          { value: '净菜', label: '净菜' }
          // { value: '社区超市', label: '社区超市' }
        ]
      }
    },
    methods: {}
  }
</script>
<style lang='scss' scoped></style>
