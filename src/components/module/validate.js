/*
* 提交校验
* */
class Validate {
  constructor() {
    this.commonCheck = (lst, arr) => {
      // 通用验证，验证弹窗选择的东西
      let flag = true
      for (let i = 0; i < lst.length; i++) {
        let arrFlag = true // 内部的 flag
        arr.forEach(item => {
          // 需要验证的字段
          if (!lst[i][item]) {
            flag = false
          }
        })
        // 当 arrFlag 为 false 的时候终端循环，节约微不足道的性能
        if (!arrFlag) break
      }
      return flag
    }
    this.goodsCheck = (lst) => {
      let flag = true
      for (let i = 0; i < lst.length; i++) {
        if (!lst[i].id) {
          flag = false
          break
        }
      }
      return flag
    }
  }
  carousel(item) {
    // 验证图片轮播
    if (!item.config.interval) {
      // 如果时间为空，则设置为 3000
      item.config.interval = 3000
    }
    return this.commonCheck(item.content.list, ['typeId', 'image'])
  }
  images(item) {
    // 验证多图
    return this.commonCheck(item.content.list, ['typeId', 'image'])
  }
  vajra(item) {
    // 金刚区
    return this.commonCheck(item.content.list, ['typeId', 'image', 'title'])
  }
  notice(item) {
    // 公告
    if (!item.content.image) return false
    return this.commonCheck(item.content.list, ['typeId', 'title'])
  }
  pureText(item) {
    // 纯文本
    return item.content.title && item.content.content && item.content.image
  }
  secKill(item) {
    // 秒杀
    if (!item.config.interval) {
      // 如果时间为空，则设置为 3000
      item.config.interval = 3000
    }
    return true
  }
  makeGroup(item) {
    // 秒杀
    if (!item.config.interval) {
      // 如果时间为空，则设置为 3000
      item.config.interval = 3000
    }
    return true
  }
  goodsList(item) {
    // 商品列表
    return item.content.title && item.content.subTitle
  }
  goodsRecommend(item) {
    // 商品推荐
    if (!item.content.title || !item.content.subTitle) {
      return false
    }
    return this.goodsCheck(item.content.list)
  }
  ppvShop(item) {
    // 净菜门店
    return item.content.shopTitle && item.content.goodsTitle
  }
  positionBall(item) {
    // 悬浮球
    if (item.config.type === 'default') {
      return !!item.content.typeId
    } else {
      return true
    }
  }
}

export default Validate
