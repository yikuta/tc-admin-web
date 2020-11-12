export const describeTable = [
  {
    title: '商家账号：',
    prop: 'bossAccount'
  },
  {
    title: '补贴金额：',
    prop: 'auditAmount',
    formatter: function(row) {
      return '¥ ' + row.auditAmount
    }
  },
  {
    title: '门店编码：',
    prop: 'shopCode'
  },
  {
    title: '门店名称：',
    prop: 'shopName'
  }
]

export const detailTableColumns = [
  { title: '操作时间', prop: 'createTime' },
  { title: '操作内容', prop: 'content' },
  { title: '操作人', prop: 'operator' }
]
