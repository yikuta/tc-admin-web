/* eslint-disable */
import Mock from 'mockjs'

const { Random } = Mock

const terminalOptions = ['天呈生活APP', '天呈生活小程序', '天呈净菜小程序']
const typeOptions = ['开屏', '弹屏', 'Banner', '图片广告', '文字广告', '浮窗广告']
const adStatusOptions = ['待上架', '已过期', '展示中', '已下架']
const routeTypeOptions = ['H5页面', '小程序', '小程序页面']
// 广告位列表
Mock.mock(/\/tc\/advertising\/space\/list/, 'post', (req) => {
  const list = []
  for (let i = 0; i < 30; i++) {
    const idx = Random.natural(0, 5)
    list.push({
      id: i + 1,
      number: Random.guid(),
      name: Random.cname(),
      source: Random.pick(terminalOptions),
      type: { describe: typeOptions[idx], value: idx + 1 },
      createTime: Random.datetime(),
      enable: Random.boolean()
    })
  }
  return {
    code: 200,
    result: {
      pageNo: 1,
      totalCount: 30,
      itemVOs: list
    }
  }
})

// 广告位详情
Mock.mock(/\/tc\/advertising\/space\/\d/, 'get', req => {
  return {
    code: 200,
    result: {
      number: Random.guid(),
      name: Random.cname(),
      source: Random.pick(terminalOptions),
      type: { describe: typeOptions[1], value: 2 },
      picWidth: 100,
      picHeight: 100,
      count: 5,
      autoClose: true,
      time: 60
    }
  }
})

// 启停用广告位
Mock.mock(/\/tc\/advertising\/space\/updateStatus/, 'post', req => {
  return {
    code: 200,
    result: {}
  }
})

// 更新广告排序值
Mock.mock(/\/tc\/advertising\/sort\/update/, 'post', req => {
  return {
    code: 200,
    result: {}
  }
})

// 广告列表
Mock.mock(/\/tc\/advertising\/list/, 'post', (req) => {
  const list = []
  for (let i = 0; i < 30; i++) {
    const idx = Random.natural(0, 5)
    const idx2 = Random.natural(0, 3)
    list.push({
      id: i + 1,
      name: Random.cname(),
      spaceName: Random.cname(),
      spaceType: { describe: typeOptions[idx], value: idx + 1 },
      source: Random.pick(terminalOptions),
      expireStart: Random.datetime(),
      expireEnd: Random.datetime(),
      createTime: Random.datetime(),
      user: Random.cname(),
      sort: 0,
      status: { describe: adStatusOptions[idx2], value: idx2 + 1 }
    })
  }
  return {
    code: 200,
    result: {
      pageNo: 1,
      totalCount: 30,
      itemVOs: list
    }
  }
})

// 广告详情
Mock.mock(/\/tc\/advertising\/\d/, 'get', req => {
  const idx = Random.natural(0, 5)
  const idx2 = Random.natural(0, 2)
  // const imageList = []
  // for (let i = 0; i <= Random.natural(0, 9); i++) {
  //   imageList.push(Random.dataImage())
  // }
  return {
    code: 200,
    result: {
      name: Random.cname(),
      spaceName: Random.cname(),
      spaceType: { describe: typeOptions[idx], value: idx + 1 },
      source: Random.pick(terminalOptions),
      expireStart: Random.datetime(),
      expireEnd: Random.datetime(),
      image: Random.dataImage(),
      text: Random.sentence(),
      routeType: { describe: routeTypeOptions[idx2], value: idx2 + 1 },
      link: Random.url(),
      appId: Random.guid()
    }
  }
})

// 发布广告
Mock.mock(/\/tc\/advertising\/add/, 'post', req => {
  return {
    code: 200,
    result: {}
  }
})
