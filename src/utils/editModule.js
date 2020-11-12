// 生成 html 模块
export class GenerateHtml {
  constructor() {
    this.name = 'generateHtml'
  }
  title(item) {
    // 标题
    return `<div style="padding:${item.padding}px 0;text-align:${item.align};background-color:${item.background};color:${item.textColor};">${item.value}</div>`
  }
  editor(item) {
    // 富文本
    return `<div style="padding:${item.padding}px 0"><div>${item.value}</div></div>`
  }
  divider(item) {
    // 分割线
    return `<div style="height:1px;width:100%;background:#DCDFE6;margin:${item.padding}px 0;"></div>`
  }
  blank(item) {
    // 辅助空白
    return `<div style="height:${item.height}px;width:100%;background:#fff;"></div>`
  }
  video(item) {
    // 视频
    return `<div style="padding:${item.padding}px 0;"><video width="100%" height="400" poster="${item.imageSrc}" controls><source src="${item.videoSrc}" type="video/mp4"><source src="${item.videoSrc}" type="video/ogg"></video></div>`
  }
}
