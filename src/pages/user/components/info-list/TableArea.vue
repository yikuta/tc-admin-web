<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="memberCode" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="memberPhone" label="用户手机" width="180">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleCheckDetail(row)">{{row['memberPhone']}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="昵称">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleCheckDetail(row)">{{formatNoneValue(row['nickName'])}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="terminalType" label="终端来源" :formatter="(row)=>formatNoneValue(formatTerminalType(row['terminalType']))"></el-table-column>
      <el-table-column prop="empowerSituation" label="微信授权" :formatter="(row)=>formatNoneValue(formatTerminalType(row['empowerSituation']))"></el-table-column>
      <!-- <el-table-column prop="weibo" label="微博授权" :formatter="(row)=>formatNoneValue(row['weibo'])"></el-table-column> -->
      <el-table-column prop="label" label="用户标签" :formatter="(row)=>formatNoneValue(row['label'])">
        <template v-slot:default="{ row }">{{row.labels | labels}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="160px">
        <span slot-scope="{row}">{{row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后登录时间" width="160px">
        <span slot-scope="{row}">{{row['updateTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" v-np='"MEMBER_DETAIL_INFO_VIEW"' @click="handleCheckDetail(row)">查看详情</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    labels(label) {
      let str = ''
      if (label && label.length) {
        let arr = label.filter(item => item.describe !== '无' && item.describe !== '未知' && item.describe !== undefined)
        arr.map((item, index) => {
          if (index < 3) {
            if (index === 0) {
              str += item.describe
            } else {
              str += ',' + item.describe
            }
          }
        })
        if (arr.length > 3) str += ',...'
        return str
      } else {
        return '-'
      }
    }
  },
  methods: {
    formatTerminalType(val) {
      if (val) {
        return val.describe
      } else {
        return ''
      }
    },
    handleCheckDetail(row) {
      this.$router.push({
        path: '/user/detail',
        query: {
          memberCode: row.memberCode,
          memberId: row.id,
          memberPhone: row.memberPhone
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
