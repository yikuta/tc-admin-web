<template>
    <div class="explain-cms">
      <el-tabs tab-position="left">
        <el-tab-pane v-for="(item, index) in tableData" :label="item.name" :key="index">
          <el-collapse>
            <!-- 固定内容 -->
            <el-collapse-item v-for="(sys, j) in baseData" :title="`${sys.title}。值：${baseConfigList[index] && baseConfigList[index][sys.key]}`" :name="`a-${index}-${j}`" :key="j">
              <el-card>
                <div class="padding-left text-seat">{{ sys.txt || '无' }}</div>
                <div class="padding-left" v-if="sys.children && sys.children.length">
                  <template v-for="(child, k) in sys.children">
                    <p v-if="!child.children || !child.children.length" :key="k">{{ child.title }}</p>
                    <el-collapse-item v-if="child.children && child.children.length" :title="child.title" :key="k" :name="`a-${index}-${j}-${k}`">
                      <el-card>
                        <div class="padding-left text-seat">{{ child.txt || '无' }}</div>
                      </el-card>
                    </el-collapse-item>
                  </template>
                </div>
              </el-card>
            </el-collapse-item>
            <!-- 固定内容结束 -->
            <collapse-item :item="item.data"></collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import config from '@/components/module/config.js'
  export default {
    name: 'CMS',
    components: {
      CollapseItem: resolve => {
        return require(['./templates/collapse-item.vue'], resolve)
      }
    },
    data() {
      return {
        baseData: [
          { key: 'id', title: 'id:Boolean', txt: '每一个 id 对应一个组件，可用于判断当前组件类型' },
          { key: 'name', title: 'name:String：名称', txt: '组件名称，可用于判断当前组件类型' },
          { key: 'enName', title: 'enName:String：英文名称', txt: '组件的英文名称，可用于判断当前组件类型' },
          { key: 'systemConfig', title: 'systemConfig:Object：组件系统配置信息', txt: '用于设置中台 CMS 组件功能，这个对象是给后台用的', children: [
            { key: 'num', title: 'num:Number：组件在一个页面中可以存在的总数', txt: '' },
            { key: 'related', title: 'related:Array：存储值为组件的英文名称，用于判断是否与某一个组件只能同时存在一个，当有值为 A 时，对应的 A 组件的 related 中也应该有当前组件项的英文名称', txt: '' },
            { key: 'type', title: 'type:Array：组件在对应页面是否可用，index 表示首页，special 表示专题页', txt: '' },
            { key: 'push', title: 'push:String：组件插入的位置，start 表示开始，end 表示结尾', txt: '' },
            { key: 'sort', title: 'sort:Boolean：当前组件模块是否可以拖动', txt: '' },
            { key: 'border', title: 'border:Boolean：是否显示边框 选中或 hover 的时候', txt: '' }
          ]
          }
        ],
        dialogData: [
          { key: 'typeId', title: 'typeId:String：类型 id', txt: '当前选择的弹窗类型的 id，当页面不可跳转时，默认不做任何操作', children: [
            { key: '', title: '1：常用，跳转到指定页面', txt: '' },
            { key: '', title: '2：商品，指定的商品', txt: '' },
            { key: '', title: '3：分类，跳转到指定的分类筛选页面', txt: '' },
            { key: '', title: '4：店铺，跳转指定的店铺', txt: '' },
            { key: '', title: '5：专题，跳转指定的专题', txt: '' },
            { key: '', title: '6：自定义，自定义跳转链接', txt: '' }
          ]
          },
          { key: 'typeName', title: 'typeName:String：类型名称', txt: '' },
          { key: 'image', title: 'image:String：头部图片', txt: '' },
          { key: 'content', title: 'content:Object：类型名称', txt: '', children: [
            { key: 'pageId', title: 'pageId:String：跳转页面类型 id', txt: 'typeId：1', children: [
              { key: '', title: '1：跳转首页', txt: '' },
              { key: '', title: '2：净菜首页', txt: '' },
              { key: '', title: '3：快递到家首页', txt: '' },
              { key: '', title: '4：爆品预售首页', txt: '' },
              { key: '', title: '5：领券中心', txt: '' }
            ]
            },
            { key: 'goodsTypeId', title: 'goodsTypeId:Number：商品的类型', txt: 'typeId：2', children: [
              { key: '', title: '1：快递到家', txt: '' },
              { key: '', title: '2：爆品预售', txt: '' },
              { key: '', title: '4：净菜', txt: '' }
            ]
            },
            { key: 'goodsId', title: 'goodsId:Number：商品的 id', txt: 'typeId: 2' },
            { key: 'serviceId', title: 'serviceId:Number：业务类型 id', txt: 'typeId：3', children: [
              { key: '', title: '1：快递到家', txt: '' },
              { key: '', title: '2：爆品预售', txt: '' },
              { key: '', title: '4：净菜', txt: '' }
            ]
            },
            { key: 'classifyId', title: 'classifyId:Number：分类 id', txt: 'typeId：3' },
            { key: 'shopCode', title: 'shopCode:Number：店铺的 id', txt: 'typeId：4' },
            { key: 'specialId', title: 'specialId:Number：专题页面的 id', txt: 'typeId：5' },
            { key: 'platformId', title: 'platformId:Number：平台的 id', txt: 'typeId：6', children: [
              { key: '', title: '1：全部', txt: '' },
              { key: '', title: '2：天呈生活 APP', txt: '' },
              { key: '', title: '3：天呈净菜小程序', txt: '' },
              { key: '', title: '4：天呈生活小程序', txt: '' }
            ]
            },
            { key: 'platformLink', title: 'platformLink:String：平台的对应的链接', txt: 'typeId：6' },
            { key: 'baseData', title: 'baseData:Object：缓存商品信息暂时不用管', txt: '' }
          ]
          }
        ],
        baseConfigList: []
      }
    },
    created() {
      // 一定要注意组件的顺序
      config.forEach(value => {
        this.baseConfigList = this.baseConfigList.concat(value.list)
      })
      this.tableData = [
        {
          name: '图片轮播',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'direction', title: 'direction:String：轮播的方向，默认 horizontal。horizontal 向左，vertical 向上', txt: '' },
              { key: 'indicatorPosition', title: 'indicatorPosition:String：指示器的位置，默认 left。left 左，center 中，right 右', txt: '' },
              { key: 'indicatorType', title: 'indicatorType:String：指示器样式，默认不显示。number 显示数字，round 显示圆点', txt: '' },
              { key: 'interval', title: 'interval:String | Number:轮播周期，默认 3000', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'list', title: 'list:Array：列表', txt: '内容列表，通常是配置的跳转项。typeId 为 2 的时候需要后端处理商品数据', children: this.dialogData }
            ]
            }
          ]
        },
        {
          name: '多图',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'display', title: 'display:String：展示形式，固定值 static', txt: '' },
              { key: 'flex', title: 'flex:Number：每行展示的数量，默认 4', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'list', title: 'list:Array：列表', txt: '内容列表，通常是配置的跳转项。typeId 为 2 的时候需要后端处理商品数据', children: this.dialogData }
            ]
            }
          ]
        },
        {
          name: '金刚区',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'line', title: 'line:Number：展示行数，默认 1', txt: '' },
              { key: 'flex', title: 'flex:Number：每行展示的数量，默认 4', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'list', title: 'list:Array：列表', txt: '内容列表，通常是配置的跳转项。typeId 为 2 的时候需要后端处理商品数据', children: this.dialogData }
            ]
            }
          ]
        },
        {
          name: '公告',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'line', title: 'line:Number：展示行数，默认 1', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'list', title: 'list:Array：列表', txt: '内容列表，通常是配置的跳转项。typeId 为 2 的时候需要后端处理商品数据', children: this.dialogData }
            ]
            }
          ]
        },
        {
          name: '纯文本',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'titleSize', title: 'titleSize:Number：标题字体大小，默认 14', txt: '' },
              { key: 'align', title: 'titleSize:Number：标题位置，默认 left。left 左，center 中，right 右', txt: '' },
              { key: 'contentSize', title: 'contentSize:Number：字体大小，默认 14', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'title', title: 'title:String：标题', txt: '标题文字' },
              { key: 'content', title: 'content:String：正文', txt: '正文内容' },
              { key: 'image', title: 'image:String：标题', txt: '背景图，建议图片尺寸宽度150×150，支持类型：jpg、png。' }
            ]
            }
          ]
        },
        {
          name: '秒杀',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'countDown', title: 'countDown:Boolean：是否显示倒计时，默认 false', txt: '' },
              { key: 'flex', title: 'flex:Number：每行展示的数量，默认 3', txt: '' },
              { key: 'direction', title: 'direction:String：轮播方向，默认 horizontal。horizontal 向左，vertical 向上', txt: '' },
              { key: 'interval', title: 'interval:String | Number：轮播周期，默认 3000 毫秒', txt: '' }
            ]
            }
          ]
        },
        {
          name: '拼团',
          data: [
            { key: 'config', title: 'config:Object 组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'flex', title: 'flex:Number：每行展示的数量，默认 3', txt: '' },
              { key: 'direction', title: 'direction:String：轮播方向，默认 horizontal。horizontal 向左，vertical 向上', txt: '' },
              { key: 'interval', title: 'interval:String | Number：轮播周期，默认 3000 毫秒', txt: '' }
            ]
            }
          ]
        },
        {
          name: '商品列表',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'dataSources', title: 'dataSources:Object：数据来源', txt: '数据来源信息配置', children: [
                { key: 'dataType', title: 'dataType:Boolean：数据来源类型', txt: '数据来源类型', children: [
                  { key: '' }
                ]
                }
              ]
              },
              { key: 'display', title: 'display:String：展示形式，默认 flex。flex 平铺，block 列表', txt: '' },
              { key: 'displayButton', title: 'displayButton:Boolean：展示形式切换按钮，默认 true', txt: '' },
              { key: 'sort', title: 'sort:String：排列方式，默认为空。sale 销量，price 价格', txt: '' },
              { key: 'sortButton', title: 'sortButton:Boolean：排列方式切换按钮', txt: '' },
              { key: 'goods', title: 'goods:Object：商品信息展示', txt: '选择需要展示的对应的商品信息', children: [
                { key: 'title', title: 'title:Boolean：是否显示标题，默认 true', txt: '' },
                { key: 'subTitle', title: 'subTitle:Boolean：是否显示副标题，默认 true', txt: '' },
                { key: 'estimateTime', title: 'estimateTime:Boolean：是否显示预计到货时间，默认 true', txt: '' },
                { key: 'salePrice', title: 'salePrice:Boolean：是否显示当前售价，默认 true', txt: '' },
                { key: 'marketPrice', title: 'marketPrice:Boolean：是否显示市场售价，默认 true', txt: '' },
                { key: 'sales', title: 'sales:Boolean：是否显示30天销量，默认 true', txt: '' }
              ]
              },
              { key: 'tags', title: 'tags:Object：展示标签', txt: '选择需要展示的标签', children: [
                { key: 'service', title: 'service:Boolean：是否展示业务标签，默认true', txt: '' },
                { key: 'group', title: 'group:Boolean：是否展示拼团标签，默认true', txt: '' },
                { key: 'coupon', title: 'coupon:Boolean：是否展示领券标签，默认true', txt: '' },
                { key: 'secKill', title: 'secKill:Boolean：是否展示秒杀标签，默认true', txt: '' }
              ]
              }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'title', title: 'title:String：标题', txt: '' },
              { key: 'subTitle', title: 'subTitle:String：副标题', txt: '' }
            ]
            }
          ]
        },
        {
          name: '商品推荐（后）',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'flex', title: 'flex:Number：每行展示的数量，默认 3', txt: '' },
              { key: 'direction', title: 'direction:String：轮播的方向，默认 horizontal。horizontal 向左，vertical 向上', txt: '' },
              { key: 'interval', title: 'interval:String | Number:轮播周期，默认 3000', txt: '' }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'title', title: 'title:String：标题', txt: '' },
              { key: 'subTitle', title: 'subTitle:String：副标题', txt: '' },
              { key: 'list', title: 'list:Array：商品列表', txt: '最多添加12个商品，建议选择商品数量为每行展示商品数量的整数倍，需要后台处理商品数据', children: [
                { key: 'id', title: 'id:Number：商品 id', txt: '' },
                { key: 'goodsTypeId', title: 'goodsTypeId:Number：商品类型，用于页面跳转判断', txt: '', children: [
                  { key: '', title: '1：快递到家', txt: '' },
                  { key: '', title: '2：爆品预售', txt: '' },
                  { key: '', title: '3：净菜', txt: '' }
                ]
                },
                { key: 'name', title: 'name:String：商品的标题名称', txt: '' },
                { key: 'marketPrice', title: 'marketPrice:Number：商品的市场价格', txt: '' },
                { key: 'salePrice', title: 'salePrice:Number：商品的销售价格', txt: '' },
                { key: 'image', title: 'image:String：商品的图片', txt: '' }
              ]
              }
            ]
            }
          ]
        },
        {
          name: '净菜门店',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'shop', title: 'shop:Object：门店的配置信息', txt: '门店列表的配置信息', children: [
                { key: 'sort', title: 'sort:String：排序，默认 sale。sale 销量，distance 距离', txt: '' },
                { key: 'title', title: 'title:Boolean：是否显示标题，默认 true', txt: '' },
                { key: 'openTime', title: 'openTime:Boolean：是否显示营业时间，默认 true', txt: '' },
                { key: 'distribution', title: 'distribution:Boolean：是否显示配送，默认 true', txt: '' },
                { key: 'coupon', title: 'coupon:Boolean：是否显示优惠券，默认 true', txt: '' },
                { key: 'distance', title: 'distance:Boolean：是否显示距离，默认 true', txt: '' },
                { key: 'hotTag', title: 'hotTag:Boolean：是否显示热卖标签，默认 true', txt: '' },
                { key: 'brandTag', title: 'brandTag:Boolean：是否显示品牌标签，默认 true', txt: '' },
                { key: 'specialTag', title: 'specialTag:Boolean：是否显示特色标签，默认 true', txt: '' },
                { key: 'shopGoods', title: 'shopGoods:Boolean：是否显示门店商品，默认 true', txt: '' },
                { key: 'shopGoodsName', title: 'shopGoodsName:Boolean：是否显示门店商品名称，默认 true', txt: '' },
                { key: 'shopGoodsSalePrice', title: 'shopGoodsSalePrice:Boolean：是否显示门店商品售价，默认 true', txt: '' },
                { key: 'shopGoodsMarketPrice', title: 'shopGoodsMarketPrice:Boolean：是否显示市场价，默认 true', txt: '' }
              ]
              },
              { key: 'goods', title: 'goods:Object：特色净菜配置信息', txt: '门店列表的 tab 特色净菜信息', children: [
                { key: 'title', title: 'title:Boolean：是否显示标题，默认 true', txt: '' },
                { key: 'subTitle', title: 'subTitle:Boolean：是否显示副标题，默认 true', txt: '' },
                { key: 'estimateTime', title: 'estimateTime:Boolean：是否显示预计到货时间，默认 true', txt: '' },
                { key: 'salePrice', title: 'salePrice:Boolean：是否显示当前售价，默认 true', txt: '' },
                { key: 'marketPrice', title: 'marketPrice:Boolean：是否显示市场售价，默认 true', txt: '' },
                { key: 'sales', title: 'sales:Boolean：是否显示30天销量，默认 true', txt: '' },
                { key: 'shopBanner', title: 'shopBanner:Boolean：是否显示店招，默认 true', txt: '' },
                { key: 'shopName', title: 'shopName:Boolean：是否显示店铺名称，默认 true', txt: '' },
                { key: 'openTime', title: 'openTime:Boolean：是否显示营业时间，默认 true', txt: '' },
                { key: 'shopRelated', title: 'shopRelated:Boolean：是否显示相关门店，默认 true', txt: '' }
              ]
              }
            ]
            },
            { key: 'content', title: 'content:Object：组件的内容', txt: '组件需要显示的内容，用于客户端', children: [
              { key: 'shopTitle', title: 'shopTitle:String：门店标题，默认 附近门店', txt: '门店标题' },
              { key: 'goodsTitle', title: 'goodsTitle:String：商品列表标题，默认 特色净菜', txt: '商品列表标题' }
            ]
            }
          ]
        },
        {
          name: '悬浮球',
          data: [
            { key: 'config', title: 'config:Object：组件的配置信息', txt: '组件的基础配置信息，用于客户端', children: [
              { key: 'type', title: 'type:String：默认 cart。cart 购物车，top 回到顶部，default 自定义', txt: '' },
              { key: 'default', title: 'default:Object：自定义参数，当 type 为 default 的时候使用', txt: '', children: [
                { key: 'image', title: 'image:String：自定义图片', txt: '' },
                { key: 'url', title: 'url:String：跳转的链接', txt: '' }
              ]
              }
            ]
            }
          ]
        },
        {
          name: '其他说明',
          data: [
            { key: 'setSystemConfigIos/setSystemConfigAndroid', title: 'setSystemConfigIos/setSystemConfigAndroid:function：配置组件需要信息', txt: '这个方法给 android 或 ios 使用。', children: [
              { key: 'cityCode', title: 'cityCode:String：城市 code', txt: '' },
              { key: 'latitude', title: 'latitude:String：纬度', txt: '' },
              { key: 'longitude', title: 'longitude:String 经度', txt: '' },
              { key: 'device', title: 'device:String：设备信息', txt: '参数分别为：lifeapp、ppvapp、lifemini、ppvmini' },
              { key: 'token', title: 'token:String：登陆 token', txt: '' }
            ]
            }
          ]
        },
        {
          name: '接口方法调用说明',
          data: [
            { key: '方法交互', title: 'h5页面调用 app 方法', txt: '从 h5 页面调用 app 中的方法，IOS 方法：window.webkit.messageHandlers.FUNCTION.postMessage(params)，Android 调用方法：window.android.FUNCTION(params)，FUNCTION 即对应的列表中的方法', children: [
              { key: 'goIndex', title: 'goIndex: Function：页面跳转，参数：({id})', txt: '', children: [
                { key: '', title: '1：跳转首页', txt: '' },
                { key: '', title: '2：净菜首页', txt: '' },
                { key: '', title: '3：快递到家首页', txt: '' },
                { key: '', title: '4：爆品预售首页', txt: '' },
                { key: '', title: '5：领券中心', txt: '' }
              ]
              },
              { key: 'goGoodsDetail', title: 'goGoodsDetail:Function：商品详情，参数：({goodsId, goodsType})', txt: 'goodsType 可用参数：[1, 2, 4]', children: [
                { key: 'goodsType', title: '1：快递到家', txt: '' },
                { key: 'goodsType', title: '2：爆品预售', txt: '' },
                { key: 'goodsType', title: '4：净菜', txt: '' }
              ]
              },
              { key: 'goGoodsCate', title: 'goGoodsCate: Function：商品分类，参数：({serviceId, classifyId})', txt: 'serviceId 可用参数：[1, 2, 4]，classifyId 为分类 id 数组', children: [
                { key: '', title: '1：快递到家', txt: '' },
                { key: '', title: '2：爆品预售', txt: '' },
                { key: '', title: '3：净菜', txt: '' }
              ]
              },
              { key: 'goStore', title: 'goStore: Function：跳转店铺，参数：({storeId})', txt: '' },
              { key: 'goSpecial', title: 'goSpecial: Function：跳转店铺，参数：({specialId})', txt: '' },
              { key: 'goDefaultLink', title: 'goDefaultLink: Function：跳转默认链接，参数：({platformType, link})', txt: 'platformType 可用参数：[2, 3, 4]', children: [
                { title: '2：天呈生活APP', txt: '' },
                { title: '3：天呈净菜小程序', txt: '' },
                { title: '4：天呈生活小程序', txt: '' }
              ]
              },
              { key: 'goSecKillMore', title: 'goSecKillMore: Function：跳转到更多秒杀页面', txt: '' },
              { key: 'goCart', title: 'goCart: Function：跳转到购物车', txt: '' },
              { key: 'goNearByStore', title: 'goNearByStore: Function：附近门店', txt: '' },
              { key: 'showToast', title: 'showToast: Function：调用 app 弹窗，参数（{text}）', txt: '' }
            ]
            }
          ]
        }
      ]
    }
  }
</script>

<style scoped lang="scss">
@import '../../components/module/style/common';
</style>
