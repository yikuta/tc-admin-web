<template>
  <div class="app-container">
    <el-admin-table
      :tableAttrs="tableAttrs"
      :formData.sync="formData"
      :apiFn="apiFn"
      @reset="reset"
      :customQuery="customQuery"
      ref="tableRef"
    >
      <div slot="search">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="name" label-width="80px" label="团长姓名">
              <el-input v-model="form.name.value" size="small" placeholder="团长姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="phoneNumber" label="团长手机号" label-width="100px">
              <el-input
                v-model="form.phoneNumber.value"
                size="small"
                maxlength="11"
                placeholder="团长手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="BD" label="BD" label-width="50px">
              <el-input
                v-model="form.BD.value"
                size="small"
                maxlength="11"
                placeholder="BD"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="name" label="审核状态" label-width="80px">
              <el-select
                v-model="form.regimentalAuditType.value"
                placeholder="请选择"
                size="small"
                clearable
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in reviewStatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="name" label-width="80px" label="入住城市">
              <search-area
                width="120px"
                :provinceId.sync="form.provinceCode.value"
                :cityId.sync="form.cityCode.value"
                :districtId.sync="form.districtCode.value"
                ref="searchArea"
              ></search-area>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="locationName" label="自提点名称" label-width="100px">
              <el-input
                v-model="form.locationName.value"
                size="small"
                placeholder="自提点名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="time" label="申请时间" label-width="80px">
              <el-date-picker
                v-model="form.createTime.value"
                align="center"
                type="daterange"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="{ disabledDate (time) { return time.getTime() - 1 >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() + 86400000 - 1 }}"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-admin-table>
    <el-dialog title="变更BD" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <p>当前绑定：{{oldInfo.employee}}（{{oldInfo.employeePhone}}）</p>
      <p>变更BD人员：</p>
      <el-select
        v-model="selectedId"
        filterable
        clearable
        remote
        style="width:100%"
        reserve-keyword
        placeholder="请输入"
        :remote-method="remoteMethod"
        :loading="loading"
        ref='select'>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.fullName"
          :value="item.id">
          <span>{{ item.fullName }} ({{item.phone}})</span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmChange" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ElAdminTable from '@/components/ElAdminTable/index.vue'
