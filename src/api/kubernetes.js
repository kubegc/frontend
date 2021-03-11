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

export function getMeta(params) {
  return request({
    url: '/kube/getMeta',
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

export function getKinds(data) {
  var res = request({
    url: 'atomic/getKinds',
    method: 'get',
    params: data
  })
  return res
}

export function getJsonData(data) {
  var res = request({
    url: 'res/query',
    method: 'get',
    params: data
  })
  return res
}

export function queryTest(data) {
  var res = request({
    url: 'http://39.106.40.190:31100/dos-lab/crosscloud/execRequest',
    method: 'post',
    data
  })
  return res
}

export function diffResource(data) {
  var res = request({
    url: '/kube/diffResource',
    method: 'post',
    data
  })
  return res
}
