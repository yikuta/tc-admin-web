/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-17 09:49:25
 * @LastEditTime: 2020-10-21 19:09:09
 * @LastEditors: Please set LastEditors
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://10.10.31.180:8080"'
  // BASE_API: '"http://webapi-test.meiweigx.com"' // 测试环境外网地址
  // BASE_API: '"http://webapi-test.meiweigx.com:6880/"' // 测试环境外网地址
  // BASE_API: '"https://webapi-presz.meiweigx.com"' // 开发环境内网地址
  BASE_API: '"https://webapi-pre.meiweigx.com"' // 开发环境内网地址
  // BASE_API: '"http://webapi-dev.meiweigx.com"' // 开发环境外网地址ß
  // BASE_API: '"http://10.10.30.183:8080"' // 张乐
  // BASE_API: '"http://192.168.255.95:8080"' // 胡建
  // BASE_API: '"http://10.10.28.23:8080"'  // 王粒
  // BASE_API: '"http://192.168.255.152:8080"' // ymc
  // BASE_API: '"http://192.168.255.149:8080"' // 陈勇兵
  // BASE_API: '"http://192.168.255.145:8081/"' // 杨杰
  // BASE_API: '"http://192.168.255.94:8080"' // 李誉
  // BASE_API: '"http://10.10.31.90:8060"'
  // BASE_API: '"http://10.10.28.72:8080"' // 刘贵威
  // BASE_API: '"http://10.10.28.33:8080"' // 恋邱
  // BASE_API: '"http://192.168.255.203/"' // 刘小东
});
