### 手机盒子模块说明

数据结构
`````
childProductArray
[
    {
        childProductId: 0,
        childProductSpec: this.getChildProductSpec(index),
        childProductNo: this.defaultProductNo + index,
        childProductStock: 0, // 库存
        childProductPrice: 0, // 价格
        childProductCost: 0, // 成本
        childProductWeight: 0, // 重量
        isUse: true // 启用
    }
]
specification
[
    {
        name: '尺寸',
        value: ['x', 'xl', 'xxl']
    }
]
`````
props
```
// 各个参数的最大值
number: {
    weight: 1000,
    stock: 1000000,
    cost: 1000000,
    market: 1000000
  }
标题名称
tdName: {
    childProductNo: '商品编码',
    childProductStock: '库存',
    childProductPrice: '销售价格',
    childProductCost: '进货价',
    childProductWeight: '重量'
}
最小值，即最少有几条数据
min: 1
```
外部方法
```
checkData 验证方法，做简单的验证
resetData 重置数据
getData 获取数据
返回
    {
          specsGroupDtos: specification, // 规格名称列表
          specsValueDtos: childProductArray // 规格数据列表
    }
setData 设置数据
传入参数 参考返回的数据格式
    specsGroupDtos
    specsValueDtos
```
调用

```
<sku-component ref="sku"></sku-component>
<script>
……
this.$refs.sku.resetData()
……
</script>
```
