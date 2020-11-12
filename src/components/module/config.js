/*
* 参数配置信息
* {
*   id: 0, // 唯一
*   name: '', // 唯一组件名称
*   enName: '', // 唯一组件英文名称
*   systemConfig: { // 系统配置信息
*     num: 1, // 每个页面支持的数量 默认 10 个
*     related: [], // 和关联组件，互相只能出现一个
*     type: [], // 组件支持的页面
*     push: 'start', // 选择插入数组的方案
*     sort: true, // 是否可以拖动
*     border: false, // 是否有边框，当如悬浮球等需要设置为 false，因为和正常的数组流显示不一样
*   }
*   config: {}, // 配置信息
*   content: {} // 内容配置
* }
* */

/*
* 组件基础信息一览
* id 中文名 英文名
* 1 图片轮播 carousel
* 2 多图 images
* 3 金刚区 vajra
* 4 公告 notice
* 5 纯文本 pureText
* 6 秒杀 secKill
* 7 商品列表 goodsList
* 8 商品推荐 goodsRecommend
* 9 净菜门店 ppvShop
* 10 悬浮球 positionBall
* 11 拼团 makeGroup
* */

//  http://k8s-newzt.oss-cn-shenzhen.aliyuncs.com/image/2020-07-30/O1CN01OUZsdB1lJWuKR23Ix_!!2459354798.jpg
// http://k8s-newzt.oss-cn-shenzhen.aliyuncs.com/image/2020-07-30/O1CN01oDu4Vx1HDdLbQ49g4_!!63710724.jpg
export const commonDialogConfig = {
  pageId: null, // type: 1，跳转的页面 id
  goodsTypeId: null, // type: 2，商品的类型
  goodsId: null, // type: 2, 商品的 id
  serviceId: null, // type: 3，业务类型的 id
  classifyId: null, // type: 3，分类
  shopId: null, // type: 4，店铺 id
  specialId: null, // type: 5，专题 id
  platformId: null, // type: 6，平台 id
  platformLink: '', // 链接
  baseData: null // 存储了商品原始的数据，如商品/店铺的完整数据，临时
}

