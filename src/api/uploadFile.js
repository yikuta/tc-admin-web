/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-09-22 17:10:00
 * @LastEditors: Joker
 */
import request, { Method } from '@/utils/request'
import uploadRequest from '@/utils/uploadRequest'
/**
 * @description: 附件上传
 */
export const uploadFileRequest = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/component/attachment/uploadFile',
    method: Method.POST,
    data
  })
}

/**
 * @description: 附件删除
 */
export const deleteFileRequest = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: '/api/web/component/attachment/deleteFile',
    method: Method.POST,
    data
  })
}

/**
 * @description: 新附件上传
 */
export const uploadFileToOSS = formdata => {
  return uploadRequest({
    url: '/api/web/component/attachment/uploadFileToOSS',
    method: Method.POST,
    data: formdata
  })
}

/**
 * @description: 获取文件地址
 */
export const getFileUrl = params => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/component/attachment/getFileUrl/${params}`,
    method: Method.GET
  })
}
