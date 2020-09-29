import request from '@/utils/request'

export function getProjectTitles() {
  return request({
    url: '/getProjectTitles',
    method: 'get'
  })
}
