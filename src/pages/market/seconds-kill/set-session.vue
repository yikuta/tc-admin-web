<template>
  <div class="app-container">
    <!-- 场次设置 -->
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="秒杀配置">
        <div v-for="(item, index) in form.sessionSettingList" :key="item.id" class="configureItem">
          <el-form-item :prop="'sessionSettingList.' + index + '.begin'" :rules="startTimeRuleForm">
            <el-time-picker
              v-model="item.begin"
              placeholder="选择开始时间"
              value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
          至
          <el-form-item :prop="'sessionSettingList.' + index + '.end'" :rules="endTimeRuleForm">
            <el-time-picker
              v-model="item.end"
              @change="endTimeChange(index)"
              placeholder="选择结束时间"
              value-format="HH:mm:ss">
            </el-time-picker>
          </el-form-item>
          <el-button v-if="form.sessionSettingList.length - 1 === index" type="primary" icon="el-icon-plus" circle @click="handleAddSession(index)"></el-button>
          <el-button v-if="form.sessionSettingList.length !== 1" type="danger" icon="el-icon-delete" circle @click="handleRemoveSession(index)"></el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="save" v-np="'SEC_KILL_SCENARIO_SAVE'">保存</el-button>
      <el-button type="default" size="mini" @click="cancel">取消</el-button>
    </div>
    <!-- <div style="margin-top:50px">
      <p>操作日志</p>
      <base-table :columns="dColumns" :list="tableData"></base-table>
    </div> -->
  </div>
</template>
<script>
import BaseTable from '@/components/BaseTable'
import { COLUMNS } from '../config'
import { reqGetSessions, reqSetSessions, reqCheckDeleteSession } from '@/api/seckill'
export default {
  name: 'set-session',
  components: { BaseTable },
  data() {
    return {
      form: {
        sessionSettingList: [{ begin: '', end: '' }]
      },
      startTimeRuleForm: [
        { required: true, message: '请选择时间', trigger: 'blur' }
      ],
      endTimeRuleForm: [
        { required: true, message: '请选择时间', trigger: 'blur' },
        { validator: this.rule() }
      ],
      changingSetting: 0,
      dColumns: COLUMNS,
      tableData: []
    }
  },
  mounted() {
    // 1
    this._reqGetSessions()
  },
  methods: {
    save() {
      // 保存
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form))
          this._reqSetSessions(data)
        }
      })
    },
    endTimeChange(index) {
      this.changingSetting = index
    },
    rule() {
      let _this = this
      return (rule, value, callback) => {
        let index = rule.fullField.split('.')[1]
        let date = '2020-07-07 '
        let start = date + _this.form.sessionSettingList[index].begin
        let end = date + value
        if (new Date(start).getTime() < new Date(end).getTime()) {
          callback()
        } else {
          callback(new Error('结束时间请大于开始时间时'))
        }
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    handleAddSession(index) {
      this.form.sessionSettingList.splice(index + 1, 0, { begin: '', end: '' })
    },
    handleRemoveSession(index) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._reqCheckDeleteSession(this.form.sessionSettingList[index], index)
      })
    },
    _reqGetSessions() {
      return reqGetSessions().then((res) => {
        if (res.code === 200) {
          let result = res.result || {}
          if (result.length) {
            this.form.sessionSettingList = result
          } else {
            this.form.sessionSettingList = [{ begin: '', end: '' }]
          }
        }
      })
    },
    _reqSetSessions(data) {
      return reqSetSessions(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this._reqGetSessions()
        }
      })
    },
    _reqCheckDeleteSession(data, index) {
      return reqCheckDeleteSession(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.form.sessionSettingList.splice(index, 1)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .configureItem {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  .search-btn {
    margin-top: 20px;
    text-align: center;
  }
</style>
