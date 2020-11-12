<template>
  <div class="wrapper">
    <content-area contentTitle="用户成长值设置" :titleStyle="false">
      <div class="content">
        <div class="level">
          <span style="margin-right:8px">开启/关闭用户等级</span>
          <el-switch
            v-model="form.enabledGrade"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </div>
        <div class="level-table">
          <p>等级设置<span class="tip">(注意：等级设置为实时操作，增加和减少等级操作会实时存储到数据库)</span></p>
          <div style="overflow:hidden">
            <el-table :data="tableData" style="width: 1000px;float:left">
              <el-table-column prop="num" label="编号" width="180" align="center">
                <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="等级名称" align="center">
                <template slot-scope="scope">
                  <el-input 
                    size="mini" 
                    v-model="scope.row.name" 
                    v-if="scope.row.isAdd" 
                    minlength='2'
                    maxlength="20"
                    :autofocus="true"
                    :ref="`level-${scope.$index}`"
                    @blur='e => handleNameBlur(e, `level-${scope.$index}`)'
                    style="width:100%"></el-input>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="min" label="最低成长值（>）" width="180" align="center">
                <template slot-scope="scope">
                  <el-input
                    :min='0' 
                    size="mini" 
                    v-model="scope.row.min" 
                    v-if="scope.row.isAdd" 
                    :ref="`level-min-${scope.$index}`"
                    @blur='e => handleCreditsBlur(e, scope.$index, "min")'
                    style="width:100px"></el-input>
                  <span v-else>{{scope.row.min}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="max" label="最高成长值（<=）" width="180" align="center">
                <template slot-scope="scope">
                  <el-input
                    :min='0' 
                    size="mini" 
                    v-model="scope.row.max" 
                    v-if="scope.row.isAdd" 
                    :ref="`level-max-${scope.$index}`"
                    @blur='e => handleCreditsBlur(e, scope.$index, "max")'
                    style="width:100px"></el-input>
                  <span v-else>{{scope.row.max}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button class="btnText" type="text" v-show="tableData.length>1"  @click="handleRemove(scope.row, scope.$index)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button 
              type="primary" 
              size="small" 
              style="float: left;margin-left: 10px" 
              :disabled="this.tableData.length >= 8" 
              @click="handleAdd">增加</el-button>
          </div>
        </div>
        <div class="other-setting">
          <p>其他设置</p>
          <div class="setting-checkList">
            <div class="setting-item">
              <el-checkbox v-model="form.register">
                注册成长值&nbsp;&nbsp;&nbsp;
              </el-checkbox>
              <el-input-number :disabled="!form.register" size="small" style="width: 150px" v-model="form.registerValue"></el-input-number>
            </div>
            <div class="setting-item">
              <el-checkbox v-model="form.everydayFirstLogin">
                每日首次登陆成长值&nbsp;&nbsp;&nbsp;
              </el-checkbox>
              <el-input-number :disabled="!form.everydayFirstLogin" size="small" style="width: 150px" v-model="form.everydayFirstLoginValue"></el-input-number>
            </div>
            <div class="setting-item">
              <el-checkbox label="下单成功" v-model="form.orderSuccee">
                下单成功<span style="margin-left:8px">获取成长值x；x=结算金额t（实付款）*加速系数n（加速系数：用户当前信誉等级/信誉等级数）</span>
              </el-checkbox>
            </div>
            <div class="setting-item">
              <el-checkbox label="退款，退货，收回获得的成长值" v-model="form.refund"></el-checkbox>
            </div>
          </div>
        </div>
        <div class="save-btn">
          <el-button type="primary" size="small" v-np='"MEMBER_GROWTH_VALUE_ADD"' @click="handleSave">保存</el-button>
        </div>
      </div>
    </content-area>
  </div>
</template>
<script>
import { Common } from './components'
import { fetchGrowthInfo, asyncMemberGraderecordAdd } from '@/api/user'
export default {
  name: 'creditSetting',
  components: { ...Common },
  data() {
    return {
      form: {
        register: true, // 注册成长值
        registerValue: '',
        everydayFirstLogin: true, // 每日登录成长值
        everydayFirstLoginValue: '',
        enabledGrade: true,
        orderSuccee: true, // 下单成功获取成长值
        refund: true // 启用退款退货

      },
      tableData: [
        {
          name: '青铜',
          min: 0,
          max: 100
        }
      ]
    }
  },
  mounted() {
    this.handleDetail()
  },
  methods: {
    handleRemove(row, index) {
      this.tableData.splice(index, 1)
    },
    handleAdd() {
      this.tableData.push({
        name: '',
        min: '',
        max: '',
        isAdd: true
      })
      // 获取当条第一个输入框的焦点
      this.$nextTick(() => {
        this.$refs[`level-${this.tableData.length - 1}`].focus()
      })
    },
    handleNameBlur(e, name) {
      if (e.target.validity.valid && e.target.value) {
        return
      } else {
        this.$refs[name].focus()
        if (e.relatedTarget) {
          return
        } else {
          this.$message.error('等级名称请输入2~20个字符')
        }
      }
    },
    handleCreditsBlur(e, index, prop) {
      let reg = /^[0-9]*$/
      if (prop === 'min') {
        if (!reg.test(e.target.value) || !e.target.value) {
          e.target.value = 0
        }
        if (e.target.value * 1 > this.$refs[`level-max-${index}`].value * 1) {
          if (this.$refs[`level-max-${index}`].value) {
            this.$message.error('最低积分不能大于最高积分')
          }
        }
      } else {
        if (!reg.test(e.target.value) || e.target.value === 0 || !e.target.value) {
          e.target.value = ''
        } else {
          if (e.target.value * 1 < this.$refs[`level-min-${index}`].value * 1) {
            this.$message.error('最低积分不能大于最高积分')
          }
        }
      }
    },
    handleSave() {
      let flag1 = false
      let count = 0
      for (let i = 0; i < this.tableData.length; i++) {
        flag1 = this.tableData.some((item, index) => {
          if (index !== i && item.isAdd) {
            count = index
            return Math.max.apply(null, [item.min, this.tableData[i].min]) <= Math.min.apply(null, [item.max || Number.POSITIVE_INFINITY, this.tableData[i].max || Number.POSITIVE_INFINITY])
          }
        })
        if (flag1) {
          this.$message.error('新增用户等级出现区间覆盖，请调整')
          this.$refs[`level-min-${count}`].focus()
          return
        }
      }
      if (!flag1) {
        let obj = {
          enabledGrade: this.form.enabledGrade ? '1' : '0',
          everydayFirstLogin: this.form.everydayFirstLogin ? '1' : '0',
          everydayFirstLoginValue: this.form.everydayFirstLogin ? this.form.everydayFirstLoginValue : 0,
          memberGradeDtos: this.tableData.map(item => {
            return {
              gradeName: item.name,
              max: item.max,
              min: item.min
            }
          }),
          orderSuccee: this.form.orderSuccee ? '1' : '0',
          refund: this.form.refund ? '1' : '0',
          register: this.form.register ? '1' : '0',
          registerValue: this.form.register ? this.form.registerValue : 0
        }
        asyncMemberGraderecordAdd(obj).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.handleDetail()
          }
        })
      }
    },
    handleDetail() {
      fetchGrowthInfo().then(res => {
        if (res.code === 200) {
          this.tableData = res.result.memberGradeDtos.map(item => {
            return {
              name: item.gradeName,
              min: item.min,
              max: item.max
            }
          })
          Object.keys(this.form).forEach(key => {
            if (key === 'enabledGrade' || key === 'everydayFirstLogin' || key === 'enabledGrade' || key === 'orderSuccee' || key === 'refund' || key === 'register') {
              this.form[key] = res.result[key] === '1'
            } else {
              this.form[key] = res.result[key]
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.level-table{
  margin-top: 40px;
  .tip{
    color: #AAAAAA;
    margin-left: 8px;
  }
}
.setting-checkList .setting-item{
  line-height: 40px;
}
.save-btn{
  margin-top: 20px;
  text-align: center;
  button{
    width: 108px;
  }
}
</style>