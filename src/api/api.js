import { get } from '../config/RequestConfig'
import request from '@/utils/request'

export function getUserList(data) {
  return get('/pipelineItems')
}

export function getBuildConfigsAPI(data) {
  request({
    url: '/user/getBuildConfigs',
    method: 'post',
    data
  })
}

export function getProductInfo(payload) {
  return request({
    url: '/user/getProductInfo',
    method: 'get',
    params: payload
  })
}


