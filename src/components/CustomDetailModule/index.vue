<template>
  <div class="custom-detail-module">
    <div class="">
      <phone-box>
        <vue-draggable v-model="moduleList">
          <div v-for="(item, index) in moduleList" :key="index" @click="handleEdit(item, index)" class="view-list" :class="{ 'is-editor': isEditor, active: index === moduleActiveIndex }">
            <title-view v-if="item.module === 'title'" :config="item" />
            <editor-view v-if="item.module === 'editor'" :config="item" />
            <divider-view v-if="item.module === 'divider'" :config="item" />
            <blank-view v-if="item.module === 'blank'" :config="item" />
            <video-view v-if="item.module === 'video'" :config="item" />
            <div v-show="isEditor" class="delete" @click.stop="handleDelete(item, index)">删除</div>
          </div>
        </vue-draggable>
      </phone-box>
    </div>
    <div class="module-list" v-show="isEditor">
      <el-card style="width:1000px;">
        <el-button :type="moduleName === 'title' ? 'primary' : 'default'" @click="handleAddModule('title')">标题</el-button>
        <el-button :type="moduleName === 'editor' ? 'primary' : 'default'" @click="handleAddModule('editor')">富文本</el-button>
        <el-button :type="moduleName === 'divider' ? 'primary' : 'default'" @click="handleAddModule('divider')">分割线</el-button>
        <el-button :type="moduleName === 'blank' ? 'primary' : 'default'" @click="handleAddModule('blank')">辅助空白</el-button>
        <el-button :type="moduleName === 'video' ? 'primary' : 'default'" @click="handleAddModule('video')">视频</el-button>
        <el-button :type="moduleName === 'common' ? 'primary' : 'default'" @click="handleAddModule('common')" v-if="isShowCommon">通用模块</el-button>
      </el-card>
      <el-card v-if="moduleName" style="width:1000px;">
        <title-module v-show="moduleName === 'title'" :config="moduleConfig.title" />
        <editor-module v-show="moduleName === 'editor'" :config="moduleConfig.editor" />
        <divider-module v-show="moduleName === 'divider'" :config="moduleConfig.divider" />
        <blank-module v-show="moduleName === 'blank'" :config="moduleConfig.blank" />
        <video-module v-show="moduleName === 'video'" :config="moduleConfig.video" />
        <common-module :businessNo="businessNo" v-show="moduleName === 'common'" :config="{}" @set-common-config="setCommonConfig" />
      </el-card>
    </div>
  </div>
</template>

