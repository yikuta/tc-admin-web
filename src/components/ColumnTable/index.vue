<template>
  <!-- 竖着的tabel -->
  <div class="column-table">
    <dl v-for="(item,index) of configList"
        :key="index">
      <!-- label -->
      <dt>{{item.label}}</dt>

      <!-- 如果是时间格式 -->
      <dd v-if="item.type ==='time'"
          :style="'color:'+item.color">{{fetchInfo[item.key] | format('yyyy-MM-dd HH:mm:ss')}}</dd>
      <!-- 如果是图片 -->
      <dd v-if="item.type === 'img'"
          :style="'color:'+ item.color">
        <template v-for="(src,idx) of item.key">
          <el-image class="img-box"
                    :src="fetchInfo[src]"
                    :preview-src-list="[fetchInfo[src]]"
                    :key="idx">
          </el-image>
        </template>
      </dd>
      <!-- 如果是需要组合的文字 -->
      <dd v-if="item.type === 'concat'"
          :style="'color:'+item.color">
        <span>{{concatText(item.key) || '无'}} {{item.unit || ''}}</span>
      </dd>
      <!-- 如果是需要组合的文字2(带括号的那种,例如：xx (18380212741)) -->
      <dd v-if="item.type === 'brackets'"
          :style="'color:'+item.color">
        <span>{{concatBracketsText(item.key) || '无'}} {{item.unit || ''}}</span>
      </dd>
      <!-- 普通文字 -->
      <dd v-if="!item.type"
          :style="'color:'+item.color">
        <span>
          {{fetchInfo[item.key] || '无'}} {{item.unit || ''}}
        </span>
      </dd>

    </dl>
  </div>
</template>

<script>
export default {
  props: {
    fetchInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    configList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    previewSrcList(keyArr) {
      let _previewSrcList = []
      keyArr.forEach(item => {
        _previewSrcList.push(this.fetchInfo[item])
      })
      return _previewSrcList
    },
    concatText(keyArr) {
      let _txt = ''
      keyArr.forEach(item => {
        _txt += this.fetchInfo[item]
      })
      return _txt
    },
    concatBracketsText(keyArr) {
      let _txt = ''
      if (keyArr.length && keyArr.length === 2) {
        keyArr.forEach((item, index) => {
          if (index === 0) {
            _txt = this.fetchInfo[item]
          } else if (index === 1) {
            _txt = _txt + ' (' + this.fetchInfo[item] + ')'
          }
        })
      }
      return _txt
    }
  }
}
</script>

<style lang="scss" scoped>
.column-table {
  dl:first-child {
    border-top: 1px solid #e4e4e4;
  }
  dl {
    display: flex;
    border-right: 1px solid #e4e4e4;
    border-left: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    min-height: 40px;
    line-height: 40px;
    margin: 0;
    font-size: 14px;
  }
  dt {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-right: 1px solid #e4e4e4;
    width: 150px;
    text-align: right;
    padding-right: 20px;
    background: #f9fafc;
  }
  dd {
    margin-left: 20px;
  }
  .img-box {
    display: inline-block;
    padding: 20px 0;
    width: 250px;
    margin-right: 20px;
  }
}
</style>