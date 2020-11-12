
const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档
const domain = process.env.BASE_API // 定义默认域名，随便写
const code = 200 // 返回的状态码

// 随机生成文章数据
const postData = req => {
  // 请求体，用于获取参数
  console.log(req, JSON.parse(req.body)) // eslint-disable-line

  let posts = [] // 用于存放文章数据的数组

  for (let i = 0; i < 10; i++) {
    let post = {
      title: Random.csentence(10, 25), // 随机生成长度为10-25的标题
      icon: Random.dataImage('250x250', '文章icon'), // 随机生成大小为250x250的图片链接
      author: Random.cname(), // 随机生成名字
      date: Random.date() + ' ' + Random.time() // 随机生成年月日 + 时间
    }

    posts.push(post)
  }

  // 返回状态码和文章数据posts
  return {
    code,
    posts
  }
}
Mock.mock(`${domain}/post`, 'get', postData)

// 定义请求链接，类型，还有返回数据
Mock.mock(`${domain}/info`, 'get', (req) => {
  // 请求体，用于获取参数
  console.log(req, JSON.parse(req.body)) // eslint-disable-line
  let goods_vos = [] // 用于存放文章数据的数组

  for (let i = 0; i < 10; i++) {
    let goods_vo = {
      goods_id: 334,
      category_id: 383,
      category_name: null,
      shop_cat_id: 34,
      brand_id: 60,
      goods_name: 'LANCOME 兰蔻清滢保湿柔肤水大粉水400ml爽肤水女补水保湿补水滋润营养正品大瓶装 法国进口【最新版本】',
      sn: '000000000683626274',
      price: 309,
      cost: 300,
      mktprice: 310,
      weight: 1,
      goods_transfee_charge: 1,
      intro: 'sss',
      have_spec: 0,
      quantity: 100,
      market_enable: 1,
      goods_gallery_list: null,
      page_title: 'LANCOME 兰蔻清滢保湿柔肤水大粉水400ml爽肤水女补水保湿补水滋润营养正品大瓶装 法国进口【最新版本】',
      meta_keywords: 'LANCOME 兰蔻清滢保湿柔肤水大粉水400ml爽肤水女补水保湿补水滋润营养正品大瓶装 法国进口【最新版本】',
      meta_description: 'LANCOME 兰蔻清滢保湿柔肤水大粉水400ml爽肤水女补水保湿补水滋润营养正品大瓶装 法国进口【最新版本】',
      template_id: 0,
      is_auth: 1,
      enable_quantity: 98,
      thumbnail: 'http://javashop-statics.oss-cn-beijing.aliyuncs.com/v70/goods/402E7E6F6BD24287AB32A8DCF214F848.jpg_300x300',
      big: 'http://javashop-statics.oss-cn-beijing.aliyuncs.com/v70/goods/402E7E6F6BD24287AB32A8DCF214F848.jpg_800x800',
      small: 'http://javashop-statics.oss-cn-beijing.aliyuncs.com/v70/goods/402E7E6F6BD24287AB32A8DCF214F848.jpg_400x400',
      original: ''
    }
    goods_vos.push(goods_vo)
  }

  let member_vos = [] // 用于存放用户数据的数组
  for (let i = 0; i < 10; i++) {
    let member_vo = {
      nickname: 'AAA',
      email: '784321653@qq.com',
      create_time: 1535442162,
      mobile: '18854545544',
      uname: 'AAA'
    }
    member_vos.push(member_vo)
  }

  return {
    code: 200,
    data: {
      sales_total: {
        receive_money: Random.integer(1, 100),
        refund_money: Random.integer(1, 100),
        real_money: Random.integer(1, 100)
      },
      goods_vos: goods_vos,
      member_vos: member_vos
    }
  }
})

