<template>
  <div class="app-container">
    <el-row class="cmp-title">
      <el-col :span="6">
        <el-input placeholder="请输入专题名称" v-model="form.name" size="mini" :maxLength="20" />
      </el-col>
      <el-col :span="18">
        <el-button v-np="'CHANNEL_DECORATION_DRAFT_SAVE'" type="default" size="mini" @click="handleCache(1)" v-if="routeConfig.type === 'SPECIAL'">存草稿</el-button>

        <el-popover
          v-if="form.status !== 'PUSHING'"
          placement="bottom"
          width="400"
          trigger="click">
          <div>
            <el-date-picker v-model="pushTime" type="datetime" placeholder="选择日期时间" size="mini" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" @click="handleTime" size="mini">确定</el-button>
          </div>
          <el-button v-np="'CHANNEL_DECORATION_CONTENT_T_RELEASE'" type="default" size="mini" slot="reference">定时发布</el-button>
        </el-popover>
        <el-button v-np="'CHANNEL_DECORATION_CONTENT_RELEASE'" type="primary" size="mini" @click="handleSubmit(3)" v-if="routeConfig.type === 'SPECIAL'">发布</el-button>
        <el-button v-np="'HOMEPAGE_CONTENT_RELEASE'" type="primary" size="mini" @click="handleSubmit(3)" v-if="routeConfig.type === 'INDEX'">发布</el-button>
      </el-col>
    </el-row>
    <div class="cmp-box">
      <div>
        <cmp-list @success="handleSelect" :configType="routeConfig.type"></cmp-list>
      </div>
      <div>
        <cmp-view :module.sync="moduleList" :activeIndex.sync="activeIndex" @change="handleChange" ref="cmpView" :configType="routeConfig.type"></cmp-view>
      </div>
        <div>
          <cmp-form :config="moduleList[activeIndex]" ref="cmpForm" :configType="routeConfig.type"></cmp-form>
        </div>
    </div>
  </div>
</template>

