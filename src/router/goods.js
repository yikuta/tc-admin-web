/* Layout */
import Layout from '@/pages/layout/Layout'

const goods = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/baseGoods',
  name: 'goods',
  meta: { title: '商品管理', icon: 'product' },
  auth: 'GOODS_MANAGE',
  alwaysPermission: false,
  children: [
    {
      path: '/goods/baseGoods',
      redirect: '/goods/baseGoods/index',
      name: 'baseGoodsManage',
      component: () => import('@/pages/layout/child'),
      meta: { title: '基础商品', icon: '' },
      auth: 'BASE_GOODS_MANAGE',
      children: [
        {
          path: 'index',
          name: 'baseGoods',
          component: () => import('@/pages/goods/base-goods/list'),
          meta: { title: '基础商品', icon: '' },
          auth: 'BASE_GOODS_PAGE'
        },
        {
          path: 'publish',
          name: 'addBaseGoods',
          hidden: true,
          component: () => import('@/pages/goods/base-goods/publishGood'),
          meta: { title: '发布基础商品', icon: '', noCache: true },
          auth: 'BASE_GOODS_ADD'
        },
        {
          path: 'update/:id',
          name: 'updateBaseGoods',
          hidden: true,
          component: () => import('@/pages/goods/base-goods/publishGood'),
          meta: { title: '编辑商品', icon: '', noCache: true },
          auth: 'BASE_GOODS_EDIT'
        },
        {
          path: 'fastPublish',
          name: 'addBaseGoodsFast',
          hidden: true,
          component: () => import('@/pages/goods/base-goods/fast-goods-publish'),
          meta: { title: '快速添加', icon: '', noCache: true },
          auth: 'BASE_GOODS_FAST_ADD'
        },
        {
          path: 'log/:id',
          name: 'baseGoodsLog',
          component: () => import('@/pages/goods/base-goods/baseGoodsLog'),
          meta: { title: '操作日志', icon: '', noCache: true },
          auth: 'COMMON_OPERATE_LOG',
          hidden: true
        },
        {
          path: 'detail',
          name: 'baseGoodsDetail',
          component: () => import('@/pages/goods/base-goods/baseGoodsDetail'),
          meta: { title: '商品详情', icon: '', noCache: true },
          hidden: true
        },
        {
          path: 'store',
          name: 'storeManage',
          component: () => import('@/pages/goods/base-goods/storeManage'),
          meta: { title: '库存管理', icon: '' },
          auth: 'BASE_GOODS_STOCK',
          hidden: true
        }
      ]
    },
    {
      path: '/goods/mallGoods',
      name: 'mallGoods',
      component: () => import('@/pages/goods/mall-goods/index'),
      redirect: '/goods/mallGoods/list',
      meta: { title: '快递到家商品', icon: '' },
      auth: 'MALL_GOODS',
      children: [
        {
          path: 'list',
          name: 'mallGoodsList',
          component: () => import('@/pages/goods/mall-goods/mallGoodsList'),
          meta: { title: '商品列表', icon: '' },
          auth: 'CHANNEL_GOODS_MANAGE'
        },
        {
          path: 'publishMallGoods',
          name: 'publishMallGoods',
          component: () => import('@/pages/goods/mall-goods/publishGoods'),
          meta: { title: '发布商城商品' },
          auth: 'CHANNEL_GOODS_ADD',
          hidden: true
        },
        {
          path: 'publishGoodMeal',
          name: 'publishGoodMeal',
          component: () => import('@/pages/goods/mall-goods/publishGoodMeal/index'),
          meta: { title: '发布商城套餐' },
          auth: 'CHANNEL_GOODS_PUBLISH',
          hidden: true
        },
        {
          path: 'moduleForm',
          name: 'mallModuleForm',
          component: () => import('@/pages/goods/mall-goods/moduleForm'),
          meta: { title: '添加模块', noCache: true },
          auth: 'MODULE_GOODS_ADD',
          hidden: true
        },
        {
          path: 'moduleForm/:id',
          name: 'mallModuleFormEdit',
          component: () => import('@/pages/goods/mall-goods/moduleForm'),
          meta: { title: '编辑模块', noCache: true },
          auth: 'MODULE_GOODS_EDIT',
          hidden: true
        },
        {
          path: 'commonModule',
          name: 'mallCommonModule',
          component: () => import('@/pages/goods/mall-goods/commonModule'),
          meta: { title: '商详通用设置', noCache: true },
          auth: 'MODULE_GOODS_MANAGE'
        },
        {
          path: 'log',
          name: 'mallGoodsLog',
          component: () => import('@/pages/goods/mall-goods/mallGoodsLog'),
          meta: { title: '操作日志', icon: '' },
          hidden: true
        },
        {
          path: 'showClassify',
          name: 'showClassifyMall',
          component: () => import('@/pages/goods/classify-mall/index'),
          meta: { title: '前端展示分类', icon: '' },
          auth: 'CHANNEL_CATE_SUB_MANAGE'
        }
        // {
        //   path: '/goods/showClassify',
        //   redirect: '/goods/showClassify/classifyMall/index',
        //   name: 'showClassify',
        //   component: () => import('@/pages/layout/child'),
        //   meta: { title: '展示分类', icon: '' },
        //   children: [
        //     {
        //       path: 'index',
        //       name: 'showClassifyMall',
        //       component: () => import('@/pages/goods/classify-mall/index'),
        //       meta: { title: '展示分类', icon: '' },
        //       auth: 'CHANNEL_CATE_SUB_LIST'
        //     }
        //   ]
        // }
        // {
        //   path: 'detail/:id',
        //   name: 'baseGoodsDetail',
        //   component: () => import('@/pages/goods/base-goods/baseGoodsDetail'),
        //   meta: { title: '商品详情', icon: '' },
        //   hidden: true
        // }
      ]
    },
    {
      path: '/goods/assembleGoods',
      name: 'childLayout',
      component: () => import('@/pages/layout/child'),
      redirect: '/goods/assembleGoods/list',
      meta: { title: '社区团购商品', icon: '' },
      auth: 'GROUP_GOODS',
      children: [
        {
          path: 'businessCity',
          name: 'businessCity',
          component: () => import('@/pages/goods/assemble-goods/businessCity'),
          meta: { title: '业务城市', icon: '' },
          auth: 'GROUP_BIZCITY_MANAGE'
        },
        {
          path: 'list',
          name: 'assembleGoodsList',
          component: () => import('@/pages/goods/assemble-goods/assembleGoodsList'),
          meta: { title: '团购商品', icon: '' },
          auth: 'PT_CHANNEL_GOODS_MANAGE'
        },
        {
          path: 'activityList',
          name: 'assembleActivityList',
          component: () => import('@/pages/goods/assemble-goods/assembleActivityList'),
          meta: { title: '团购活动管理', icon: '' },
          auth: 'GROUP_ACTIVITY_MANAGE'
        },
        {
          path: 'moduleForm',
          name: 'assembleModuleForm',
          component: () => import('@/pages/goods/assemble-goods/moduleForm'),
          meta: { title: '添加模块', noCache: true },
          hidden: true,
          auth: 'PT_MODULE_GOODS_ADD'
        },
        {
          path: 'moduleForm/:id',
          name: 'assembleModuleFormEdit',
          component: () => import('@/pages/goods/assemble-goods/moduleForm'),
          meta: { title: '编辑模块', noCache: true },
          hidden: true,
          auth: 'PT_MODULE_GOODS_EDIT'
        },
        {
          path: 'commonModule',
          name: 'assembleCommonModule',
          component: () => import('@/pages/goods/assemble-goods/commonModule'),
          meta: { title: '商详通用设置', noCache: true },
          auth: 'PT_MODULE_GOODS_MANAGE'
        },
        {
          path: 'log',
          name: 'assembleGoodsLog',
          component: () => import('@/pages/goods/assemble-goods/assembleGoodsLog'),
          meta: { title: '商品操作日志', icon: '' },
          hidden: true
        },
        {
          path: 'activityLog',
          name: 'assembleActivityLog',
          component: () => import('@/pages/goods/assemble-goods/assembleActivityLog'),
          meta: { title: '活动操作日志', icon: '' },
          hidden: true
        },
        {
          path: 'publishAssembleGoods',
          name: 'publishAssembleGoods',
          component: () => import('@/pages/goods/assemble-goods/publishGoods'),
          meta: { title: '发布拼团商品' },
          hidden: true,
          auth: 'PT_CHANNEL_GOODS_ADD'
        },
        {
          path: 'publishAssembleBundle',
          name: 'publishAssembleBundle',
          component: () => import('@/pages/goods/assemble-goods/publishBundle'),
          meta: { title: '发布拼团套餐' },
          hidden: true,
          auth: 'PT_CHANNEL_GOODS_PUBLISH'
        },
        {
          path: 'publishAssembleActivity',
          name: 'publishAssembleActivity',
          component: () => import('@/pages/goods/assemble-goods/publishActivity'),
          meta: { title: '发布拼团活动' },
          hidden: true,
          auth: 'GROUP_ACTIVITY_ADD'
        },
        {
          path: 'assembleActivityDetail',
          name: 'assembleActivityDetail',
          component: () => import('@/pages/goods/assemble-goods/assembleActivityDetail'),
          meta: { title: '拼团活动详情' },
          hidden: true,
          auth: 'GROUP_ACTIVITY_FIND'
        },
        {
          path: 'showClassify',
          name: 'assembleGoodShowClassify',
          component: () => import('@/pages/goods/assemble-goods/classify-mall/index'),
          meta: { title: '前端展示分类', icon: '' },
          auth: 'PT_CHANNEL_CATE_SUB_MANAGE'
        }
      ]
    },
    {
      path: '/goods/supplyGoods',
      name: 'supplyGoods',
      component: () => import('@/pages/goods/supply-goods/index'),
      redirect: '/goods/supplyGoods/list',
      meta: { title: '商家采购商品', icon: '' },
      auth: 'GYS_CHANNER_GOODS_MANAGE',
      children: [
        {
          path: 'list',
          name: 'supplyGoodsList',
          component: () => import('@/pages/goods/supply-goods/supplyGoodsList'),
          meta: { title: '商品列表', icon: '' },
          auth: 'GYS_CHANNEL_GOODS_MANAGE'
        },
        {
          path: 'publishSupplyGoods',
          name: 'publishSupplyGoods',
          component: () => import('@/pages/goods/supply-goods/publishGoods'),
          meta: { title: '发布供应商品' },
          hidden: true,
          auth: 'GYS_CHANNEL_GOODS_ADD'
        },
        {
          path: 'moduleForm',
          name: 'supplyModuleForm',
          component: () => import('@/pages/goods/supply-goods/moduleForm'),
          meta: { title: '添加模块', noCache: true },
          hidden: true,
          auth: 'GYS_MODULE_GOODS_ADD'
        },
        {
          path: 'moduleForm/:id',
          name: 'supplyModuleFormEdit',
          component: () => import('@/pages/goods/supply-goods/moduleForm'),
          meta: { title: '编辑模块', noCache: true },
          hidden: true,
          auth: 'GYS_MODULE_GOODS_EDIT'
        },
        {
          path: 'commonModule',
          name: 'supplyCommonModule',
          component: () => import('@/pages/goods/supply-goods/commonModule'),
          meta: { title: '商详通用设置', noCache: true },
          auth: 'GYS_MODULE_GOODS_MANAGE'
        },
        {
          path: 'supplyGoodsPreview',
          name: 'supplyGoodsPreview',
          component: () => import('@/pages/goods/supply-goods/supplyGoodsPreview'),
          meta: { title: '商品预览', noCache: true },
          hidden: true
        },
        {
          path: 'log',
          name: 'supplyGoodsLog',
          component: () => import('@/pages/goods/supply-goods/supplyGoodsLog'),
          meta: { title: '操作日志', icon: '' },
          hidden: true
        },
        {
          path: 'showClassify',
          name: 'supplyGoodShowClassify',
          component: () => import('@/pages/goods/supply-goods/classify-mall/index'),
          meta: { title: '前端展示分类', icon: '' },
          auth: 'GYS_CHANNEL_CATE_SUB_MANAGE'
        }
        // {
        //   path: 'detail/:id',
        //   name: 'baseGoodsDetail',
        //   component: () => import('@/pages/goods/base-goods/baseGoodsDetail'),
        //   meta: { title: '商品详情', icon: '' },
        //   hidden: true
        // }
      ]
    },
    {
      path: '/goods/propertyMange',
      name: 'propertyMange',
      component: () => import('@/pages/goods/property-manage/index'),
      redirect: '/goods/propertyMange/category',
      meta: { title: '属性管理', icon: '' },
      auth: 'PROPERTY_MANAGE',
      children: [
        {
          path: 'category',
          name: 'categoryManage',
          component: () => import('@/pages/goods/property-manage/category/list'),
          meta: { title: '基础分类', icon: '' },
          auth: 'CATEGORY_MANAGE'
        },
        {
          path: 'category/params',
          name: 'categoryParams',
          hidden: true,
          component: () => import('@/pages/goods/property-manage/category/params-set'),
          meta: { title: '参数设置', icon: '' }
        },
        {
          path: 'category/specs',
          name: 'categorySpecs',
          hidden: true,
          component: () => import('@/pages/goods/property-manage/category/specs-set'),
          meta: { title: '规格设置', icon: '' }
        },
        {
          path: 'params',
          name: 'paramsManage',
          component: () => import('@/pages/goods/property-manage/params/list'),
          meta: { title: '参数管理', icon: '' },
          auth: 'PARAM_OPTION_MANAGE'
        },
        {
          path: 'params/publish',
          name: 'paramsPublish',
          hidden: true,
          component: () => import('@/pages/goods/property-manage/params/paramsPublish'),
          meta: { title: '参数操作', icon: '' }
        },
        // {
        //   path: 'params/publish/:id',
        //   name: 'paramsPublishEdit',
        //   hidden: true,
        //   component: () => import('@/pages/goods/property-manage/params/paramsPublish'),
        //   meta: { title: '参数编辑', icon: '' }
        // },
        {
          path: 'specs',
          name: 'specsManage',
          component: () => import('@/pages/goods/property-manage/specs/list'),
          meta: { title: '规格管理', icon: '' },
          auth: 'BASE_SPEC_MANAGE'
        },
        {
          path: 'specs/publish',
          name: 'specsPublish',
          hidden: true,
          component: () => import('@/pages/goods/property-manage/specs/specsPublish'),
          meta: { title: '规格操作', icon: '' }
        }
        // {
        //   path: 'specs/publish/:id',
        //   name: 'specsPublishEdit',
        //   hidden: true,
        //   component: () => import('@/pages/goods/property-manage/specs/specsPublish'),
        //   meta: { title: '规格编辑', icon: '' }
        // }
      ]
    }
  ]
}
export default goods
