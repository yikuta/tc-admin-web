export const statusArray = [
  {
    label: '全部',
    value: ''
  }, {
    label: '执行失败',
    value: 0
  }, {
    label: '等待执行',
    value: 1
  }, {
    label: '执行中',
    value: 2
  }, {
    label: '执行成功',
    value: 3
  }
]

export const listForm = [
  {
    label: '提交时间',
    prop: 'createTime',
    slot: true
  }, {
    label: '完成状态',
    prop: 'status',
    type: 'select',
    options: statusArray
  }
]

export const listTableColumns = [
  { title: '下载编号', prop: 'code', width: '80px' },
  { title: '文件名称', prop: 'filename' },
  { title: '提交人', prop: 'username' },
  { title: '提交时间', prop: 'createTime' },
  { title: '完成时间', prop: 'updateTime' }
]
