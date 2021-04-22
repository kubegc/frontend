import request from '@/utils/request'

export function createResource(data) {
  return request({
    url: '/kube/createOrUpdateResource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: '/kube/updateResource',
    method: 'post',
    data
  })
}

export function deleteResource(data) {
  return request({
    url: '/kube/deleteResource',
    method: 'post',
    data
  })
}

export function getResource(params) {
  return request({
    url: '/kube/getResource',
    type: 'get',
    params
  })
}

export function listResources(data) {
  return request({
    url: '/kube/listResources',
    method: 'post',
    data
  })
}

export function getScreen(params) {
  return request({
    url: '/echart/getScreen',
    type: 'get',
    params
  })
}

export function getScheduleData(data) {
  return request({
    url: 'mcmf/solveBase',
    method: 'post',
    data
  })
}

