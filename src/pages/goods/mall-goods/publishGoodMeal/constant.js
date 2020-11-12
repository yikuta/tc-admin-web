export const formRules = {
  categoryList: [
    { required: true, message: '请添加展示分类', trigger: 'blur' },
    { min: 1, message: '请添加展示分类', trigger: 'blur' }
  ],
  commodityName: [
    { required: true, message: '请输入套餐名称', trigger: 'blur' },
    { min: 1, max: 50, message: '输入不超过50个任意字符', trigger: 'blur' }
    // { pattern: /^[\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入套餐简介', trigger: 'blur' },
    { min: 1, max: 200, message: '最多200个任意字符', trigger: 'blur' }
  ],
  transfer: [{ required: true, message: '请选择物流信息', trigger: 'blur' }],
  packageType: [{ required: true, message: '请选择套餐类型', trigger: 'blur' }],
  discount: [{ required: true, message: '请选择是否用折扣', trigger: 'blur' }],
  baseSale: [
    { required: true, message: '请填写基础销量', trigger: 'blur' },
    { pattern: /^(([1-9]\d{0,5})|0)$/, message: '请输入100万以内的整数', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请填写展示排序', trigger: 'blur' },
    { pattern: /^((\d{1,6})|0|999999)$/, message: '排序限制100万以内的整数', trigger: 'blur' }
  ],
  shelfOnMode: [{ required: true, message: '请选择上架模式', trigger: 'blur' }],
  nextUpperDate: [{ required: true, message: '请填写上架时间', trigger: 'blur' }],
  shelfOffMode: [{ required: true, message: '请选择下架模式', trigger: 'blur' }],
  nextLowerDate: [{ required: true, message: '请填写下架时间', trigger: 'blur' }]
}
