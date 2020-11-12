<template>
  <div class="wrapper">
    <content-area
      contentTitle="用户标签设置"
      :titleStyle="false"
    >
      <div class="content">
        <div class="level">
          <span style="margin-right:8px">启用用户标签功能</span>
          <el-switch
            v-model="form.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
          <div class="btn-group">
            <el-checkbox
              label="use"
              v-model="form.isAllEnabled"
              @change="val => handleCheckAll('1', val)"
            >全部启用</el-checkbox>
            <el-checkbox
              label="show"
              v-model="form.isAllShow"
              @change="val => handleCheckAll('2', val)"
            >全部展示</el-checkbox>
          </div>
        </div>
        <div class="tag-item">
          <p class="tag-name">人口属性标签</p>
          <el-row class="item">
            <el-col :span="6">
              <el-checkbox
                v-model='firstList[0].checked'
                :label="firstList[0].value"
              >{{firstList[0].label}}</el-checkbox>
              <!-- <el-checkbox v-model='secondList[0]' :label="secondList[0]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
            <el-col :span="18">
              <el-checkbox
                v-model='firstList[1].checked'
                :label="firstList[1].value"
              >{{firstList[1].label}}</el-checkbox>
              <!-- <el-checkbox v-model='secondList[1]' :label="secondList[1]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
          <el-row class="item">
            <!-- <el-col :span="6">
              <el-checkbox
                v-model='firstList[2].checked'
                :label="firstList[2].value"
              >{{firstList[2].label}}</el-checkbox>
              <el-checkbox v-model='secondList[2]' :label="secondList[2]"  class="second">列表/详情展示</el-checkbox>
            </el-col> -->
            <el-col :span="6">
              <el-checkbox
                v-model='firstList[3].checked'
                :label="firstList[3].value"
              >{{firstList[3].label}}</el-checkbox>
              <!-- <el-checkbox v-model='secondList[3]' :label="secondList[3]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
            <el-col :span="12">
              <el-checkbox
                v-model='firstList[4].checked'
                :label="firstList[4].value"
              >{{firstList[4].label}}</el-checkbox>
              <!-- <el-checkbox v-model='secondList[4]' :label="secondList[4]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[5].checked'
                :label="firstList[5].value"
              >{{firstList[5].label}}</el-checkbox>
              <!-- <el-checkbox v-model='secondList[5]' :label="secondList[5]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
        </div>
        <div class="tag-item">
          <p class="tag-name">模型标签</p>
          <!-- <el-row class="item">
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[6].checked'
                :label="firstList[6].value"
              >
                <span style="margin-right: 5px">{{firstList[6].label}}</span>
              </el-checkbox>
              消费周期 <el-input-number
                :disabled="!firstList[6].checked"
                :min='1'
                :max="365"
                v-model="firstList[6].other"
                size='mini'
                style='width:200px'
              ></el-input-number> 天
              <el-checkbox v-model='secondList[6]' :label="secondList[6]"  class="second">列表/详情展示</el-checkbox>
            </el-col>
          </el-row> -->
          <el-row class="item">
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[7].checked'
                :label="firstList[7].value"
              >
                <span style="margin-right: 5px">{{firstList[7].label}}</span>
              </el-checkbox>
              消费周期 <el-input-number
                :disabled="!firstList[7].checked"
                :min='1'
                :max="365"
                v-model="form.rfmDay"
                size='mini'
                style='width:200px'
              ></el-input-number> 天
              <!-- <el-checkbox v-model='secondList[7]' :label="secondList[7]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
        </div>
        <div class="tag-item">
          <p class="tag-name">消费属性标签</p>
          <el-row class="item">
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[8].checked'
                :label="firstList[8].value"
              >
                <span style="margin-right: 5px">{{firstList[8].label}}</span>
              </el-checkbox>
              过去 <el-input-number
                :disabled="!firstList[8].checked"
                :min='1'
                :max="12"
                v-model="form.sceneDay"
                size='mini'
                style='width:200px'
              ></el-input-number> 个月订单
              <!-- <el-checkbox v-model='secondList[8]' :label="secondList[8]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[9].checked'
                :label="firstList[9].value"
              >
                <span style="margin-right: 5px">{{firstList[9].label}}</span>
              </el-checkbox>
              过去 <el-input-number
                :disabled="!firstList[9].checked"
                :min='1'
                :max="12"
                v-model="form.chineseZodiacDay"
                size='mini'
                style='width:200px'
              ></el-input-number> 个月订单
              <span style="margin-left:20px">
                高于 <el-input-number
                  :min='0.01'
                  :max="9999.99"
                  :disabled="!firstList[9].checked"
                  v-model="form.max"
                  size='mini'
                  style='width:160px'
                ></el-input-number>
                低于 <el-input-number
                  :min='0.01'
                  :max="9999.99"
                  :disabled="!firstList[9].checked"
                  v-model="form.min"
                  size='mini'
                  style='width:160px'
                ></el-input-number>
              </span>
              <!-- <el-checkbox v-model='secondList[9]' :label="secondList[9]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
        </div>
        <div class="tag-item">
          <p class="tag-name">交易属性标签</p>
          <el-row class="item">
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[10].checked'
                :label="firstList[10].value"
              >
                <span style="margin-right: 5px">{{firstList[10].label}}</span>
              </el-checkbox>
              过去 <el-input-number
                :disabled="!firstList[10].checked"
                :min='1'
                :max="12"
                v-model="form.transactionChannelDay"
                size='mini'
                style='width:200px'
              ></el-input-number> 个月订单
              <!-- <el-checkbox v-model='secondList[10]' :label="secondList[10]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
            <el-col :span="24">
              <el-checkbox
                v-model='firstList[11].checked'
                :label="firstList[11].value"
              >
                <span style="margin-right: 5px">{{firstList[11].label}}</span>
              </el-checkbox>
              过去 <el-input-number
                :min='1'
                :max="12"
                :disabled="!firstList[11].checked"
                v-model="form.payChannelDay"
                size='mini'
                style='width:200px'
              ></el-input-number> 个月订单
              <!-- <el-checkbox v-model='secondList[11]' :label="secondList[11]"  class="second">列表/详情展示</el-checkbox> -->
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          :loading="loading1"
          v-np='"MEMBER_LABEL_SETTINGS_ADD"'
          @click="handleSaveAndUpdate"
        >保存并执行更新</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="loading2"
          v-np="'MEMBER_LABEL_SETTINGS_UPDATE'"
          @click="handleSaveBtn"
        >保 存</el-button>
      </div>
    </content-area>
  </div>