import SearchArea from '@/components/SearchArea/index.vue'
import { format } from '@/filters'
import { REVIEW_STATUS_LIST, REVIEW_STATUS } from './config'
import {
  fetchLeaderList,
  asyncRegimentalLocationConcealUpdate,
  regimental_findUsers_api,
  updateAuditRegimental_api
} from '@/api/leader'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
export default {
  components: {
    ElAdminTable,
    SearchArea
  },
  data() {
    return {
      customQuery: { orderby: 'createTime', sort: 'desc' },
      apiFn: fetchLeaderList,
      form: {
        name: {
          value: '',
          name: 'name',
          matchType: MatchType.CONTAIN,
          type: DataType.STRING
        },
        regimentalAuditType: {
          value: '',
          name: 'regimentalAuditType',
          matchType: MatchType.EQUAL,
          type: DataType.OBJECT
        },
        locationName: {
          value: '',
          name: 'regimentalLocation.locationName',
          matchType: MatchType.CONTAIN,
          type: DataType.STRING
        },
        phoneNumber: {
          value: '',
          name: 'phoneNumber',
          matchType: MatchType.EQUAL,
          type: DataType.STRING
        },
        BD: {
          value: '',
          name: 'bd',
          matchType: MatchType.CONTAIN,
          type: DataType.STRING
        },
        provinceCode: {
          value: '',
          name: 'regimentalLocation.provinceCode',
          matchType: MatchType.EQUAL,
          type: DataType.STRING
        },
        cityCode: {
          value: '',
          name: 'regimentalLocation.cityCode',
          matchType: MatchType.EQUAL,
          type: DataType.LONG
        },
        districtCode: {
          value: '',
          name: 'regimentalLocation.districtCode',
          matchType: MatchType.EQUAL,
          type: DataType.LONG
        },
        createTime: {
          value: [],
          name: 'createTime',
          matchType: MatchType.BETWEEN,
          type: DataType.DATE
        }
      },
      tableAttrs: {
        columns: [
          {
            type: 'index'
          },
          {
            prop: 'name',
            label: '团长姓名'
          },
          {
            prop: 'phoneNumber',
            label: '团长手机号'
          },
          {
            prop: 'locationHead',
            label: '自提点门头照',
            render: (h, row) =>
              h('el-image', {
                attrs: {
                  style: 'width:50%',
                  class: 'header',
                  src: row.locationHead.fullPath || ''
                },
                props: {
                  'preview-src-list': [row.locationHead.fullPath || '']
                }
              })
          },
          {
            prop: 'locationName',
            label: '自提点名称'
          },
          {
            prop: 'location',
            label: '自提点地址'
          },
          {
            prop: 'createTime',
            label: '申请时间',
            formatter: row =>
              format(row.createTime, 'yyyy-MM-dd HH:mm:ss') || '-'
          },
          {
            prop: 'employee',
            label: 'BD',
            formatter: row => row.employee + '(' + row.employeePhone + ')'
          },
          {
            prop: 'name',
            label: '审核状态',
            formatter: ({ regimentalAuditType }) => regimentalAuditType.describe
          },
          {
            type: 'operation',
            btns: [
              {
                text: '隐藏',
                permission: 'GPR_APPLY_VISIBLE_CHANGE',
                atClick: row => this.toggle(row),
                show: ({ regimentalAuditType: { value }, isConceal }) =>
                  value === REVIEW_STATUS.pass && !isConceal
              },
              {
                text: '取消隐藏',
                permission: 'GPR_APPLY_VISIBLE_CHANGE',
                atClick: row => this.toggle(row),
                show: ({ regimentalAuditType: { value }, isConceal }) =>
                  value === REVIEW_STATUS.pass && isConceal
              },
              {
                text: '查看详情',
                permission: 'GPR_APPLY_DETAIL_CHK',
                // eslint-disable-next-line object-curly-spacing
                atClick: ({ id, regimentalAuditType: { value }}) =>
                  this.goDetail(id, value),
                // eslint-disable-next-line object-curly-spacing
                show: ({ regimentalAuditType: { value }}) =>
                  value !== REVIEW_STATUS.wait
              },
              {
                text: '去处理',
                permission: 'GPR_APPLY_AUDIT_DEAL',
                // eslint-disable-next-line object-curly-spacing
                atClick: ({ id, regimentalAuditType: { value }}) =>
                  this.goDetail(id, value),
                // eslint-disable-next-line object-curly-spacing
                show: ({ regimentalAuditType: { value }}) =>
                  value === REVIEW_STATUS.wait
              },
              {
                text: '变更BD',
                // permission: 'GPR_APPLY_AUDIT_DEAL',
                atClick: ({ id, employee, employeePhone }) => {
                  this.id = id
                  this.oldInfo = {
                    employee,
                    employeePhone
                  }
                  this.dialogVisible = true
                },
                // eslint-disable-next-line object-curly-spacing
                show: ({ regimentalAuditType: { value }}) =>
                  value !== REVIEW_STATUS.wait
              }
            ]
          }
        ]
      },
      formData: {},
      reviewStatus: REVIEW_STATUS_LIST,
      dialogVisible: false,
      loading: false,
      btnLoading: false,
      options: [],
      selectedId: '',
      id: '',
      oldInfo: {}
    }
  },
  watch: {
    form: {
      handler() {
        this.formData = { searchs: JSON.stringify(searchTool(this.form)) }
      },
      deep: true
    }
  },
  created() {
    this.formData = { searchs: JSON.stringify(searchTool(this.form)) }
  },
  methods: {
    reset() {
      for (let i in this.form) {
        this.form[i].value = ''
      }
      this.$refs.searchArea.reset()
    },
    goDetail(id, status) {
      this.$router.push({
        name: 'reviewManageDetail',
        query: {
          id,
          status
        }
      })
    },
    toggle(row) {
      this.$confirm(
        !row.isConceal
          ? '隐藏后用户端将不显示该团长的自提点？'
          : '取消隐藏后用户端将正常显示该团长的自提点？',
        '提示',
        {}
      ).then(() => {
        asyncRegimentalLocationConcealUpdate({
          regimentalId: row.id,
          isConceal: !row.isConceal
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('设置成功')
            row.isConceal = !row.isConceal
          }
        })
      })
    },
    handleClose() {
      this.selectedId = ''
      this.dialogVisible = false
    },
    remoteMethod(query) {
      if (query !== '') {
        this.handleUsersList(query)
      }
    },
    handleUsersList(query) {
      this.loading = true
      regimental_findUsers_api(query).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.options = res.result
        } else {
          this.options = []
        }
      }).catch(() => {
        this.loading = false
      })
    },
    confirmChange() {
      let info = this.options.filter(item => item.id === this.selectedId) || []
      if (info.length) {
        this.btnLoading = true
        updateAuditRegimental_api({
          employee: info[0].fullName,
          employeePhone: info[0].phone,
          id: this.id
        }).then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.handleClose()
            this.$message.success('BD变更成功')
            if (this.$refs.tableRef) {
              this.$refs.tableRef.getList()
            }
          }
        }).catch(() => {
          this.btnLoading = false
        })
      }
    }
  }
}
</script>

<style>
</style>
