<template>
  <div class="app-container">
    <el-form label-width="100px">
      <div class="title">队列基本信息</div>
      <el-form-item label="队列名称">
        <el-input class="input-width" size="medium" v-model="form.name" placeholder="请输入队列名称"></el-input>
      </el-form-item>
      <div class="title">选择优惠券</div>
      <el-form-item label="设置优惠券">
        <div v-for="(item, index) in form.discountList" :key="index">
          <el-select placeholder="" size="medium" v-model="form.discountList[index].coupon">
            <el-option v-for="(coupon, i) in couponData" :key="i" :label="coupon.name" :value="coupon.code"></el-option>
          </el-select>
          <el-input class="input-num" size="medium" placeholder="" v-model="form.discountList[index].num" />
          张
          <i class="el-icon-plus" @click="add"></i>
          <i class="el-icon-minus" @click="del(index)"></i>
        </div>
      </el-form-item>
      <div class="title">选择用户范围</div>
      <el-form-item label="添加方式">
        <div>数据总条数：5980</div>
        <el-table :data="tableData" border>
          <el-table-column label="序号" prop="num"></el-table-column>
          <el-table-column label="手机号" prop="cannotUse"></el-table-column>
          <el-table-column label="用户名" prop="totleNum"></el-table-column>
        </el-table>
      </el-form-item>
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
      <el-form-item>
        <el-button>返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { reqUpload } from '@/api/mallGoods'
  import Pagination from '@/components/Pagination'

  function getTimestamp() {
    const date = new Date().getTime() / 1000
    return parseInt(date.toString(), 10)
  }

  export default {
    name: 'man-made',
    components: {
      Pagination
    },
    data() {
      return {
        couponData: [],
        form: {
          name: '',
          discountList: [
            { coupon: '', num: '' }
          ],
          fileList: []
        },
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        tableData: []
      }
    },
    created() {
      // this.generate()
    },
    methods: {
      add() {
        this.form.discountList.push({ coupon: '', num: '' })
      },
      del(index) {
        this.form.discountList.splice(index, 1)
      },
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container{
    > div {
      padding: 5px 8px;
    }
    .title {

    }
    .input-width{width:200px;}
    .input-num{width:80px;}
  }
</style>
