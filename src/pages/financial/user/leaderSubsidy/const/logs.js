// 详情页
export const describeTable = [
  { title: '团长账号：', prop: 'phoneNumber' },
  {
    title: '补贴金额：',
    prop: 'auditAmount',
    formatter: function(row) {
      return '¥ ' + row.auditAmount
    }
  },
  { title: '团长编码：', prop: 'regimentalCode' },
  { title: '团长姓名：', prop: 'name' }
]

// 审核日志
export const detailTableColumns = [
  { title: '操作时间', prop: 'createTime' },
  { title: '操作内容', prop: 'content' },
  { title: '操作人', prop: 'operator' }
]
