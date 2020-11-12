import request, { Method } from '@/utils/request'

export function mockData() {
  return request({
    url: '/post',
    method: Method.GET,
    data: {
      id: 1
    }
  })
}
export function mockInfoData() {
  return request({
    url: '/info',
    method: Method.GET,
    data: {
      id: 1
    }
  })
}