</template>
<script>
import { Common } from './components'
import { fetchUserLabesSetting, asyncLabelSettingAdd } from '@/api/user'
export default {
  name: 'tagSetting',
  components: { ...Common },
  data() {
    return {
      form: {
        enable: false,
        rfmDay: 0, // frm消费周期
        sceneDay: 0,
        chineseZodiacDay: 0,
        min: 0,
        max: 0,
        transactionChannelDay: 0,
        payChannelDay: 0,
        isAllEnabled: false, // 是否全部显示
        isAllShow: false // 是否全部展示
      },
      firstList: [
        {
          label: '性别（男，女，无）',
          value: 'sex',
          checked: false
        },
        {
          label: '年龄 50后，60后，70后，80后，90后，00后，10后，20后',
          value: 'age',
          checked: false
        },
        {
          label: '生日标签（*年*月*日）',
          value: 'birth',
          checked: false
        },
        {
          label: '生肖 12生肖',
          value: 'chineseZodiac',
          checked: false
        },
        {
          label: '星座 12星座',
          value: 'constellation',
          checked: false
        },
        {
          label: '地区标签（城市）',
          value: 'area',
          checked: false
        },
        {
          label: '启用用户忠诚度模型',
          value: 'memberLoyalty',
          checked: false
        },
        {
          label: '启用RFM模型',
          value: 'rfm',
          checked: false
        },
        {
          label: '场景偏好（自提，配送，快递）',
          value: 'scene',
          checked: false
        },
        {
          label: '平均订单价值（高、中、低）',
          value: 'customerPrice',
          checked: false
        },
        {
          label: '交易渠道（天呈生活小程序，天呈净菜小程序，app）',
          value: 'payChannel',
          checked: false
        },
        {
          label: '支付渠道（银联、支付宝、微信）',
          value: 'transactionChannel',
          checked: false
        }
      ],
      loading1: false,
      loading2: false
      // secondList: new Array(12).fill(false)
    }
  },
  mounted() {
    this.handleInit()
  },
  methods: {
    handleInit() {
      fetchUserLabesSetting().then(res => {
        if (res.code === 200) {
          Object.keys(res.result).forEach(key => {
            this.firstList.map(item => {
              if (item.value === key) {
                item.checked = res.result[key] === null ? false : res.result[key]
              }
            })
          })
          Object.keys(this.form).forEach(key => {
            if (key === 'rfmDay' || key === 'sceneDay' || key === 'chineseZodiacDay' || key === 'min' || key === 'max' || key === 'transactionChannelDay' || key === 'payChannelDay') {
              this.form[key] = res.result[key] === null ? 0 : res.result[key]
            } else {
              this.form[key] = res.result[key] === null ? false : res.result[key]
            }
          })
        }
      })
    },
    handleCheckAll(type, value) {
      if (type === '1') {
        this.firstList.forEach(item => {
          item.checked = value
        })
      }
      // else {
      //   this.secondList = new Array(12).fill(value)
      // }
    },
    handleSaveAndUpdate() {
      this.$confirm('保存后会立即执行更新标签，确认要执行吗？', '提示', {}).then(() => {
        this.handleSave(true)
      })
    },
    handleSaveBtn() {
      this.$confirm('保存后会在周期结束后执行标签更新，确认要保存吗？', '提示', {}).then(() => {
        this.handleSave(false)
      })
    },
    handleSave(executeAndSave) {
      let obj = {}
      this.firstList.map(item => {
        obj[item.value] = item.checked
      })
      if (executeAndSave) {
        this.loading1 = true
      } else {
        this.loading2 = true
      }
      asyncLabelSettingAdd({
        ...this.form,
        ...obj,
        executeAndSave
      }).then(res => {
        if (executeAndSave) {
          this.loading1 = false
        } else {
          this.loading2 = false
        }
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      }).catch(() => {
        if (executeAndSave) {
          this.loading1 = false
        } else {
          this.loading2 = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-group {
  margin-top: 20px;
}
.level {
  margin-bottom: 50px;
}
.tag-item {
  .tag-name {
    font-size: 16px;
  }
  .item {
    .el-checkbox {
      // display: block;
      margin-bottom: 10px;
    }
    .second {
      margin-left: 25px;
    }
  }
}
.btns {
  margin-top: 50px;
  text-align: right;
  button {
    min-width: 108px;
  }
}
</style>