export const MatchType = {
  ALL: '1', // 与
  UNEQUAL: '3', // 不等于
  EQUAL: '4', // 精准匹配 等于
  CONTAIN: '5', // 模糊匹配 包含
  LT: '6', // less than 小于
  GT: '7', // greater than 大于
  LTE: '8', // 小于等于
  GTE: '9', // 大于等于
  BETWEEN: '10', // 区间值(如：时间段)
  IN: '11', // in 包含,全模糊查询
  NOT_IN: '12', // 不包含
  NULL: '13', // 为空
  Not_NULL: '14', // 不为空
  PRE_DIM: '15' // 前模糊
}
export const DataType = {
  STRING: 'String',
  NUMBER: 'Number',
  DATE: 'Date',
  OBJECT: 'enum',
  ENUM: 'enum',
  BOOLEAN: 'boolean',
  INTEGER: 'Integer',
  ARRAY: 'List',
  LONG: 'Long',
  LISTLONG: 'List<Integer>',
  LISTLONG2: 'List<Long>',
  LISTENUM: 'List<enum>',
  LISTSTRING: 'List<String>'
}
