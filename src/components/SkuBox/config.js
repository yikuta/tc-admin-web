export const MAX_TAG_LENGTH = 10
export const MAX_SPEC_LENGTH = 5
export const MAX_SPEC_NAME_LENGTH = 20
export const MAX_TAG_NAME_LENGTH = 20

export const columnsMap = [{
  value: 'platformDelivery',
  name: '中台发货',
  formatter: row => (row['platformDelivery'] ? '是' : '否'),
  contentType: 'text',
  defaultValue: true // 默认值
}, {
  value: 'costPrice',
  name: '税后供货价',
  unit: '（元）', // 单位
  type: 'decimal', // 数据类型
  max: 999999 // 最大值
  // disabled: false // 文本框不可编辑
}, {
  value: 'marketPrice',
  name: '市场价',
  unit: '（元）',
  type: 'decimal',
  max: 999999 // 最大值
}, {
  value: 'stock',
  name: '库存',
  unit: '',
  type: 'integer',
  max: 999999 // 最大值
}, {
  value: 'weight',
  name: '重量',
  unit: '（kg）',
  type: 'decimal',
  max: 999 // 最大值
}]

export const columnsNewMap = [
  // {
  //   value: 'platformDelivery',
  //   name: '规格编码',
  //   contentType: 'text',
  //   defaultValue: true // 默认值
  // },
  {
    value: 'costPrice',
    name: '成本价',
    unit: '（元）', // 单位
    type: 'decimal', // 数据类型
    max: 999999 // 最大值
    // disabled: false // 文本框不可编辑
  },
  {
    value: 'marketPrice',
    name: '市场价',
    unit: '（元）',
    type: 'decimal',
    max: 999999 // 最大值
  },
  {
    value: 'stock',
    name: '库存',
    unit: '',
    type: 'integer',
    max: 999999 // 最大值
  },
  {
    value: 'weight',
    name: '重量',
    unit: '（kg）',
    type: 'decimal',
    max: 999 // 最大值
  }
]

// 数据结构类型
export const exampleSpecList = [{
  id: 'unehkjuicv00_spec_id',
  isEdit: false,
  name: '颜色',
  tags: [{
    id: 'l5h8c9iijeo0_tag_id',
    name: '红色',
    selected: true
  }, {
    id: 'kil158i9eo0_tag_id',
    name: '黄色',
    selected: true
  }]
}, {
  id: '142i8sj5p7o00_spec_id',
  isEdit: false,
  name: '尺寸',
  tags: [{
    id: 'lmcmj01g0800_tag_id',
    name: '1米',
    selected: true
  }, {
    id: 'ml4uckpp5000_tag_id',
    name: '2米',
    selected: true
  }]
}]