<script>
  import config, { disableComponents } from '@/components/module/config'
  import CmpList from '@/components/module/cmp-list'
  import CmpForm from '@/components/module/form'
  import CmpView from '@/components/module/view'
  import { saveConfig, getConfigDetail } from '@/api/cms'
  import Validate from '@/components/module/validate'
  import { formatDate } from '@/utils/date'
  /*
  * 保存对象信息
  * id 主键
  * name 名称
  * renovationCode 编码
  * renovationDetailList 列表
  * renovationType 类型
  *   INDEX 首页
  *   SPECIAL 专题
  * status 状态
  *   DISABLE 已作废
  *   UNUSED 已禁用
  *   PUSHING 发布中
  *   WAIT_PUSH 等待发布
  * */
  export default {
    name: 'CmsForm',
    components: {
      CmpList,
      CmpForm,
      CmpView
    },
    data() {
      return {
        form: { // 原始对象
          name: '',
          renovationCode: '', // 编码
          renovationDetailList: [], // 列表
          renovationType: 'SPECIAL', // 当前的类型
          status: '' // 状态
        },
        moduleConfigList: config, // 组件基础配置信息
        moduleList: [], // 已选组件的列表
        moduleTotal: {}, // 组件数量统计
        activeIndex: 0, // 当前选中的逐渐
        routeConfig: {
          id: 0,
          type: 'INDEX',
          opt: 'edit'
        },
        pushTime: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() <= Date.now() - 3600 * 1000 * 24
          },
          selectableRange: `${formatDate(new Date(), 'hh:mm:ss')} - 23:59:59`
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        const route = this.$route
        if (route.query) {
          this.routeConfig = {
            id: route.query.id || null, // 编辑的时候存在id
            type: route.query.type || 'INDEX', // 页面的类型
            opt: route.query.opt || 'edit' // 当前操作
          }
        }
        if (this.routeConfig.id) {
          // 如果有 id
          this.getDetail()
        }
      },
      getDetail() {
        // 获取模块详情
        getConfigDetail({
          configId: this.routeConfig.id
        }).then(res => {
          // 如果是编辑，需要保存配置 id
          if (this.routeConfig.opt === 'edit') {
            this.form.id = this.routeConfig.id
          }
          // 设置数据
          this.form = {
            ...this.form,
            name: this.routeConfig.opt === 'copy' ? '' : res.result.name,
            renovationCode: res.result.renovationCode,
            renovationDetailList: res.result.details || [],
            renovationType: res.result.renovationType,
            status: res.result.status
          }
          this.moduleList = res.result.details || []
          // 设置组件数量统计
          this.moduleList.forEach(item => {
            this.moduleTotal[item.enName] = this.moduleTotal[item.enName] ? ++this.moduleTotal[item.enName] : 1
          })
          // 校验当前路由参数和返回参数是否一致，如果不一致就报错，防止后台 bug 导致的修改出错
          if (this.routeConfig.type !== res.result.renovationType) {
            this.$confirm('当前数据和后台返回数据不一致，请确认操作正常，如果一直出现此提示，请联系管理人员？', '警告', {
              showClose: false,
              showCancelButton: false
            }).then(() => {
              if (this.routeConfig.type === 'INDEX') {
                this.$router.push('/cms/index')
              } else {
                this.$router.push('/cms/special')
              }
            })
          }
        })
      },
      handleSelect(item) {
        // 添加一个模块
        // 判断自身最多可以出现的数量
        // 判断是否与其它模块只能出现其中一个
        if (item.systemConfig.num === this.moduleTotal[item.enName]) {
          // 如果相等，则表示已经满了
          // 单独处理商品列表和门店列表
          if (item.enName === 'ppvShop' || item.enName === 'goodsList') {
            this.$message.warning(`已经添加了${item.name}，不能重复添加`)
          } else {
            this.$message.warning(`${item.name}组件可添加数量为：${item.systemConfig.num}，当前已存在数量：${this.moduleTotal[item.enName]}`)
          }
          return
        }
        // 判断是否和其他组件不能同时出现
        let hasRelated = []
        this.moduleList.forEach(item2 => {
          if (item2.systemConfig.related.includes(item.enName)) {
            hasRelated.push(item2)
          }
        })
        if (hasRelated.length) {
          this.$message.warning(`页面中已经添加了${hasRelated[0].name}，不能同时添加${item.name}`)
          return
        }
        // 设置组件当前数量
        this.moduleTotal[item.enName] = this.moduleTotal[item.enName] ? ++this.moduleTotal[item.enName] : 1
        // 将数据插入进去
        if (item.systemConfig.push === 'start') {
          this.moduleList.unshift(item)
          if (this.moduleList.length > 1) {
            ++this.activeIndex
          }
        } else {
          this.moduleList.push(item)
        }
      },
      handleChange(item) {
        // 数组发生了变化
        this.moduleTotal[item.enName] = this.moduleTotal[item.enName] - 1
      },
      handleCache(type) {
        // 存草稿
        this.$prompt('保存后不会更新线上专题，将生成一个新的专题，请输入专题名称', '提示', {
          inputPattern: /\S/,
          inputErrorMessage: '名称不能为空'
        }).then(({ value }) => {
          this.form.name = value
          this.handleSubmit(type)
        })
      },
      handleSubmit(type) {
        if (type === 1) {
          // 存草稿
          this.form.status = 'WAIT_PUSH'
        } else if (type === 2) {
          // 定时发布
          if (!this.pushTime) {
            return
          }
          this.form.status = 'WAIT_PUSH'
          this.form.pushTime = this.pushTime
        } else {
          this.form.status = 'PUSHING'
        }
        // 基础信息校验
        if (!this.form.name) {
          this.$message.error('请输入模板名称')
          return
        }
        if (!/^[\u4e00-\u9fa5-a-zA-Z0-9]+$/.test(this.form.name)) {
          this.$message.error('模板名称仅能输入中文、数字、字母、下划线')
          return
        }
        if (!this.moduleList.length) {
          this.$message.error('最少请选择一个模块')
          return
        }
        // 在这里对组件进行验证并跳转到没有通过的地方
        const validateFn = new Validate()
        let flag = true
        // 验证当前页面为首页组件配置的时候，是否有禁用组件
        const cmp = disableComponents.filter(o => o.id === Number(this.form.id))
        if (this.routeConfig.type === 'INDEX') {
          // 判断是否匹配到了数据，如果没有匹配到，则表明数据已经被篡改，禁止进行任何操作
          if (!cmp.length) {
            this.$confirm('当前数据已经被篡改，是否返回列表页重新进行选择？', '警告', {
              showClose: false,
              showCancelButton: false
            }).then(() => {
              this.$router.push('/cms/index')
            })
            return
          }
          for (let i = 0; i < this.moduleList.length; i++) {
            if (cmp[0].disabled.includes(this.moduleList[i].enName)) {
              // 如果禁用里面有这个组件，直接返回 false
              this.activeIndex = i
              this.$message.error(`组件<${this.moduleList[i].name}>在当前页面不可用，请删除！`)
              console.error(`组件<${this.moduleList[i].name}>在当前页面不可用！`) // eslint-disable-line
              flag = false
              break
            }
          }
        } else {
          // 如果是专题，则是否在修改首页的内容，防止非法人员搞事儿
          if (cmp.length) {
            this.$confirm('当前数据已经被篡改，是否返回列表页重新进行选择？', '警告', {
              showClose: false,
              showCancelButton: false
            }).then(() => {
              this.$router.push('/cms/special')
            })
            return
          }
        }
        if (!flag) return
        // 校验表单是否有未填项
        for (let i = 0; i < this.moduleList.length; i++) {
          if (!validateFn[this.moduleList[i].enName](this.moduleList[i])) {
            this.activeIndex = i
            this.$message.error(`请注意检查组件 ${this.moduleList[i].name} 是否有未填或未选项!`)
            flag = false
            break
          }
        }
        if (flag) {
          // 增加拦截器，防止当 type 为 index 的时候新建了一个首页的 bug，或者通过没有类型跳过去
          if ((this.routeConfig.type === 'INDEX' && !this.form.id) || !this.routeConfig.type) {
            // 如果是 INDEX 且没有 id，禁止保存
            this.$message.error('当前参数有误，请重新进入页面！')
            return
          }
          // 构造最后的存储数据
          this.form.renovationDetailList = this.moduleList.map(item => {
            return {
              ...item,
              systemConfig: item.systemConfig,
              config: item.config,
              content: item.content
            }
          })
          // 最后做一个强校验，强制检查用户提交的数据是否吻合，方式用户用一些奇怪的方式创建首页
          if (this.form.id) {
            const cmp = disableComponents.filter(o => o.id === Number(this.form.id))
            // 防止用户或者意外的 bug 产生首页消失的 bug
            // 判断当匹配到数据的时候，类型是否是 index
            // 判断没有匹配到数据，类型是否不是 index
            if ((cmp.length && this.routeConfig.type !== 'INDEX') || (!cmp.length && this.routeConfig.type === 'INDEX')) {
              this.$message.error('请注意保持当前页面数据正确性，请勿随意修改非用户配置数据项。')
              return
            }
          }
          saveConfig({
            ...this.form,
            id: type === 1 ? '' : this.form.id // 草稿不需要 id
          }).then(res => {
            if (res.code === 200) {
              this.$notify.success('保存成功')
              this.$confirm('保存成功！', '成功提示', {
                confirmButtonText: '返回列表',
                showCancelButton: false,
                showClose: false
              }).then(() => {
                this.reset()
                this.$router.push(this.routeConfig.type === 'INDEX' ? '/cms/index' : '/cms/special')
              })
            }
          })
        }
      },
      handleTime() {
        // 选择时间
        // 验证当前时间是否大于选择的定时发布时间
        const now = new Date().getTime()
        const time = new Date(this.pushTime)
        if (now > time) {
          this.$message.error('定时发布的时间不得小于当前时间')
          return
        }
        this.handleSubmit(2)
      },
      reset() {
        // 重置
        this.moduleList = []
        this.moduleTotal = {}
        this.form = { // 原始对象
          name: '',
          renovationCode: '', // 编码
          renovationDetailList: [], // 列表
          renovationType: 'SPECIAL', // 当前的类型
          status: '' // 状态
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container{
    .cmp-title{padding-bottom:20px;
      >div{
        &:last-child{text-align: right;}
      }
    }
  }
  .cmp-box{display: flex;justify-content: space-between;}
</style>
