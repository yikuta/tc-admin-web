import request, { Method } from '@/utils/request'

export function fetchDownloadList(data) {
  return request({
    url: '/api/web/component/download/list',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}
