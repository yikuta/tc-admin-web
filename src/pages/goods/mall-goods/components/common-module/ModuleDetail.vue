<template>
  <div class="app-container">
    <p class="module-head">{{title}}</p>
    <el-divider v-if="showLine"></el-divider>
    <div class="module-container">
      <!-- <div class="module-show">
        <img
          src="@/assets/images/module-head.png"
          alt=""
          class="module-head"
        >
        <img
          src="@/assets/images/module-left.png"
          alt=""
          class="module-left"
        >
        <img
          src="@/assets/images/module-right.png"
          alt=""
          class="module-right"
        >
        <img
          src="@/assets/images/module-bottom.png"
          alt=""
          class="module-bottom"
        >
        <img
          src="@/assets/images/module-text.png"
          alt=""
          class="module-text"
        >
      </div>
      <div class="module-content">
        <div class="btns">
          <el-button
            v-for="(item,index) in btns"
            :key="index"
            @click="handleChangeTabs(index,item)"
          >+{{item}}</el-button>
        </div>
        <div
          class="module-tab-content"
          v-if="activeTab!=-1"
        >
          <div class="item"><span>模块名称：</span>{{activeName}}</div>
          <compontent
            :is='componentsList[activeTab]'
            @handleChange='handleChangeModule'
          ></compontent>
        </div>
      </div>-->
      <custom-detail-module ref="customDetailModule" :isEditor="!isPreview"></custom-detail-module>
    </div>
    <el-card class="add-module-btn" v-if="!isPreview">
      <el-button v-if="isAdd" @click="addModule">添加模块</el-button>
      <el-button v-else @click="updateModule">修改模块</el-button>
    </el-card>
  </div>
</template>
<script>
import ModuleTitle from './ModuleTitle'
import ModuleTinymce from './ModuleTinymce'
import ModuleMargin from './ModuleMargin'
import ModuleAudio from './ModuleAudio'
import CustomDetailModule from '@/components/CustomDetailModule/index'
export default {
  components: {
    ModuleTitle,
    ModuleTinymce,
    ModuleMargin,
    ModuleAudio,
    CustomDetailModule
  },
  props: {
    title: String,
    showLine: Boolean,
    isAdd: Boolean,
    isPreview: Boolean
  },
  data() {
    return {
      activeTab: -1,
      btns: ['标题', '富文本', '分割线', '辅助空白', '视频'],
      activeName: '',
      form: {
        title: '',
        style: 1,
        type: 'left',
        marign: 20,
        background: '',
        color: '',
        tinymce: '',
        tinymceMargin: '',
        lineMargin: '',
        blankMargin: ''
      },
      componentsList: ['moduleTitle', 'ModuleTinymce', 'ModuleMargin', 'ModuleMargin', 'ModuleAudio']
    }
  },
  methods: {
    handleChangeTabs(index, name) {
      this.activeTab = index
      this.activeName = name
    },
    handleChangeModule(key, value) {
      // console.log(key, value)
      this.form[key] = value
    },
    addModule() {
      // console.log('addModule', this.$refs['customDetailModule'].getContent())
      this.$emit('add-module', this.$refs['customDetailModule'].getContent())
    },
    updateModule() {
      this.$emit('update-module', this.$refs['customDetailModule'].getContent())
    },
    setContent(detail) {
      this.$refs['customDetailModule'].setContent(detail)
    }
  }
}
</script>
<style lang="scss" scoped>
.module-head {
  margin: 0;
  padding: 0;
}
.module-container {
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  .module-show {
    position: relative;
    float: left;
    height: 750px;
    width: 400px;
  }
  .module-head {
    border-width: 0px;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 375px;
    height: 54px;
  }
  .module-left {
    position: absolute;
    left: 0px;
    top: 44px;
    width: 26px;
    height: 695px;
  }
  .module-right {
    border-width: 0px;
    position: absolute;
    left: 349px;
    top: 44px;
    width: 26px;
    height: 695px;
  }
  .module-bottom {
    border-width: 0px;
    position: absolute;
    left: 26px;
    top: 688px;
    width: 323px;
    height: 51px;
  }
  .module-text {
    border-width: 0px;
    position: absolute;
    left: 27px;
    top: 65px;
    width: 323px;
    height: 50px;
  }
}
.module-content {
  // position: absolute;
  // left: 400px;
  float: left;
  width: calc(100% - 400px);
  .btns {
    background: rgba(242, 242, 242, 1);
    border-radius: 5px;
    border: 1px solid rgba(215, 215, 215, 1);
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      background: #33ab9f;
      color: white;
      height: 38px;
    }
  }
  .module-tab-content {
    background: rgba(242, 242, 242, 1);
    border-radius: 5px;
    border: 1px solid rgba(215, 215, 215, 1);
    margin-top: 20px;
    padding: 10px;
    .item {
      margin-bottom: 20px;
      overflow: hidden;
      display: flex;
      align-items: center;
      span {
        float: left;
      }
    }
  }
}
.add-module-btn {
  text-align: center;
  button {
    background: #33ab9f;
    color: white;
    height: 38px;
  }
}
</style>