const config = [
  {
    name: '图文',
    list: [
      {
        id: 1,
        name: '图片轮播',
        enName: 'carousel',
        systemConfig: {
          num: 10,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          direction: 'horizontal', // 轮播方向 horizontal/vertical
          indicatorPosition: 'left', // 指示器位置 left center right
          indicatorType: '', // 指示器类型 number round
          interval: 3000 // 轮播周期
        },
        content: { // 内容
          /*
          * 最多添加10个图片，建议图片尺寸宽度750，高度200-1000，支持类型：jpg、png。
          * */
          list: [ // 图片列表 上限十张
            {
              typeId: null, // 类型
              typeName: '',
              image: '', // 图片
              content: { // 对应类型的内容，根据类型的不同取不同的值
                ...commonDialogConfig
              }
            }
          ]
        }
      },
      {
        id: 2,
        name: '多图',
        enName: 'images',
        systemConfig: {
          num: 10,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          display: 'static', // 展示形式 static 固定
          flex: 3 // 每行展示数量
        },
        content: { // 内容
          /*
          * 最多添加10个图片，建议图片尺寸宽度750，高度200-1000，支持类型：jpg、png。
          * */
          list: [ // 图片列表 上限十张
            {
              typeId: null, // 类型
              typeName: '',
              image: '', // 图片
              content: { // 对应类型的内容，根据类型的不同取不同的值
                ...commonDialogConfig
              }
            }
          ]
        }
      },
      {
        id: 3,
        name: '金刚区',
        enName: 'vajra',
        systemConfig: {
          num: 10,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          line: 1, // 展示行数
          flex: 4 // 每行展示的数量
        },
        content: { // 内容
          /*
          * 最多添加10个图片，建议图片尺寸宽度750，高度200-1000，支持类型：jpg、png。
          * */
          list: [ // 金刚区域，最多十个
            {
              title: '', // 标题
              typeId: null, // 类型
              typeName: '',
              image: '', // 图片
              content: { // 对应类型的内容，根据类型的不同取不同的值
                ...commonDialogConfig
              }
            }
          ]
        }
      },
      {
        id: 4,
        name: '公告',
        enName: 'notice',
        systemConfig: {
          num: 2,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          line: 1 // 每行展示的数量
        },
        content: { // 内容
          image: '', // 公告图片，建议图片尺寸宽度150×150，支持类型：jpg、png
          list: [ // 公告，最多两个
            {
              title: '', // 标题
              typeId: null, // 类型
              typeName: '',
              content: { // 对应类型的内容，根据类型的不同取不同的值
                ...commonDialogConfig
              }
            }
          ]
        }
      },
      {
        id: 5,
        name: '纯文本',
        enName: 'pureText',
        systemConfig: {
          num: 10,
          related: [],
          type: ['special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          titleSize: 14, // 标题字体大小
          align: 'left', // 标题位置
          contentSize: 14 // 正文字体大小
        },
        content: {
          title: '标题', // 标题
          content: '文本内容', // 文本
          image: '' // 背景图 建议图片尺寸宽度150×150，支持类型：jpg、png。
        }
      }
    ]
  },
  {
    name: '专区',
    list: [
      {
        id: 6,
        name: '秒杀',
        enName: 'secKill',
        systemConfig: {
          num: 10,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          countDown: false, // 倒计时
          flex: 3, // 每行展示数量
          direction: 'horizontal', // 轮播方向 none/horizontal/vertical
          interval: 3000 // 轮播周期
        }
      },
      {
        id: 11,
        name: '拼团',
        enName: 'makeGroup',
        systemConfig: {
          num: 10,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          flex: 3, // 每行展示数量
          direction: 'horizontal', // 轮播方向 none/horizontal/vertical
          interval: 3000 // 轮播周期
        }
      }
    ]
  },
  {
    name: '商品',
    list: [
      {
        id: 7,
        name: '商品列表',
        enName: 'goodsList',
        systemConfig: {
          num: 1,
          related: ['ppvShop'],
          type: ['index', 'special'],
          push: 'end',
          sort: false, // 是否可以拖动
          border: true
        },
        config: {
          dataSources: {
            dataType: 'MIXING', // 数据来源类型
            serviceId: 1, // 数据类型
            classifyId: [], // 分类 id
            classifyName: [] // 分类名称
          },
          /*
          * 参数
          *   flex 平铺
          *   block 列表
          * */
          display: 'flex', // 展示形式
          displayButton: true, // 展示形式切换按钮
          /*
          * sort 参数
          * 默认为空
          * saleCount 销量
          * minSalePrice 价格
          * */
          order: '', // 排列方式
          orderButton: true, // 排列方式切换按钮
          // 商品信息
          goods: {
            title: true, // 标题
            subTitle: true, // 副标题
            estimateTime: true, // 预计到货时间
            salePrice: true, // 当前售价
            marketPrice: true, // 市场售价
            sales: true // 30天销量
          },
          // 展示标签
          tags: {
            service: true, // 业务
            group: true, // 拼团
            coupon: true, // 领券
            secKill: true // 秒杀
          }
        },
        content: {
          title: '标题', // 标题
          subTitle: '副标题' // 副标题
        }
      },
      {
        id: 8,
        name: '商品推荐',
        enName: 'goodsRecommend',
        systemConfig: {
          num: 12,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: true, // 是否可以拖动
          border: true
        },
        config: {
          flex: 3, // 每行展示数量
          direction: 'horizontal', // 轮播方向 horizontal/vertical
          interval: 3000 // 轮播周期
        },
        content: {
          title: '标题', // 标题
          subTitle: '副标题', // 副标题
          /*
          * 最多添加12个商品，建议选择商品数量为每行展示商品数量的整数倍
          * {
          *   id: '', // 商品 id
          *   title: '', // 标题
          *   price: 0, // 售价
          *   image: '' // 图片
          * }
          * */
          list: [
            {
              id: null,
              goodsTypeId: null,
              name: '',
              marketPrice: 0, // 市场价
              salePrice: 0, // 销售价
              image: '',
              shopCode: '' // 净菜有商家编号
            }
          ]
        }
      }
    ]
  },
  {
    name: '门店',
    list: [
      {
        id: 9,
        name: '净菜门店',
        enName: 'ppvShop',
        systemConfig: {
          num: 1,
          related: ['goodsList'],
          type: ['index', 'special'],
          push: 'end',
          sort: false, // 是否可以拖动
          border: true,
          switch: 'store' // 净菜特有的切换按钮
        },
        config: {
          shop: {
            /*
            * sort 参数
            * sale 销量
            * distance 距离
            * */
            sort: 'sale', // 排序 sale distance
            title: true, // 标题
            openTime: true, // 营业时间
            distribution: true, // 配送
            coupon: true, // 优惠券
            distance: true, // 距离
            hotTag: true, // 热卖标签
            brandTag: true, // 品牌标签
            specialTag: true, // 特色标签
            shopGoods: true, // 门店商品
            shopGoodsName: true, // 门店商品名称
            shopGoodsSalePrice: true, // 门店商品售价
            shopGoodsMarketPrice: true // 市场价
          },
          goods: {
            title: true, // 标题
            subTitle: true, // 副标题
            estimateTime: true, // 预计到货时间
            salePrice: true, // 当前售价
            marketPrice: true, // 市场售价
            sales: true, // 30天销量
            shopBanner: true, // 店招
            shopName: true, // 店铺名称
            openTime: true, // 营业时间
            shopRelated: true // 相关门店
          }
        },
        content: {
          shopTitle: '附近门店', // 门店标题
          goodsTitle: '特色净菜' // 商品列表标题
        }
      }
    ]
  },
  {
    name: '其它',
    list: [
      {
        id: 10,
        name: '悬浮球',
        enName: 'positionBall',
        systemConfig: {
          num: 1,
          related: [],
          type: ['index', 'special'],
          push: 'start',
          sort: false, // 是否可以拖动
          border: false
        },
        config: {
          /*
          * type 参数
          * cart 购物车
          * top 回到顶部
          * default 自定义
          * */
          type: 'cart'
        },
        content: { // 自定义参数的时候会用到这个
          typeId: null, // 类型
          typeName: '',
          image: '', // 图片
          content: {
            ...commonDialogConfig
          }
        }
      }
    ]
  }
]

export const filterData = {
  common: [
    { id: 1, name: '首页' },
    { id: 2, name: '净菜首页' },
    { id: 3, name: '快递到家首页' },
    { id: 4, name: '爆品预售首页' },
    { id: 5, name: '领券中心' }
  ],
  dataSources: {
    dataType: [
      { name: 'MIXING', value: '混合推荐' },
      { name: 'BUSINESS', value: '指定业务' },
      { name: 'CATEGORY', value: '指定分类' }
    ],
    types: [
      { id: 1, value: '快递到家' },
      { id: 2, value: '爆品预售' },
      { id: 4, value: '净菜' }
    ]
  }
}

// 各个端首页功能一览
export const disableComponents = [ // id 和数据库 id 一致，需要过滤的数据
  { id: 1, name: 'app 首页', disabled: ['pureText'] },
  { id: 2, name: 'app 净菜首页', disabled: ['pureText', 'goodsList'] },
  { id: 3, name: 'app 快递到家首页', disabled: ['pureText', 'ppvShop'] },
  { id: 4, name: 'app 爆品预售首页', disabled: ['pureText', 'ppvShop'] },
  { id: 5, name: '小程序 净菜首页', disabled: ['images', 'notice', 'pureText', 'secKill', 'makeGroup', 'goodsList', 'positionBall'] },
  { id: 6, name: '小程序 快递到家首页', disabled: ['images', 'notice', 'pureText', 'secKill', 'makeGroup', 'goodsRecommend', 'ppvShop', 'positionBall'] },
  { id: 7, name: '小程序 爆品预售首页', disabled: ['images', 'notice', 'pureText', 'secKill', 'makeGroup', 'goodsRecommend', 'ppvShop', 'positionBall'] }
]

export default config
