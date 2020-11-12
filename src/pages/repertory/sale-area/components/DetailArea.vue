<template>
  <div class="sale-area-detail">
    <div class="detail-item">
      <dl
        v-for="item in provices"
        :key="item.value"
      >
        <dt>{{item.label}}</dt>
        <dd>
          <span
            v-for="items in item.children"
            :key="items.value"
          >{{items.label}}</span>
        </dd>
      </dl>
    </div>
    <!-- <div class="area-left">
      <ul>
        <li
          v-for="item in provices"
          :key="item.value"
        >{{item.label}}</li>
      </ul>
    </div>
    <div class="area-right">
      <span
        v-for="item in seconds"
        :key="item.value"
      >{{item.label}}</span>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      provices: [
        {
          label: '四川省',
          value: '001',
          children: [
            {
              label: '广安市',
              value: '0011'
            },
            {
              label: '成都市',
              value: '0013'
            },
            {
              label: '宜宾市',
              value: '0014'
            },
            {
              label: '广元市',
              value: '0015'
            },
            {
              label: '达州',
              value: '0016'
            },
            {
              label: '广安',
              value: '0017'
            },
            {
              label: '成都',
              value: '0018'
            },
            {
              label: '宜宾',
              value: '0019'
            },
            {
              label: '广元',
              value: '0010'
            },
            {
              label: '达州',
              value: '00101'
            },
            {
              label: '广安',
              value: '00102'
            },
            {
              label: '成都',
              value: '00103'
            },
            {
              label: '宜宾',
              value: '00104'
            },
            {
              label: '广元',
              value: '00105'
            },
            {
              label: '达州',
              value: '00106'
            },
            {
              label: '广安',
              value: '0011'
            },
            {
              label: '成都',
              value: '0013'
            },
            {
              label: '宜宾',
              value: '0014'
            },
            {
              label: '广元',
              value: '0015'
            },
            {
              label: '达州',
              value: '0016'
            },
            {
              label: '广安',
              value: '0017'
            },
            {
              label: '成都',
              value: '0018'
            },
            {
              label: '宜宾',
              value: '0019'
            },
            {
              label: '广元',
              value: '0010'
            },
            {
              label: '达州',
              value: '00101'
            },
            {
              label: '广安',
              value: '00102'
            },
            {
              label: '成都',
              value: '00103'
            },
            {
              label: '宜宾',
              value: '00104'
            },
            {
              label: '广元',
              value: '00105'
            },
            {
              label: '达州',
              value: '00106'
            }
          ]
        },
        {
          label: '重庆市',
          value: '002',
          children: [
            {
              label: '重庆市',
              value: '0022'
            }
          ]
        },
        {
          label: '黑龙江省',
          value: '003'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.sale-area-detail {
  border-top: 1px solid #999;
  display: flex;
  .detail-item {
    overflow: hidden;
    dl {
      display: flex;
      margin: 0;
      dt {
        width: 120px;
        border-right: 1px solid #999;
        line-height: 40px;
        text-align: center;
      }
      dd {
        flex: 1;
        span {
          margin-right: 20px;
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
  // .area-left {
  //   width: 120px;
  //   min-height: 300px;
  //   border-right: 1px solid #999;
  //   ul li {
  //     list-style: none;
  //     height: 40px;
  //     line-height: 40px;
  //     cursor: pointer;
  //     &:hover {
  //       color: #409eff;
  //     }
  //   }
  // }
  // .area-right {
  //   flex: 1;
  //   padding: 16px 10px;
  //   span {
  //     margin-right: 20px;
  //     display: inline-block;
  //     height: 40px;
  //     line-height: 40px;
  //   }
  // }
}
</style>