<script>
  /*
  * 数据返回
  * getContent(status) 传入状态为 true 的时候返回的是原始数组 默认为字符串
  * setContent(content, status) 默认传入数据字符串 status 为 true 的时候传入数组
  * */
  import VueDraggable from 'vuedraggable'

  import PhoneBox from '../PhoneBox/index'

  import TitleModule from './components/title'
  import EditorModule from './components/editor'
  import DividerModule from './components/divider'
  import BlankModule from './components/blank'
  import VideoModule from './components/video'
  import CommonModule from './components/common'

  import TitleView from './views/title'
  import EditorView from './views/editor'
  import DividerView from './views/divider'
  import BlankView from './views/blank'
  import VideoView from './views/video'

  import { GenerateHtml } from '@/utils/editModule'

  export default {
    name: 'GoodsInfoDetail',
    props: {
      businessNo: { // 模块状态，显示通用模块需传
        type: Number,
        default: 1
      },
      isShowCommon: { // 是否显示通用模块
        type: Boolean,
        default: false
      },
      validate: { // 是否需要验证表单
        type: Boolean,
        default: true
      },
      isEditor: { // 是否在编辑状态
        type: Boolean,
        default: true
      }
    },
    components: {
      PhoneBox,
      TitleModule,
      EditorModule,
      DividerModule,
      BlankModule,
      VideoModule,
      CommonModule,
      VueDraggable,
      TitleView,
      EditorView,
      DividerView,
      BlankView,
      VideoView
    },
    data() {
      return {
        moduleList: [], // 内容列表
        moduleName: '', // 模块名称
        moduleConfig: {
          title: {},
          editor: {},
          divider: {},
          blank: {},
          video: {}
        }, // 模块配置
        moduleActiveIndex: null
      }
    },
    methods: {
      /**
       * @description: 嵌入通用模块内容
       */
      setCommonConfig(val) {
        const commonContent = JSON.parse(val)
        this.moduleList = [...this.moduleList, ...commonContent]
      },
      handleAddModule(name) {
        const that = this
        this.moduleConfig[name] = null
        const generator = {
          title() {
            const config = {
              moduleIndex: that.moduleList.length,
              module: 'title',
              moduleName: '标题',
              value: '',
              style: '1',
              align: 'left',
              padding: 0,
              backgroundColor: '#fff',
              textColor: '#000'
            }
            that.moduleList.push(config)
          },
          editor() {
            const config = {
              moduleIndex: that.moduleList.length,
              module: 'editor',
              moduleName: '富文本',
              value: '',
              padding: 0
            }
            that.moduleList.push(config)
          },
          divider() {
            const config = {
              moduleIndex: that.moduleList.length,
              module: 'divider',
              moduleName: '分割线',
              padding: 5
            }
            that.moduleList.push(config)
          },
          blank() {
            const config = {
              moduleIndex: that.moduleList.length,
              module: 'blank',
              moduleName: '辅助空白',
              backgroundColor: '#fff',
              height: 10
            }
            that.moduleList.push(config)
          },
          video() {
            const config = {
              moduleIndex: that.moduleList.length,
              module: 'video',
              moduleName: '视频',
              padding: 0,
              imageSrc: '',
              videoSrc: ''
            }
            that.moduleList.push(config)
          }
        }
        try {
          if (name !== 'common') {
            this.moduleConfig[name] = null
            const length = that.moduleList.length
            generator[name]()
            that.moduleConfig[name] = that.moduleList[length]
            this.moduleName = name
            this.moduleActiveIndex = length
          } else {
            this.moduleName = name
          }
        } catch (e) {
          console.log(e) // eslint-disable-line
        }
      },
      handleEdit(item, index) {
        // 选择编辑
        // this.moduleList.forEach((value) => {
        //   if (value.moduleIndex === item.moduleIndex) {
        //     this.moduleConfig[value.module] = value
        //   }
        // })
        if (!this.isEditor) return
        this.moduleConfig[this.moduleList[index].module] = this.moduleList[index]
        this.moduleName = item.module
        this.moduleActiveIndex = index
      },
      handleDelete(item, index) {
        // 清空选择内容
        this.$confirm(`确定要删除${item.moduleName}吗？`, '提示', {}).then(() => {
          this.moduleActiveIndex = null
          this.moduleName = ''
          this.moduleList.splice(index, 1)
        })
      },
      validateModule() {
        // 验证组件是否输入框为空
        let flag = true
        this.moduleList.forEach((item, index) => {
          // 如果已经是 false 则拦截循环防止多次提示
          if (!flag) return
          if (item.module === 'video') {
            // 视频检测是否是选择了视频
            if (!item.videoSrc) {
              this.handleEdit(item, index)
              this.$message.error('请检查是否未上传视频，如果不需要视频，请删除对应的模块！')
              flag = false
            }
          }
          if (item.module === 'title' || item.module === 'editor') {
            if (!item.value) {
              this.handleEdit(item, index)
              this.$message.error(`请确认${item.module === 'title' ? '标题' : '富文本'}模块是否为空！`)
              flag = false
            }
          }
        })
        return flag
      },
      getContent(status) {
        // 获取内容，返回组件对象和生成的 html
        // status 为 true 则返回列表，否则组件对象将被转换成字符串
        if (this.validate && !this.validateModule()) {
          throw Error('内容验证未通过')
        }
        if (status) {
          return {
            value: this.moduleList,
            html: this.getHtml()
          }
        } else {
          return {
            value: JSON.stringify(this.moduleList),
            html: this.getHtml()
          }
        }
      },
      setContent(content, status) {
        // 设置内容，当status 为 true 的时表示传递的 content 已经是一个对象列表
        const evil = (fn) => {
          const Func = Function // 一个变量指向Function，防止有些前端编译工具报错
          return new Func(`return ${fn}`)()
        }

        if (status) {
          this.moduleList = content
        } else {
          try {
            this.moduleList = evil(content)
          } catch (e) {
            console.log(e) // eslint-disable-line
          }
        }
      },
      getHtml() {
        // 生成对应的html
        let html = ''
        const generateHtml = new GenerateHtml()
        this.moduleList.forEach(value => {
          html += generateHtml[value.module](value)
        })
        html = `<!doctype html><html><head><title></title><meta data-n-head="1" charset="utf-8"><meta data-n-head="1" name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes"><meta data-n-head="1" http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"></head><body>${html}</body></html>`
        return html
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-detail-module{display: flex;
    .module-list{flex-grow: 1;padding-left:20px;}
    .view-list{position:relative;overflow: hidden;
      &.is-editor{
        &:hover,&.active{
          &:before{position:absolute;height:100%;width:100%;top:0;left:0;border:2px dashed #409EFF;content: '';z-index:100;}
        }
        .delete{color:#fff;font-size:12px;display: inline-block;position:absolute;right:0; bottom:0;background:rgba(0,0,0,0.2);padding:2px 5px;cursor: pointer;z-index:101;}
      }
    }
    .editor-block{display: none}
  }
</style>
