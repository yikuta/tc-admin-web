export const REVIEW_STATUS_TYPE = {
  wait: 'RegimentalAuditType_1',
  pass: 'RegimentalAuditType_2',
  refuse: 'RegimentalAuditType_3'
}
export const REVIEW_STATUS = {
  wait: 1,
  pass: 2,
  refuse: 3
}

export const REVIEW_STATUS_LIST = [{
  value: '',
  label: '全部'
}, {
  label: '待审核',
  value: REVIEW_STATUS_TYPE.wait
}, {
  label: '审核通过',
  value: REVIEW_STATUS_TYPE.pass
}, {
  label: '审核拒绝',
  value: REVIEW_STATUS_TYPE.refuse
}]
